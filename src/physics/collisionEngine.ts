export interface PhysicsBodyConfig {
  id: string;
  label: string;
  mass: number;
  x0: number; // meters along track
  v0: number; // m/s
  radius: number; // visual/physical half-width in meters
  color: string;
}

export interface SimulationConfig {
  bodies: PhysicsBodyConfig[];
  restitution?: number; // default 1.0 (elastic)
  wallX?: number; // optional rigid wall at x = wallX
  spring?: {
    attachedToIndex: number; // index of rightmost body
    k: number; // N/m
    equilibriumX: number; // equilibrium x of body center
    wallX: number;
  };
  initialRamp?: {
    bodyIndex: number;
    height: number; // meters
    gravity: number; // m/s^2
    flatEntryX: number;
  };
  finalRamp?: {
    bodyIndex: number;
    startX: number;
    gravity: number;
    angleDeg: number;
  };
  maxEvents?: number;
  duration?: number;
}

export interface TimelineSegment {
  tStart: number;
  tEnd: number;
  positionsStart: number[];
  velocities: number[];
  caption: string;
  highlightBodyIndices?: number[];
  isSpringPhase?: boolean;
  springOmega?: number;
  springAmplitude?: number;
  springCenterX?: number;
}

export interface CollisionEventRecord {
  time: number;
  kind: 'body-body' | 'wall' | 'spring-compress' | 'ramp-bottom' | 'ramp-climb';
  involvedLabels: string[];
  velocitiesBefore: number[];
  velocitiesAfter: number[];
  summary: string;
}

export interface SimulationTimeline {
  config: SimulationConfig;
  segments: TimelineSegment[];
  events: CollisionEventRecord[];
  totalDuration: number;
  finalVelocities: number[];
  maxSpringCompression?: number;
  maxClimbHeight?: number;
}

export interface SampledBodyState {
  id: string;
  label: string;
  mass: number;
  x: number;
  y: number; // height above flat track (for ramp problems)
  v: number;
  p: number;
  ke: number;
  radius: number;
  color: string;
}

export interface SampledSimulationState {
  time: number;
  bodies: SampledBodyState[];
  totalMomentum: number;
  totalKineticEnergy: number;
  springCompression: number; // meters (>=0)
  caption: string;
  highlightBodyIndices: number[];
  recentEvent?: CollisionEventRecord;
}

/**
 * Exact 1D collision velocities for two bodies (m1, v1) and (m2, v2) with restitution e.
 */
export function collide1D(
  m1: number,
  v1: number,
  m2: number,
  v2: number,
  e = 1
): [number, number] {
  const totalMass = m1 + m2;
  const v1Prime = ((m1 - e * m2) * v1 + (1 + e) * m2 * v2) / totalMass;
  const v2Prime = ((1 + e) * m1 * v1 + (m2 - e * m1) * v2) / totalMass;
  return [v1Prime, v2Prime];
}

/**
 * Fraction of initial kinetic energy transferred from moving m1 to stationary m2.
 */
export function energyTransferFraction(m1: number, m2: number, e = 1): number {
  return (Math.pow(1 + e, 2) * m1 * m2) / Math.pow(m1 + m2, 2);
}

/**
 * Optimal intermediate mass m2 = sqrt(m1 * m3) that maximizes final speed of m3
 * in a sequential 1D collision m1 -> m2 -> m3 (with m2, m3 initially at rest).
 */
export function optimalMiddleMass(m1: number, m3: number): number {
  return Math.sqrt(m1 * m3);
}

/**
 * Compute sequential 2-collision velocities (assuming no secondary catch-up collision)
 * and report whether a secondary m1-m2 or m2-m3 collision will occur.
 */
