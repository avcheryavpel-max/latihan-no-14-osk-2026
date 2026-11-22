import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeThreeMassChain,
  collide1D,
  energyTransferFraction,
  optimalMiddleMass,
  sampleSimulationAt,
  simulateEventDriven1D,
} from './collisionEngine';
import {
  evaluateNumericAnswer,
  formatIndonesianDecimal,
  parseStudentNumericAnswer,
} from './answerEvaluator';
import { PRACTICE_QUESTIONS } from '../data/questionsBank';

test('OSK 2026 No. 14 exact reference parameters: m1=9, m3=0.25 -> m2=1.5 kg', () => {
  const m2Opt = optimalMiddleMass(9, 0.25);
  assert.equal(m2Opt, 1.5);
  const chain = analyzeThreeMassChain(9, m2Opt, 0.25, 1.0, 1);
  assert.equal(chain.hasSecondaryM1M2, false);
  assert.equal(chain.hasBounceBackM2, false);
  assert.ok(Math.abs(chain.v3AfterSecond - 144 / 49) < 1e-9);
});

test('All 15 practice questions match exact physics simulation & conservation laws', () => {
  assert.equal(PRACTICE_QUESTIONS.length, 15);

  for (const q of PRACTICE_QUESTIONS) {
    const timeline = simulateEventDriven1D(q.simulationConfig);

    // Check momentum & KE conservation on pure 1D elastic tracks (no external wall/ramp/spring)
    if (
      q.simulationConfig.wallX === undefined &&
      !q.simulationConfig.spring &&
      !q.simulationConfig.initialRamp &&
      !q.simulationConfig.finalRamp
    ) {
      const startState = sampleSimulationAt(timeline, 0);
      const endState = sampleSimulationAt(timeline, timeline.totalDuration);

      assert.ok(
        Math.abs(startState.totalMomentum - endState.totalMomentum) < 1e-6,
        `Momentum not conserved in Q${q.id}`
      );
      if ((q.simulationConfig.restitution ?? 1) === 1) {
        assert.ok(
          Math.abs(startState.totalKineticEnergy - endState.totalKineticEnergy) < 1e-6,
          `KE not conserved in Q${q.id}`
        );
      }
    }

    // Verify exact answer for each specific question against physics engine
    if (q.id === 1) {
      const [, v2] = collide1D(4, 6, 2, 0, 1);
      assert.ok(Math.abs(v2 - q.expectedAnswer) < 1e-6);
    } else if (q.id === 2) {
      const pct = energyTransferFraction(2, 6, 1) * 100;
      assert.ok(Math.abs(pct - q.expectedAnswer) < 1e-6);
    } else if (q.id === 3) {
      assert.ok(Math.abs(optimalMiddleMass(16, 1) - q.expectedAnswer) < 1e-6);
    } else if (q.id === 4) {
      assert.ok(Math.abs(timeline.finalVelocities[2] - q.expectedAnswer) < 1e-6);
    } else if (q.id === 5) {
      const p3 = 0.5 * timeline.finalVelocities[2];
      assert.ok(Math.abs(p3 - q.expectedAnswer) < 1e-6);
    } else if (q.id === 6) {
      const diff = timeline.finalVelocities[2] - timeline.finalVelocities[0];
      assert.ok(Math.abs(diff - q.expectedAnswer) < 1e-6);
    } else if (q.id === 7) {
      assert.ok(
        Math.abs(timeline.finalVelocities[0] - timeline.finalVelocities[1]) < 1e-6,
        'Q7 critical condition v1_final === v2_final failed'
      );
    } else if (q.id === 8) {
      assert.equal(timeline.events.length, 4, 'Q8 should produce exactly 4 collisions');
      assert.ok(Math.abs(timeline.finalVelocities[2] - q.expectedAnswer) < 1e-6);
    } else if (q.id === 9) {
      assert.ok(Math.abs(timeline.finalVelocities[3] - q.expectedAnswer) < 1e-6);
    } else if (q.id === 10) {
      assert.ok(Math.abs(Math.abs(timeline.finalVelocities[0]) - q.expectedAnswer) < 1e-6);
    } else if (q.id === 11) {
      const k3 = 0.5 * 1.0 * Math.pow(timeline.finalVelocities[2], 2);
      assert.ok(Math.abs(k3 - q.expectedAnswer) < 1e-6);
    } else if (q.id === 12) {
      assert.ok(Math.abs(optimalMiddleMass(9, 1) - q.expectedAnswer) < 1e-6);
      assert.ok(timeline.finalVelocities[1] > timeline.finalVelocities[0]);
    } else if (q.id === 13) {
      assert.ok(Math.abs(timeline.finalVelocities[2] - q.expectedAnswer) < 1e-6);
    } else if (q.id === 14) {
      assert.ok(
        timeline.maxClimbHeight !== undefined &&
          Math.abs(timeline.maxClimbHeight - q.expectedAnswer) < 1e-6
      );
    } else if (q.id === 15) {
      assert.ok(
        timeline.maxSpringCompression !== undefined &&
          Math.abs(timeline.maxSpringCompression * 100 - q.expectedAnswer) < 1e-6
      );
    }
  }
});

test('Answer evaluator parses Indonesian decimal format strictly', () => {
  assert.equal(parseStudentNumericAnswer(' 14,4 '), 14.4);
  assert.equal(parseStudentNumericAnswer('14.40'), 14.4);
  assert.equal(parseStudentNumericAnswer('-3,2'), -3.2);
  assert.equal(parseStudentNumericAnswer('abc'), null);
  assert.equal(parseStudentNumericAnswer(''), null);

  assert.equal(formatIndonesianDecimal(8), '8,0');
  assert.equal(formatIndonesianDecimal(14.4), '14,4');

  assert.equal(evaluateNumericAnswer('14,4', 14.4).isCorrect, true);
  assert.equal(evaluateNumericAnswer(' 14,40 ', 14.4).isCorrect, true);
  assert.equal(evaluateNumericAnswer('8', 8.0).isCorrect, true);
  assert.equal(evaluateNumericAnswer('14,3', 14.4).isCorrect, false);
  assert.equal(evaluateNumericAnswer('14,5', 14.4).isCorrect, false);
});
