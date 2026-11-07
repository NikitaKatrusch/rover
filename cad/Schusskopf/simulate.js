"use strict";

// Dimensions enter in mm. The integrator uses SI units throughout.
function simulateIntake(geometry, trial, record = false) {
  const mm = 0.001;
  const r = trial.ballDiameter * mm / 2;
  const R = geometry.rollers.diameter * mm / 2;
  const a = R + trial.gap * mm / 2;
  const rollerZ = (Math.max(...geometry.ball.diameters) / 2 + (trial.rollerHeightOffset ?? 0)) * mm;
  const halfRollerWidth = geometry.rollers.width * mm / 2;
  const guideHalf = trial.guideWidth * mm / 2;
  const wall = geometry.feed.wall * mm;
  const wallHeight = geometry.feed.wallHeight * mm;
  const near = geometry.feed.sideWallEndX * mm;
  const entry = geometry.feed.entryX * mm;
  const exit = geometry.feed.exitX * mm;
  const mass = 0.058;
  const inertia = 2 * mass * r * r / 3;
  const dt = trial.dt ?? 0.0005;
  const speed = trial.rollerSpeed ?? 2;
  const vIn = trial.feedSpeed;
  const stiffness = trial.stiffness;
  const gravity = 9.81;
  const floorK = 16000;
  const wallK = 9000;
  const floorFriction = 0.08;
  const wallFriction = 0.12;
  const maxOffset = guideHalf - r;
  if (![r,R,a,guideHalf,rollerZ,dt,speed,vIn,stiffness,trial.friction,trial.offset].every(Number.isFinite) ||
      dt <= 0 || dt > 0.0005 || r <= 0 || R <= 0 || trial.gap <= 0 ||
      speed < 0 || vIn <= 0 || stiffness <= 0 || trial.friction < 0 ||
      maxOffset < 0 || Math.abs(trial.offset * mm) > maxOffset + 1e-9) {
    throw new RangeError("Eingaben außerhalb des modellierten Einlaufs.");
  }

  let x = -0.047, y = trial.offset * mm, z = r - mass * gravity / floorK;
  let vx = vIn, vy = 0, vz = 0, wx = 0, wy = vIn / r, wz = 0;
  let fx, fy, fz, tx, ty, tz;
  let left = 0, right = 0, peak = 0, touched = false, both = false;
  let firstTouchX = null, firstTouchBoth = false, outcome = "stalled", time = 0;
  const frames = [];
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const damping = k => 0.7 * Math.sqrt(k * mass);
  const rollerDamping = damping(stiffness), guideDamping = damping(wallK), floorDamping = damping(floorK);

  function contact(nx, ny, nz, penetration, sx, sy, sz, k, c, mu) {
    if (penetration <= 0) return 0;
    // Relative surface velocity at the undeformed sphere's contact point.
    const rx = -r * nx, ry = -r * ny, rz = -r * nz;
    const ux = vx + wy * rz - wz * ry - sx;
    const uy = vy + wz * rx - wx * rz - sy;
    const uz = vz + wx * ry - wy * rx - sz;
    const vn = ux * nx + uy * ny + uz * nz;
    const normal = Math.max(0, k * penetration - c * vn);
    const dx = ux - vn * nx, dy = uy - vn * ny, dz = uz - vn * nz;
    const slip = Math.hypot(dx, dy, dz);
    // Regularized Coulomb friction. The impulse cap damps numerical slip reversals.
    const tangential = Math.min(mu * normal / Math.max(0.025, slip), 0.2 * mass / dt);
    const cx = normal * nx - tangential * dx;
    const cy = normal * ny - tangential * dy;
    const cz = normal * nz - tangential * dz;
    fx += cx; fy += cy; fz += cz;
    tx += ry * cz - rz * cy; ty += rz * cx - rx * cz; tz += rx * cy - ry * cx;
    return normal;
  }

  function roller(cy, sign) {
    const dy = y - cy;
    const radial = Math.hypot(x, dy);
    const vertical = z - rollerZ;
    const overRadius = radial - R;
    const overEnd = Math.abs(vertical) - halfRollerWidth;
    if (overRadius >= r || overEnd >= r) return 0;
    // Closest point on a finite cylinder, including a side edge or an end face.
    const radialDistance = Math.max(0, overRadius);
    const endDistance = Math.max(0, overEnd);
    const distance = Math.hypot(radialDistance, endDistance);
    if (distance >= r) return 0;
    const radialUnitX = radial ? x / radial : 1;
    const radialUnitY = radial ? dy / radial : 0;
    const cx = Math.min(radial, R) * radialUnitX;
    const cySurface = Math.min(radial, R) * radialUnitY;
    const omega = sign * speed / R;
    const nRadial = distance ? radialDistance / distance : Number(overRadius >= overEnd);
    const nVertical = Math.sign(vertical || 1) * (distance ? endDistance / distance : 1 - nRadial);
    const signedDistance = distance || Math.max(overRadius, overEnd);
    return contact(nRadial * radialUnitX, nRadial * radialUnitY, nVertical,
      r - signedDistance, -omega * cySurface, omega * cx, 0,
      stiffness, rollerDamping, trial.friction);
  }

  function guide(x0, x1, sign) {
    if (x < x0 - r || x > x1 + r || z > wallHeight + r || Math.abs(y - sign * guideHalf) > r + wall) return;
    const y0 = sign < 0 ? -guideHalf - wall : guideHalf;
    const y1 = y0 + wall;
    const dx = x - clamp(x, x0, x1);
    const dy = y - clamp(y, y0, y1);
    const dz = z - clamp(z, 0, wallHeight);
    const distance = Math.hypot(dx, dy, dz);
    if (distance > 0 && distance < r) {
      contact(dx / distance, dy / distance, dz / distance, r - distance,
        0, 0, 0, wallK, guideDamping, wallFriction);
    }
  }

  const snapshot = () => frames.push([time, x / mm, y / mm, z / mm, left, right]);
  if (record) snapshot();
  const steps = Math.ceil(1.05 / dt);
  for (let step = 1; step <= steps; step++) {
    time = step * dt;
    fx = 0; fy = 0; fz = -mass * gravity; tx = 0; ty = 0; tz = 0;
    contact(0, 0, 1, r - z, 0, 0, 0, floorK, floorDamping, floorFriction);
    guide(entry, -near, -1); guide(entry, -near, 1);
    guide(near, exit, -1); guide(near, exit, 1);
    left = roller(a, 1);
    right = roller(-a, -1);
    if (!touched && Math.max(left, right) > 0.01) {
      firstTouchX = x / mm;
      firstTouchBoth = Math.min(left, right) > 0.01;
      touched = true;
    }
    both ||= Math.min(left, right) > 0.1;
    peak = Math.max(peak, left, right);
    vx += dt * fx / mass; vy += dt * fy / mass; vz += dt * fz / mass;
    wx += dt * tx / inertia; wy += dt * ty / inertia; wz += dt * tz / inertia;
    x += dt * vx; y += dt * vy; z += dt * vz;
    if (![x,y,z,vx,vy,vz].every(Number.isFinite)) throw new Error("Numerisch instabiler Kontakt.");
    if (record && step % 12 === 0) snapshot();
    if (x >= 0.060) {
      outcome = both && vx > vIn + 0.05 ? "fed" : "passed";
      break;
    }
    if (x < -0.064 && vx < 0 && touched) { outcome = "rebound"; break; }
    if (Math.abs(y) > guideHalf + r) { outcome = "sideways"; break; }
  }
  if (record && frames.at(-1)[0] !== time) snapshot();
  return {outcome, time, peakForceN: peak, firstTouchX, firstTouchBoth,
    exitSpeed: outcome === "fed" || outcome === "passed" ? vx : null, frames};
}

if (typeof module !== "undefined") module.exports = { simulateIntake };