export function analyzeThreeMassChain(
  m1: number,
  m2: number,
  m3: number,
  v0: number,
  e = 1
): {
  v1AfterFirst: number;
  v2AfterFirst: number;
  v2AfterSecond: number;
  v3AfterSecond: number;
  hasSecondaryM1M2: boolean;
  hasBounceBackM2: boolean;
} {
  const [v1AfterFirst, v2AfterFirst] = collide1D(m1, v0, m2, 0, e);
  const [v2AfterSecond, v3AfterSecond] = collide1D(m2, v2AfterFirst, m3, 0, e);
  return {
    v1AfterFirst,
    v2AfterFirst,
    v2AfterSecond,
    v3AfterSecond,
    hasSecondaryM1M2: v1AfterFirst > v2AfterSecond + 1e-9,
    hasBounceBackM2: v2AfterSecond < -1e-9,
  };
}

/**
 * Exact event-driven 1D collision timeline builder.
 * Handles sequential collisions, re-collisions, rigid wall bounces,
 * initial downhill ramp drop, final uphill ramp climb, and spring compression.
 */
export function simulateEventDriven1D(config: SimulationConfig): SimulationTimeline {
  const e = config.restitution ?? 1.0;
  const maxEvents = config.maxEvents ?? 20;
  const n = config.bodies.length;

  const pos = config.bodies.map((b) => b.x0);
  const vel = config.bodies.map((b) => b.v0);
  const masses = config.bodies.map((b) => b.mass);
  const radii = config.bodies.map((b) => b.radius);
  const labels = config.bodies.map((b) => b.label);

  const segments: TimelineSegment[] = [];
  const events: CollisionEventRecord[] = [];

  let currentTime = 0;

  // Handle initial ramp drop as an analytical pre-phase if configured
  if (config.initialRamp) {
    const idx = config.initialRamp.bodyIndex;
    const g = config.initialRamp.gravity;
    const h = config.initialRamp.height;
    const vBottom = Math.sqrt(2 * g * h);
    const rampHorizontalSpan = Math.max(0.5, config.initialRamp.flatEntryX - pos[idx]);
    // Approximate smooth slide duration along quarter-ellipse/ramp: t = 2 * L / vBottom
    const slideDuration = (2 * rampHorizontalSpan) / vBottom;

    segments.push({
      tStart: 0,
      tEnd: slideDuration,
      positionsStart: [...pos],
      velocities: vel.map((v, i) => (i === idx ? vBottom / 2 : v)),
      caption: `${labels[idx]} meluncur menuruni lintasan licin dari ketinggian ${h.toFixed(1).replace('.', ',')} m`,
      highlightBodyIndices: [idx],
    });

    const vBefore = [...vel];
    pos[idx] = config.initialRamp.flatEntryX;
    vel[idx] = vBottom;
    currentTime = slideDuration;

    events.push({
      time: currentTime,
      kind: 'ramp-bottom',
      involvedLabels: [labels[idx]],
      velocitiesBefore: vBefore,
      velocitiesAfter: [...vel],
      summary: `${labels[idx]} mencapai dasar lintasan dengan kelajuan ${vBottom.toFixed(1).replace('.', ',')} m/s`,
    });
  }

  let eventCount = 0;
  const targetEndTime = config.duration ?? 6.0;
  let maxSpringCompression = 0;
  let maxClimbHeight = 0;
  let springHandled = false;

  while (eventCount < maxEvents && currentTime < targetEndTime) {
    let minDt = Infinity;
    let nextType: 'body-body' | 'wall' | 'spring' | null = null;
    let nextPairIdx = -1;

    // 1. Check adjacent body-body collisions (bodies stay ordered left-to-right)
    for (let i = 0; i < n - 1; i++) {
      const relV = vel[i] - vel[i + 1];
      if (relV > 1e-9) {
        const gap = pos[i + 1] - radii[i + 1] - (pos[i] + radii[i]);
        const dt = Math.max(0, gap / relV);
        if (dt < minDt) {
          minDt = dt;
          nextType = 'body-body';
          nextPairIdx = i;
        }
      }
    }

    // 2. Check rightmost body against rigid wall
    if (config.wallX !== undefined) {
      const last = n - 1;
      if (vel[last] > 1e-9) {
        const gap = config.wallX - (pos[last] + radii[last]);
        const dt = Math.max(0, gap / vel[last]);
        if (dt < minDt) {
          minDt = dt;
          nextType = 'wall';
          nextPairIdx = last;
        }
      }
    }

    // 3. Check spring compression trigger (when attached body gains positive velocity)
    if (config.spring && !springHandled) {
      const sIdx = config.spring.attachedToIndex;
      if (vel[sIdx] > 1e-9 && pos[sIdx] >= config.spring.equilibriumX - 1e-6) {
        const dt = 0;
        if (dt <= minDt) {
          minDt = dt;
          nextType = 'spring';
          nextPairIdx = sIdx;
        }
      }
    }

    if (nextType === null || currentTime + minDt > targetEndTime) {
      break;
    }

    if (nextType === 'spring' && config.spring) {
      springHandled = true;
      const sIdx = config.spring.attachedToIndex;
      const vEntry = vel[sIdx];
      const omega = Math.sqrt(config.spring.k / masses[sIdx]);
      const amp = vEntry / omega;
      maxSpringCompression = amp;
      const quarterPeriod = Math.PI / (2 * omega);
      const halfPeriod = Math.PI / omega;
      const visualSlowFactor = 6; // slow down fast stiff spring slightly only if < 0.08s? Wait: keep exact physical time or scaled? Let's keep physical time and let UI speed control slow it down!
      void visualSlowFactor;

      const compEnd = Math.min(targetEndTime, currentTime + quarterPeriod);
      segments.push({
        tStart: currentTime,
        tEnd: compEnd,
        positionsStart: [...pos],
        velocities: [...vel],
        caption: `${labels[sIdx]} menekan pegas hingga kompresi maksimum ${(amp * 100).toFixed(1).replace('.', ',')} cm`,
        highlightBodyIndices: [sIdx],
        isSpringPhase: true,
        springOmega: omega,
        springAmplitude: amp,
        springCenterX: pos[sIdx],
      });

      const vBefore = [...vel];
      vel[sIdx] = 0;
      events.push({
        time: compEnd,
        kind: 'spring-compress',
        involvedLabels: [labels[sIdx]],
        velocitiesBefore: vBefore,
        velocitiesAfter: [...vel],
        summary: `Pegas mencapai kompresi maksimum x_maks = ${(amp * 100).toFixed(1).replace('.', ',')} cm (v_${sIdx + 1} = 0)`,
      });

      currentTime = compEnd;
      // After max compression, let spring rebound smoothly if duration remains
      if (currentTime < targetEndTime) {
        const reboundEnd = Math.min(targetEndTime, currentTime + quarterPeriod);
        segments.push({
          tStart: currentTime,
          tEnd: reboundEnd,
          positionsStart: pos.map((p, idx) => (idx === sIdx ? p + amp : p)),
          velocities: vel.map((v, idx) => (idx === sIdx ? -vEntry : v)),
          caption: `Pegas memantulkan ${labels[sIdx]} kembali ke kiri`,
          highlightBodyIndices: [sIdx],
          isSpringPhase: true,
          springOmega: omega,
          springAmplitude: amp,
          springCenterX: config.spring.equilibriumX,
        });
        vel[sIdx] = -vEntry;
        pos[sIdx] = config.spring.equilibriumX;
        currentTime = reboundEnd;
      }
      void halfPeriod;
      break;
    }

    // Advance all bodies over minDt
    if (minDt > 1e-7) {
      const startCaption =
        events.length === 0
          ? `Keadaan awal: ${labels[0]} bergerak mendekati sistem`
          : `Benda bergerak bebas menuju tumbukan berikutnya`;
      segments.push({
        tStart: currentTime,
        tEnd: currentTime + minDt,
        positionsStart: [...pos],
        velocities: [...vel],
        caption: startCaption,
      });
      for (let i = 0; i < n; i++) {
        pos[i] += vel[i] * minDt;
      }
      currentTime += minDt;
    }

    const vBefore = [...vel];
    if (nextType === 'body-body') {
      const i = nextPairIdx;
      const [vA, vB] = collide1D(masses[i], vel[i], masses[i + 1], vel[i + 1], e);
      vel[i] = vA;
      vel[i + 1] = vB;
      events.push({
        time: currentTime,
        kind: 'body-body',
        involvedLabels: [labels[i], labels[i + 1]],
        velocitiesBefore: vBefore,
        velocitiesAfter: [...vel],
        summary: `Tumbukan ${events.length + 1}: ${labels[i]} menumbuk ${labels[i + 1]} → v_${i + 1} = ${vA.toFixed(1).replace('.', ',')} m/s, v_${i + 2} = ${vB.toFixed(1).replace('.', ',')} m/s`,
      });
    } else if (nextType === 'wall') {
      const last = nextPairIdx;
      vel[last] = -e * vel[last];
      events.push({
        time: currentTime,
        kind: 'wall',
        involvedLabels: [labels[last], 'Dinding'],
        velocitiesBefore: vBefore,
        velocitiesAfter: [...vel],
        summary: `${labels[last]} memantul elastis pada dinding → v = ${vel[last].toFixed(1).replace('.', ',')} m/s`,
      });
    }

    eventCount++;
  }

  // Handle final uphill ramp if configured
  if (config.finalRamp) {
    const idx = config.finalRamp.bodyIndex;
    const vLaunch = vel[idx];
    const g = config.finalRamp.gravity;
    const hMax = (vLaunch * vLaunch) / (2 * g);
    maxClimbHeight = hMax;

    // Flat approach to ramp startX
    if (pos[idx] < config.finalRamp.startX && vLaunch > 1e-6) {
      const dtFlat = (config.finalRamp.startX - pos[idx]) / vLaunch;
      const tEndFlat = Math.min(targetEndTime, currentTime + dtFlat);
      segments.push({
        tStart: currentTime,
        tEnd: tEndFlat,
        positionsStart: [...pos],
        velocities: [...vel],
        caption: `${labels[idx]} meluncur cepat menuju kaki tanjakan dengan v = ${vLaunch.toFixed(1).replace('.', ',')} m/s`,
        highlightBodyIndices: [idx],
      });
      for (let i = 0; i < n; i++) {
        pos[i] += vel[i] * (tEndFlat - currentTime);
      }
      currentTime = tEndFlat;
    }

    if (currentTime < targetEndTime && vLaunch > 1e-6) {
      const sinTheta = Math.sin((config.finalRamp.angleDeg * Math.PI) / 180);
      const decel = g * sinTheta;
      const climbTime = vLaunch / decel;
      const tEndClimb = Math.min(targetEndTime, currentTime + climbTime);
      segments.push({
        tStart: currentTime,
        tEnd: tEndClimb,
        positionsStart: [...pos],
        velocities: [...vel],
        caption: `${labels[idx]} mendaki tanjakan hingga berhenti sesaat di H_maks = ${hMax.toFixed(1).replace('.', ',')} m`,
        highlightBodyIndices: [idx],
      });
      events.push({
        time: tEndClimb,
        kind: 'ramp-climb',
        involvedLabels: [labels[idx]],
        velocitiesBefore: [...vel],
        velocitiesAfter: vel.map((v, i) => (i === idx ? 0 : v)),
        summary: `${labels[idx]} mencapai ketinggian maksimum H_maks = ${hMax.toFixed(1).replace('.', ',')} m`,
      });
      currentTime = tEndClimb;
    }
  }

  // Final steady-motion segment
  if (currentTime < targetEndTime) {
    segments.push({
      tStart: currentTime,
      tEnd: targetEndTime,
      positionsStart: [...pos],
      velocities: [...vel],
      caption:
        events.length > 0
          ? `Keadaan akhir: seluruh tumbukan selesai (${events[events.length - 1].summary})`
          : `Gerak seragam`,
    });
  }

  return {
    config,
    segments,
    events,
    totalDuration: Math.max(targetEndTime, currentTime),
    finalVelocities: [...vel],
    maxSpringCompression: maxSpringCompression || undefined,
    maxClimbHeight: maxClimbHeight || undefined,
  };
}

