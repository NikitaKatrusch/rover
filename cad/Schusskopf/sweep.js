"use strict";

const geometry = require("./auslegung.json");
const { simulateIntake } = require("./simulate.js");
const ballSizes = [geometry.ball.diameters[0], 66, geometry.ball.diameters[1]];
const frictionValues = [0.12, 0.20, 0.32];
const stiffnessValues = [3000, 8000];
const feedSpeeds = [0.10, 0.22];
const offsetFractions = [0, 0.9];
const [minGap, maxGap] = geometry.rollers.gapRange;

function evaluate(preset, { gapError = 0, dt } = {}) {
  const outcomes = { fed: 0, passed: 0, rebound: 0, sideways: 0, stalled: 0 };
  const byDiameter = {};
  let peakForceN = 0;
  for (const ballDiameter of ballSizes) {
    const nominalGap = preset.compression === undefined ? preset.gap : ballDiameter - preset.compression;
    const gap = nominalGap + gapError;
    const guideWidth = preset.guideClearance === undefined ? geometry.feed.innerWidth : ballDiameter + preset.guideClearance;
    let fed = 0;
    for (const friction of frictionValues) {
      for (const stiffness of stiffnessValues) {
        for (const feedSpeed of feedSpeeds) {
          for (const offsetFraction of offsetFractions) {
            const trial = simulateIntake(geometry, { ballDiameter, gap, guideWidth, friction, stiffness, feedSpeed, dt,
              offset: offsetFraction * (guideWidth - ballDiameter) / 2 });
            outcomes[trial.outcome]++;
            if (trial.outcome === "fed") fed++;
            peakForceN = Math.max(peakForceN, trial.peakForceN);
          }
        }
      }
    }
    byDiameter[ballDiameter] = fed;
  }
  return { ...preset, outcomes, byDiameter, peakForceN: Number(peakForceN.toFixed(2)) };
}

const candidates = [];
for (const guideClearance of [undefined, 2, 1]) {
  for (let gap = minGap; gap <= maxGap; gap += 0.5) {
    candidates.push(evaluate({ gap, guideClearance }));
  }
  for (const compression of [0.5, 1, 1.5]) {
    if (ballSizes.every(diameter => diameter - compression >= minGap && diameter - compression <= maxGap)) {
      candidates.push(evaluate({ compression, guideClearance }));
    }
  }
}
const ranking = (a, b) => b.outcomes.fed - a.outcomes.fed || a.peakForceN - b.peakForceN;
const selectBest = predicate => candidates.filter(predicate).sort(ranking)[0];
const perCandidate = ballSizes.length * frictionValues.length * stiffnessValues.length * feedSpeeds.length * offsetFractions.length;
const toleranceChecks = [];
for (const compression of [0.5, 1]) {
  for (const gapError of [-0.4, 0, 0.4]) {
    const preset = { compression, guideClearance: 2 };
    const baseline = evaluate(preset, { gapError });
    const halfStep = evaluate(preset, { gapError, dt: 0.00025 });
    toleranceChecks.push({ compression, gapError, fed: baseline.outcomes.fed,
      fedAtHalfTimeStep: halfStep.outcomes.fed, peakForceN: halfStep.peakForceN });
  }
}
console.log(JSON.stringify({
  parameters: { ballSizes, frictionValues, stiffnessValues, feedSpeeds, offsetFractions, rollerSpeed: 2 },
  perCandidate, candidateCount: candidates.length, runs: candidates.length * perCandidate,
  existing: candidates.find(c => c.gap === geometry.rollers.gap && c.guideClearance === undefined),
  bestFixedExistingGuide: selectBest(c => c.gap !== undefined && c.guideClearance === undefined),
  bestFixedCentered: selectBest(c => c.gap !== undefined && c.guideClearance !== undefined),
  bestAdjustableExistingGuide: selectBest(c => c.compression !== undefined && c.guideClearance === undefined),
  bestAdjustableCentered: selectBest(c => c.compression !== undefined && c.guideClearance !== undefined),
  toleranceChecks,
  candidateResults: candidates,
}, null, 2));
