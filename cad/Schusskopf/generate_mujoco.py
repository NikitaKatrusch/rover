"""Generate a standalone MJCF for MuJoCo 3.17. No Python dependencies."""

import argparse
import json
import math
from pathlib import Path
import xml.etree.ElementTree as ET


HERE = Path(__file__).resolve().parent


def add(parent, tag, **attrs):
    def fmt(value):
        if isinstance(value, (list, tuple)):
            return " ".join(fmt(item) for item in value)
        return f"{value:.10g}" if isinstance(value, float) else str(value)

    return ET.SubElement(parent, tag, {key: fmt(value) for key, value in attrs.items()})


def build(geometry, dimensions, setup):
    wheel = geometry["rollers"]
    feed = geometry["feed"]
    deck = geometry["deck"]
    diameter = setup["ball_diameter_mm"]
    gap = setup["gap_mm"]
    guide_width = setup["guide_width_mm"]
    radius, half_width = wheel["diameter"] / 2000, wheel["width"] / 2000
    axis_distance = radius + gap / 2000
    center_z = max(geometry["ball"]["diameters"]) / 2000
    floor_z = wheel["centerZ"] / 1000 - center_z
    deck_top = deck["thickness"] / 1000 - floor_z
    motor = setup["proxy_motor"]
    mass = setup["roller_mass_g"] / 1000
    side_inertia = mass * (3 * radius**2 + (2 * half_width)**2) / 12
    spin_inertia = mass * radius**2 / 2
    winding_resistance = motor["resistance_ohm"]
    no_load_omega = motor["catalog_no_load_rpm"] * math.tau / 60
    supply = motor["catalog_voltage_v"]
    i0 = motor["assumed_no_load_current_a"]
    constant = (supply - winding_resistance * i0) / no_load_omega
    bearing_damping = constant * i0 / no_load_omega
    start_omega = setup["initial_rpm"] * math.tau / 60
    start_voltage = supply * start_omega / no_load_omega
    initial_current = i0 * start_omega / no_load_omega
    ball_r = diameter / 2000
    feed_speed = setup["feed_speed_m_s"]
    ball_pos = (-0.047, setup["lateral_offset_mm"] / 1000, ball_r)
    if (not wheel["gapRange"][0] <= gap <= wheel["gapRange"][1]
            or abs(ball_pos[1]) * 2000 > guide_width - diameter
            or start_voltage > supply or constant <= 0 or winding_resistance <= 0):
        raise ValueError("Auslegung außerhalb der vorgesehenen Abmessungen oder Motordaten.")

    model = ET.Element("mujoco", {"model": "Rover Schusskopf | zwei DC-Motoren"})
    model.append(ET.Comment("CAD dimensions in SI units. Motor electrical data and inertias are test assumptions."))
    add(model, "compiler", angle="radian", autolimits="true")
    add(model, "option", timestep=0.0005, integrator="implicitfast", cone="elliptic", gravity="0 0 -9.81")
    add(model, "statistic", center="-0.01 0 0.04", extent=0.24)
    visual = add(model, "visual")
    add(visual, "global", azimuth=138, elevation=-27)
    add(visual, "headlight", ambient="0.4 0.4 0.4", diffuse="0.7 0.7 0.7")
    default = add(model, "default")
    add(default, "geom", condim=3, friction="0.10 0.003 0.0001", rgba="0.48 0.54 0.62 1")
    world = add(model, "worldbody")
    add(world, "light", pos="-0.35 -0.3 0.55", dir="0.4 0.3 -1")
    add(world, "camera", name="Schusskopf", pos="-0.29 -0.42 0.29",
        xyaxes="0.823 -0.568 0 0.278 0.403 0.872")
    add(world, "geom", name="Umgebung", type="plane", pos=(0, 0, deck_top - 0.007),
        size="1 1 0.05", rgba="0.16 0.19 0.22 1")
    add(world, "geom", name="Grundplatte", type="box",
        pos=((deck["rearX"] + deck["length"] / 2) / 1000, 0, deck_top - deck["thickness"] / 2000),
        size=(deck["length"] / 2000, deck["width"] / 2000, deck["thickness"] / 2000),
        rgba="0.25 0.31 0.39 1")
    add(world, "geom", name="Ballkanal_Boden", type="box",
        pos=((feed["entryX"] + feed["exitX"]) / 2000, 0, deck_top / 2),
        size=((feed["exitX"] - feed["entryX"]) / 2000, (guide_width / 2 + feed["wall"]) / 1000, -deck_top / 2),
        rgba="0.12 0.44 0.42 1")
    for sign, side, color in [(1, "links", "0.22 0.53 0.89 1"), (-1, "rechts", "0.92 0.47 0.19 1")]:
        for name, x0, x1 in [("Einlauf", feed["entryX"], -feed["sideWallEndX"]),
                             ("Auslauf", feed["sideWallEndX"], feed["exitX"])]:
            add(world, "geom", name=f"{name}_{side}", type="box",
                pos=((x0+x1)/2000, sign*(guide_width+feed["wall"])/2000, feed["wallHeight"]/2000),
                size=((x1-x0)/2000, feed["wall"]/2000, feed["wallHeight"]/2000),
                rgba="0.18 0.65 0.57 1")
        hub_z = center_z + half_width + 0.002
        housing_half = dimensions["motor_775_body_length"] / 2000
        add(world, "geom", name=f"Motorgehaeuse_{side}_Bauraum", type="cylinder",
            pos=(0, sign*axis_distance, hub_z + 0.002 + housing_half),
            size=(dimensions["motor_775_body_diameter"] / 2000, housing_half),
            contype=0, conaffinity=0, rgba="0.45 0.49 0.53 1")
        roller = add(world, "body", name=f"Rolle_{side}", pos=(0, sign*axis_distance, center_z))
        add(roller, "inertial", pos="0 0 0", mass=mass, diaginertia=(side_inertia, side_inertia, spin_inertia))
        add(roller, "joint", name=f"Welle_{side}", type="hinge", axis="0 0 1",
            damping=bearing_damping, armature=motor["assumed_rotor_inertia_kg_m2"])
        add(roller, "geom", name=f"Laufflaeche_{side}", type="cylinder", size=(radius, half_width), rgba=color)
        add(roller, "geom", name=f"Nabenraum_{side}", type="cylinder", pos=(0, 0, half_width+0.002),
            size="0.008 0.002", contype=0, conaffinity=0, rgba="0.20 0.23 0.26 1")
        add(roller, "site", name=f"Drehmarke_{side}", type="box", pos=(radius-0.005, 0, half_width+0.001),
            size="0.003 0.002 0.001", rgba="1 1 1 1")

    ball = add(world, "body", name="Padelball", pos=ball_pos)
    add(ball, "freejoint", name="Ball_frei")
    ball_mass = setup["ball_mass_g"] / 1000
    add(ball, "inertial", pos="0 0 0", mass=ball_mass, diaginertia=(2*ball_mass*ball_r**2/3,)*3)
    add(ball, "geom", name="Ballkontakt", type="sphere", size=ball_r, rgba="0.89 0.87 0.19 1")
    add(ball, "site", name="Ball_Drehmarke", pos=(0, -0.004, ball_r-0.0008), size="0.003", rgba="0.29 0.30 0.08 1")
    pairs = add(model, "contact")
    for side in ("links", "rechts"):
        mu = setup["ball_roller_friction"]
        add(pairs, "pair", geom1="Ballkontakt", geom2=f"Laufflaeche_{side}", condim=3,
            friction=(mu, mu, 0.003, 0.0001, 0.0001), solref="0.012 0.8", solimp="0.15 0.92 0.003 0.5 2")
    actuators = add(model, "actuator")
    for side in ("links", "rechts"):
        add(actuators, "dcmotor", name=f"DC_775_{side}", joint=f"Welle_{side}", input="voltage",
            ctrlrange=(-supply, supply), resistance=winding_resistance, motorconst=(constant, constant),
            inductance=(motor["inductance_h"], 0), saturation=(0, motor["test_current_limit_a"], 0))
    sensors = add(model, "sensor")
    for side in ("links", "rechts"):
        add(sensors, "jointvel", name=f"Welle_{side}_rad_s", joint=f"Welle_{side}")
        add(sensors, "actuatorfrc", name=f"Motor_{side}_Nm", actuator=f"DC_775_{side}")
    add(sensors, "framelinvel", name="Ball_m_s", objtype="body", objname="Padelball")
    keyframes = add(model, "keyframe")
    add(keyframes, "key", name="Einzug", qpos=(0, 0, *ball_pos, 1, 0, 0, 0),
        qvel=(start_omega, -start_omega, feed_speed, 0, 0, 0, feed_speed/ball_r, 0),
        ctrl=(start_voltage, -start_voltage), act=(initial_current, -initial_current))
    add(keyframes, "key", name="Stillstand")
    return model


if __name__ == "__main__":
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--output", type=Path, default=HERE / "schusskopf.xml")
    args = cli.parse_args()
    read = lambda path: json.loads(path.read_text(encoding="utf-8"))
    sizes = {entry["parameter"]: entry["reported_mm"] for entry in read(HERE.parents[1] / "hardware" / "bauteilmasse.json")["dimensions"]}
    model = build(read(HERE / "auslegung.json"), sizes, read(HERE / "mujoco-setup.json"))
    ET.indent(model, space="  ")
    args.output.write_text(ET.tostring(model, encoding="unicode") + "\n", encoding="utf-8")
