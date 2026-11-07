"""Build the Rover V0 review assembly in Fusion, or check its layout in Python."""

from datetime import datetime, timezone
import json
import math
from pathlib import Path
import traceback


SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_DIR = SCRIPT_DIR.parent.parent


def read_layout():
    measurements = json.loads(
        (PROJECT_DIR / "hardware" / "bauteilmasse.json").read_text(encoding="utf-8")
    )
    layout = json.loads((SCRIPT_DIR / "layout.json").read_text(encoding="utf-8"))
    if measurements["length_unit"] != "mm" or layout["units"] != "mm":
        raise ValueError("Maße und Layout müssen in Millimetern vorliegen.")
    entries = {entry["parameter"]: entry for entry in measurements["dimensions"]}
    required = (
        "base_plate_length", "base_plate_width", "base_plate_thickness",
        "wheel_diameter", "wheel_width", "motor_775_body_diameter",
        "motor_775_body_length", "ball_diameter",
    )
    dimensions = {}
    for name in required:
        value = entries[name]["reported_mm"]
        if not isinstance(value, (int, float)) or isinstance(value, bool):
            raise ValueError(f"Für {name} fehlt ein numerischer Wert.")
        if not math.isfinite(value) or value <= 0:
            raise ValueError(f"Ungültiges Maß für {name}.")
        dimensions[name] = value
    return layout, entries, dimensions


def make_plan(layout, d):
    """Positions and nominal body dimensions in mm, with the floor at Z=0."""
    a = layout["layout_assumptions_mm"]
    length = d["base_plate_length"]
    half_width = d["base_plate_width"] / 2
    wheel_radius = d["wheel_diameter"] / 2
    wheel_width = d["wheel_width"]
    motor_length = d["motor_775_body_length"]
    motor_radius = d["motor_775_body_diameter"] / 2
    ball_radius = d["ball_diameter"] / 2
    axle_x = a["rear_axle_x"]
    underside = a["plate_underside_z"]
    side_gap = a["wheel_to_plate_side_gap"]
    parts = [
        ("Grundplatte - Referenz", "box", (-length / 2, -half_width, underside),
         ("base_plate_length", "base_plate_width", "base_plate_thickness")),
        ("Rad links - Hülle", "cylinder", (axle_x, half_width + side_gap, wheel_radius),
         ("wheel_diameter", "wheel_width")),
        ("Rad rechts - Hülle", "cylinder",
         (axle_x, -half_width - side_gap - wheel_width, wheel_radius),
         ("wheel_diameter", "wheel_width")),
        ("775 links - Hülle", "cylinder", (axle_x, half_width - motor_length, wheel_radius),
         ("motor_775_body_diameter", "motor_775_body_length")),
        ("775 rechts - Hülle", "cylinder", (axle_x, -half_width, wheel_radius),
         ("motor_775_body_diameter", "motor_775_body_length")),
        ("Ball - Referenz", "sphere", (a["reference_ball_x"], 0, ball_radius),
         ("ball_diameter",)),
    ]
    clearances = {
        "ball_to_plate_mm": underside - 2 * ball_radius,
        "ball_to_motor_inner_face_each_side_mm": half_width - motor_length - ball_radius,
        "ball_channel_total_play_with_walls_mm": 2 * (
            half_width - motor_length - a["ball_guide_wall"] - ball_radius
        ),
        "wheel_to_plate_side_mm": side_gap,
        "motor_top_to_plate_mm": underside - wheel_radius - motor_radius,
        "wheel_track_mm": 2 * (half_width + side_gap) + wheel_width,
        "ball_center_to_axle_x_mm": a["reference_ball_x"] - axle_x,
    }
    return parts, clearances


def auger_trial_clearances(layout, ball_diameter):
    """Necessary packaging checks for a full annulus, before modeling contact."""
    trial = layout["auger_trial_mm"]
    core = trial["core_diameter"]
    return {
        "min_housing_id_at_zero_radial_play": core + 2 * ball_diameter,
        "radial_play": (trial["housing_inner_diameter"] - core) / 2 - ball_diameter,
        "axial_play_at_fixed_angle": trial["pitch"] - trial["flight_axial_thickness"] - ball_diameter,
    }


def expected_size(shape, keys, d):
    if shape == "box":
        return tuple(d[key] for key in keys)
    diameter = d[keys[0]]
    if shape == "cylinder":
        return diameter, d[keys[1]], diameter
    return diameter, diameter, diameter


def expected_minimum(part, d):
    _, shape, (x, y, z), keys = part
    if shape == "box":
        return x, y, z
    radius = d[keys[0]] / 2
    if shape == "cylinder":
        return x - radius, y, z - radius
    return x - radius, y - radius, z - radius


def sketch_body(component, shape, keys, d, core, fusion):
    sketch = component.sketches.add(component.xYConstructionPlane)
    sketch.name = "Bauraumkontur"
    point = core.Point3D.create
    dims = sketch.sketchDimensions
    if shape == "box":
        length, width = d[keys[0]] / 10, d[keys[1]] / 10
        lines = sketch.sketchCurves.sketchLines.addTwoPointRectangle(
            point(0, 0, 0), point(length, width, 0)
        )
        corners = [line.startSketchPoint for line in lines]
        origin = min(corners, key=lambda p: p.geometry.distanceTo(point(0, 0, 0)))
        opposite = min(corners, key=lambda p: p.geometry.distanceTo(point(length, width, 0)))
        horizontal = fusion.DimensionOrientations.HorizontalDimensionOrientation
        vertical = fusion.DimensionOrientations.VerticalDimensionOrientation
        dims.addDistanceDimension(origin, opposite, horizontal, point(length / 2, -1, 0)).parameter.expression = keys[0]
        dims.addDistanceDimension(origin, opposite, vertical, point(-1, width / 2, 0)).parameter.expression = keys[1]
    else:
        radius = d[keys[0]] / 20
        circle = sketch.sketchCurves.sketchCircles.addByCenterRadius(point(0, 0, 0), radius)
        dims.addDiameterDimension(circle, point(radius, radius, 0)).parameter.expression = keys[0]
    if sketch.profiles.count != 1:
        raise RuntimeError(f"Uneindeutiges Profil in {component.name}")
    extrudes = component.features.extrudeFeatures
    extrude = extrudes.addSimple(
        sketch.profiles.item(0),
        core.ValueInput.createByString(keys[-1]),
        fusion.FeatureOperations.NewBodyFeatureOperation,
    )
    sketch.isVisible = False
    return extrude.bodies.item(0)