/**
 * Sample the exact physical state of every body at time t from a precomputed SimulationTimeline.
 */
export function sampleSimulationAt(
  timeline: SimulationTimeline,
  t: number
): SampledSimulationState {
  const clampedT = Math.max(0, Math.min(t, timeline.totalDuration));
  const { config, segments, events } = timeline;
  const n = config.bodies.length;

  let activeSeg = segments[segments.length - 1];
  for (const seg of segments) {
    if (clampedT >= seg.tStart && clampedT <= seg.tEnd + 1e-9) {
      activeSeg = seg;
      break;
    }
  }

  const dt = Math.max(0, clampedT - activeSeg.tStart);
  const bodies: SampledBodyState[] = [];
  let totalMomentum = 0;
  let totalKineticEnergy = 0;
  let springCompression = 0;

  for (let i = 0; i < n; i++) {
    const bCfg = config.bodies[i];
    let x = activeSeg.positionsStart[i] + activeSeg.velocities[i] * dt;
    let y = 0;
    let v = activeSeg.velocities[i];

    // Special analytical kinematics for initial ramp
    if (
      config.initialRamp &&
      i === config.initialRamp.bodyIndex &&
      segments.length > 0 &&
      activeSeg === segments[0]
    ) {
      const dur = Math.max(1e-6, activeSeg.tEnd - activeSeg.tStart);
      const frac = Math.min(1, dt / dur);
      const vBottom = Math.sqrt(2 * config.initialRamp.gravity * config.initialRamp.height);
      x =
        activeSeg.positionsStart[i] +
        (config.initialRamp.flatEntryX - activeSeg.positionsStart[i]) * (frac * frac);
      y = config.initialRamp.height * Math.pow(1 - frac, 2);
      v = vBottom * frac;
    }

    // Special analytical kinematics for spring harmonic phase
    if (
      activeSeg.isSpringPhase &&
      config.spring &&
      i === config.spring.attachedToIndex &&
      activeSeg.springOmega &&
      activeSeg.springAmplitude !== undefined &&
      activeSeg.springCenterX !== undefined
    ) {
      const omega = activeSeg.springOmega;
      const amp = activeSeg.springAmplitude;
      // Distinguish compression stroke vs rebound stroke
      if (activeSeg.velocities[i] > 0) {
        const disp = amp * Math.sin(omega * dt);
        x = activeSeg.springCenterX + disp;
        v = amp * omega * Math.cos(omega * dt);
        springCompression = Math.max(0, disp);
      } else {
        const disp = amp * Math.cos(omega * dt);
        x = activeSeg.springCenterX + disp;
        v = -amp * omega * Math.sin(omega * dt);
        springCompression = Math.max(0, disp);
      }
    }

    // Special analytical kinematics for final uphill climb
    if (
      config.finalRamp &&
      i === config.finalRamp.bodyIndex &&
      clampedT >= activeSeg.tStart &&
      activeSeg.caption.includes('mendaki tanjakan')
    ) {
      const g = config.finalRamp.gravity;
      const sinTheta = Math.sin((config.finalRamp.angleDeg * Math.PI) / 180);
      const cosTheta = Math.cos((config.finalRamp.angleDeg * Math.PI) / 180);
      const v0 = activeSeg.velocities[i];
      const decel = g * sinTheta;
      const dist = Math.max(0, v0 * dt - 0.5 * decel * dt * dt);
      v = Math.max(0, v0 - decel * dt);
      x = activeSeg.positionsStart[i] + dist * cosTheta;
      y = dist * sinTheta;
    }

    const p = bCfg.mass * v;
    const ke = 0.5 * bCfg.mass * v * v;
    totalMomentum += p;
    totalKineticEnergy += ke;

    bodies.push({
      id: bCfg.id,
      label: bCfg.label,
      mass: bCfg.mass,
      x,
      y,
      v,
      p,
      ke,
      radius: bCfg.radius,
      color: bCfg.color,
    });
  }

  let recentEvent: CollisionEventRecord | undefined;
  for (const ev of events) {
    if (ev.time <= clampedT + 1e-6) {
      recentEvent = ev;
    }
  }

  return {
    time: clampedT,
    bodies,
    totalMomentum,
    totalKineticEnergy,
    springCompression,
    caption: activeSeg.caption,
    highlightBodyIndices: activeSeg.highlightBodyIndices ?? [],
    recentEvent,
  };
}