def make_body(root, part, d, core, fusion):
    name, shape, position, keys = part
    transform = core.Matrix3D.create()
    if shape == "cylinder":
        transform.setToRotation(
            -math.pi / 2, core.Vector3D.create(1, 0, 0), core.Point3D.create(0, 0, 0)
        )
    transform.translation = core.Vector3D.create(*(value / 10 for value in position))
    occurrence = root.occurrences.addNewComponent(transform)
    component = occurrence.component
    component.name = name
    if shape == "sphere":
        temp = fusion.TemporaryBRepManager.get().createSphere(
            core.Point3D.create(0, 0, 0), d[keys[0]] / 20
        )
        feature = component.features.baseFeatures.add()
        feature.startEdit()
        try:
            body = component.bRepBodies.add(temp, feature)
            body.name = name
        finally:
            feature.finishEdit()
    else:
        body = sketch_body(component, shape, keys, d, core, fusion)
        body.name = name
    return occurrence


def run(context):
    import adsk.core as core
    import adsk.fusion as fusion

    app = core.Application.get()
    output = PROJECT_DIR / "builds" / datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    output.mkdir(parents=True)
    report_path = output / "pruefbericht.json"
    report = {"status": "running", "manufacturing_release": False}
    try:
        layout, entries, dimensions = read_layout()
        parts, clearances = make_plan(layout, dimensions)
        doc = app.documents.add(core.DocumentTypes.FusionDesignDocumentType)
        design = fusion.Design.cast(doc.products.itemByProductType("DesignProductType"))
        for name, value in dimensions.items():
            entry = entries[name]
            design.userParameters.add(
                name, core.ValueInput.createByString(f"{value} mm"), "mm",
                f"{entry['source']} / {entry['evidence_kind']}: {entry['note']}",
            )
        report.update(
            revision=layout["revision"], clearances_mm=clearances,
            dimension_sources={name: entries[name] for name in dimensions},
            layout_assumptions_mm=layout["layout_assumptions_mm"], bodies=[],
            auger_trial_mm=layout["auger_trial_mm"],
            auger_trial_clearances_mm=auger_trial_clearances(layout, dimensions["ball_diameter"]),
        )
        occurrences = [make_body(design.rootComponent, part, dimensions, core, fusion)
                       for part in parts]
        if not design.computeAll():
            raise RuntimeError("Fusion konnte die Baugruppe nicht vollständig berechnen.")
        for part, occurrence in zip(parts, occurrences):
            box = occurrence.preciseBoundingBox
            if box is None:
                raise RuntimeError(f"{part[0]}: kein B-Rep-Körper gefunden.")
            actual = tuple(
                10 * (getattr(box.maxPoint, axis) - getattr(box.minPoint, axis))
                for axis in ("x", "y", "z")
            )
            expected = expected_size(part[1], part[3], dimensions)
            if any(abs(a - b) > 0.05 for a, b in zip(actual, expected)):
                raise RuntimeError(f"{part[0]}: erwartet {expected}, aus Fusion gelesen {actual} mm")
            actual_min = tuple(10 * getattr(box.minPoint, axis) for axis in ("x", "y", "z"))
            expected_min = expected_minimum(part, dimensions)
            if any(abs(a - b) > 0.05 for a, b in zip(actual_min, expected_min)):
                raise RuntimeError(f"{part[0]}: Position erwartet {expected_min}, gemessen {actual_min} mm")
            report["bodies"].append({
                "name": part[0], "expected_xyz_mm": expected,
                "actual_xyz_mm": [round(value, 5) for value in actual],
                "expected_min_xyz_mm": expected_min,
                "actual_min_xyz_mm": [round(value, 5) for value in actual_min],
            })
        app.activeViewport.fit()
        exports = design.exportManager
        archive = output / "Rover_V0_Bauraum.f3d"
        if not exports.execute(exports.createFusionArchiveExportOptions(str(archive))):
            raise RuntimeError("Fusion-Archiv konnte nicht exportiert werden.")
        report["fusion_archive"] = archive.name
        step = output / "Rover_V0_Bauraum.step"
        try:
            if not exports.execute(exports.createSTEPExportOptions(str(step))):
                raise RuntimeError("STEP-Export fehlgeschlagen.")
            report["step"] = step.name
        except Exception as error:
            report["step_error"] = str(error)
        report["status"] = "verified"
    except Exception:
        report["status"] = "error"
        report["error"] = traceback.format_exc()
    report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    message = f"Rover V0: {report['status']}\n{report_path}"
    app.userInterface.messageBox(message)


if __name__ == "__main__":
    layout, _, dimensions = read_layout()
    parts, clearances = make_plan(layout, dimensions)
    print(json.dumps({
        "revision": layout["revision"], "parts": len(parts),
        "clearances_mm": clearances,
        "auger_trial_clearances_mm": auger_trial_clearances(layout, dimensions["ball_diameter"]),
    }, indent=2))
