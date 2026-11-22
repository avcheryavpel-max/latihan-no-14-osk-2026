import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import {
  sampleSimulationAt,
  simulateEventDriven1D,
  type SimulationConfig,
  type SimulationTimeline,
} from '../physics/collisionEngine';

interface PhysicsProofAnimatorProps {
  config: SimulationConfig;
  title?: string;
  formulaOverlay?: string;
  autoPlaySignal?: number;
}

const SPEED_LEVELS = [0.25, 0.5, 1.0, 1.5];

function fmtComma(val: number, digits = 1): string {
  const safe = Math.abs(val) < 1e-6 ? 0 : val;
  return safe.toFixed(digits).replace('.', ',');
}

export function PhysicsProofAnimator({
  config,
  title = 'Animasi Pembuktian Hukum Fisika',
  formulaOverlay,
  autoPlaySignal = 0,
}: PhysicsProofAnimatorProps) {
  const timeline: SimulationTimeline = useMemo(
    () => simulateEventDriven1D(config),
    [config]
  );

  // Compute bounding world range so all bodies remain visible across [0, totalDuration]
  const bounds = useMemo(() => {
    let minX = Infinity;
    let maxX = -Infinity;
    let maxY = 0;
    const steps = 60;
    for (let s = 0; s <= steps; s++) {
      const t = (s / steps) * timeline.totalDuration;
      const sample = sampleSimulationAt(timeline, t);
      for (const b of sample.bodies) {
        minX = Math.min(minX, b.x - b.radius - 0.8);
        maxX = Math.max(maxX, b.x + b.radius + 0.8);
        maxY = Math.max(maxY, b.y);
      }
    }
    if (config.wallX !== undefined) {
      maxX = Math.max(maxX, config.wallX + 0.7);
    }
    if (config.spring) {
      maxX = Math.max(maxX, config.spring.wallX + 0.7);
    }
    if (config.finalRamp) {
      maxY = Math.max(maxY, timeline.maxClimbHeight ?? 5);
    }
    // Clamp reasonable padding
    minX = Math.min(minX, -0.5);
    maxX = Math.max(maxX, minX + 6.0);
    return { minX, maxX, maxY: Math.max(maxY, 1) };
  }, [config, timeline]);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(0.5);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastFrameTsRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const speedRef = useRef<number>(speed);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Reset when config changes
  useEffect(() => {
    timeRef.current = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  }, [config]);

  // Trigger autoplay when parent clicks "PUTAR ANIMASI PEMBUKTIAN"
  useEffect(() => {
    if (autoPlaySignal > 0) {
      timeRef.current = 0;
      setCurrentTime(0);
      setIsPlaying(true);
    }
  }, [autoPlaySignal]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      lastFrameTsRef.current = null;
      return;
    }

    const tick = (now: number) => {
      if (lastFrameTsRef.current === null) {
        lastFrameTsRef.current = now;
      }
      const dtReal = Math.min(0.05, (now - lastFrameTsRef.current) / 1000);
      lastFrameTsRef.current = now;

      const nextT = timeRef.current + dtReal * speedRef.current;
      if (nextT >= timeline.totalDuration) {
        timeRef.current = timeline.totalDuration;
        setCurrentTime(timeline.totalDuration);
        setIsPlaying(false);
        return;
      }
      timeRef.current = nextT;
      setCurrentTime(nextT);
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, timeline.totalDuration]);

  const sampled = useMemo(
    () => sampleSimulationAt(timeline, currentTime),
    [timeline, currentTime]
  );

  // Render physics scene onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.clientWidth || 760;
    const cssHeight = 290;
    if (canvas.width !== Math.round(cssWidth * dpr) || canvas.height !== Math.round(cssHeight * dpr)) {
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Clear background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    const padL = 36;
    const padR = 36;
    const drawW = cssWidth - padL - padR;
    const worldSpan = bounds.maxX - bounds.minX;
    const toPxX = (wx: number) => padL + ((wx - bounds.minX) / worldSpan) * drawW;

    const hasElevation = Boolean(config.initialRamp || config.finalRamp);
    const groundY = hasElevation ? 236 : 210;
    const pxPerMeterY = hasElevation ? 130 / Math.max(bounds.maxY, 4) : 28;
    const toPxY = (wy: number) => groundY - wy * pxPerMeterY;

    // Subtle coordinate grid
    ctx.strokeStyle = '#F1ECEC';
    ctx.lineWidth = 1;
    const startTick = Math.ceil(bounds.minX);
    const endTick = Math.floor(bounds.maxX);
    for (let gx = startTick; gx <= endTick; gx += 1) {
      const px = toPxX(gx);
      ctx.beginPath();
      ctx.moveTo(px, 28);
      ctx.lineTo(px, groundY);
      ctx.stroke();
    }

    // Track / surface
    ctx.strokeStyle = '#57534E';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    if (config.initialRamp) {
      const startX = toPxX(config.bodies[0].x0);
      const entryX = toPxX(config.initialRamp.flatEntryX);
      const topY = toPxY(config.initialRamp.height);
      ctx.moveTo(startX - 18, topY);
      ctx.quadraticCurveTo(startX + (entryX - startX) * 0.25, groundY, entryX, groundY);
    } else {
      ctx.moveTo(padL - 12, groundY);
    }

    const flatEndX = config.finalRamp ? toPxX(config.finalRamp.startX) : cssWidth - padR + 12;
    ctx.lineTo(flatEndX, groundY);

    if (config.finalRamp) {
      const tanTheta = Math.tan((config.finalRamp.angleDeg * Math.PI) / 180);
      const climbH = Math.max(bounds.maxY * 1.05, 5);
      const climbDx = climbH / tanTheta;
      ctx.lineTo(toPxX(config.finalRamp.startX + climbDx), toPxY(climbH));
    }
    ctx.stroke();

    // Hatching below flat ground
    ctx.strokeStyle = '#D6D3D1';
    ctx.lineWidth = 1;
    for (let hx = padL; hx < flatEndX; hx += 14) {
      ctx.beginPath();
      ctx.moveTo(hx, groundY);
      ctx.lineTo(hx - 6, groundY + 8);
      ctx.stroke();
    }

    // Ruler ticks (adaptive step so labels never crowd)
    ctx.fillStyle = '#78716C';
    ctx.font = '500 10px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    const tickStep = worldSpan > 26 ? 5 : worldSpan > 14 ? 2 : 1;
    const firstTick = Math.ceil(bounds.minX / tickStep) * tickStep;
    for (let gx = firstTick; gx <= endTick; gx += tickStep) {
      const px = toPxX(gx);
      ctx.fillText(`${gx} m`, px, groundY + 20);
    }

    // Optional rigid wall (Q10)
    if (config.wallX !== undefined) {
      const wallPx = toPxX(config.wallX);
      ctx.fillStyle = '#292524';
      ctx.fillRect(wallPx, groundY - 125, 10, 125);
      ctx.fillStyle = '#57534E';
      ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Dinding', wallPx + 5, groundY - 134);
    }

    // Optional spring (Q15)
    if (config.spring) {
      const wallPx = toPxX(config.spring.wallX);
      const bodyState = sampled.bodies[config.spring.attachedToIndex];
      const attachPx = toPxX(bodyState.x + bodyState.radius);
      // Draw wall
      ctx.fillStyle = '#292524';
      ctx.fillRect(wallPx, groundY - 115, 10, 115);

      // Draw zig-zag spring coil between attachPx and wallPx
      const springY = groundY - 22;
      const coils = 9;
      const span = Math.max(12, wallPx - attachPx);
      ctx.strokeStyle = '#7A1228';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(attachPx, springY);
      for (let c = 1; c < coils * 2; c++) {
        const cx = attachPx + (c / (coils * 2)) * span;
        const cy = springY + (c % 2 === 1 ? -9 : 9);
        ctx.lineTo(cx, cy);
      }
      ctx.lineTo(wallPx, springY);
      ctx.stroke();

      if (sampled.springCompression > 0.005) {
        ctx.fillStyle = '#7A1228';
        ctx.font = '600 11px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          `Δx = ${fmtComma(sampled.springCompression * 100)} cm`,
          (attachPx + wallPx) / 2,
          springY - 22
        );
      }
    }

    // Detect if a collision just occurred within +-0.09s for impulse flash
    const activeFlashEvent = timeline.events.find(
      (ev) => ev.kind === 'body-body' && Math.abs(ev.time - currentTime) < 0.09
    );

    // Draw bodies and velocity vectors
    sampled.bodies.forEach((body, idx) => {
      const cx = toPxX(body.x);
      const rPx = Math.max(17, Math.min(34, (body.radius / worldSpan) * drawW));
      const cy = toPxY(body.y) - rPx;

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.beginPath();
      ctx.ellipse(cx, toPxY(body.y) - 1, rPx * 0.85, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body circle/block
      ctx.fillStyle = body.color;
      ctx.beginPath();
      ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label inside body
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(body.label, cx, cy);

      // Mass tag cleanly separated above velocity label
      ctx.fillStyle = '#44403C';
      ctx.font = '600 11px "IBM Plex Mono", monospace';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(`${fmtComma(body.mass, body.mass % 1 === 0 ? 1 : 2)} kg`, cx, cy - rPx - 40);

      // Velocity arrow
      if (Math.abs(body.v) > 0.05) {
        const dir = body.v >= 0 ? 1 : -1;
        const arrowLen = Math.min(92, Math.max(24, Math.abs(body.v) * 6.2));
        const arrowY = cy - rPx - 14;
        const startX = cx;
        const endX = cx + dir * arrowLen;

        ctx.strokeStyle = '#047857';
        ctx.fillStyle = '#047857';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(startX, arrowY);
        ctx.lineTo(endX, arrowY);
        ctx.stroke();

        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(endX, arrowY);
        ctx.lineTo(endX - dir * 7, arrowY - 4.5);
        ctx.lineTo(endX - dir * 7, arrowY + 4.5);
        ctx.closePath();
        ctx.fill();

        ctx.font = '600 11px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`v=${fmtComma(body.v)} m/s`, (startX + endX) / 2, arrowY - 7);
      } else {
        ctx.fillStyle = '#78716C';
        ctx.font = '500 10px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('v=0', cx, cy - rPx - 14);
      }

      // Collision flash & impulse pair
      if (activeFlashEvent && activeFlashEvent.involvedLabels.includes(body.label)) {
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, rPx + 6, 0, Math.PI * 2);
        ctx.stroke();
      }
      void idx;
    });

    // Impulse flash banner at top-right if colliding
    if (activeFlashEvent) {
      ctx.fillStyle = '#FDF2F4';
      ctx.strokeStyle = '#7A1228';
      ctx.lineWidth = 1;
      const boxW = 240;
      ctx.fillRect(cssWidth - boxW - 16, 12, boxW, 28);
      ctx.strokeRect(cssWidth - boxW - 16, 12, boxW, 28);
      ctx.fillStyle = '#7A1228';
      ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('KONTAK IMPULSIF: F₁₂ = −F₂₁', cssWidth - boxW / 2 - 16, 30);
    }

    // Top-left coordinate legend
    ctx.fillStyle = '#57534E';
    ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Arah sumbu +x →', 16, 22);
  }, [bounds, config, currentTime, sampled, timeline.events]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (timeRef.current >= timeline.totalDuration - 0.01) {
        timeRef.current = 0;
        setCurrentTime(0);
      }
      setIsPlaying(true);
    }
  };

  const handleReplay = () => {
    timeRef.current = 0;
    setCurrentTime(0);
    setIsPlaying(true);
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div>
          <h5 className="text-sm font-bold text-stone-900">{title}</h5>
          {formulaOverlay && (
            <p className="mt-0.5 font-mono text-xs text-[#7A1228] tabular-nums">
              {formulaOverlay}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePlayPause}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#7A1228] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#5E0D1E] whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                JEDA ANIMASI
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                PUTAR ANIMASI PEMBUKTIAN
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReplay}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:border-[#7A1228] hover:text-[#7A1228] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            ULANGI ANIMASI
          </button>

          <div className="flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 p-0.5">
            {SPEED_LEVELS.map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setSpeed(spd)}
                className={`rounded-md px-2 py-1 text-[11px] font-semibold tabular-nums transition-colors cursor-pointer ${
                  speed === spd
                    ? 'bg-[#7A1228] text-white'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {spd.toString().replace('.', ',')}x
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-stone-200 bg-white">
        <canvas
          ref={canvasRef}
          data-testid="physics-proof-canvas"
          className="block h-[290px] w-full"
          aria-label="Simulasi animasi pembuktian hukum fisika tumbukan"
        />
      </div>

      {/* Interactive Timeline Scrubber */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label htmlFor="sim-time-slider" className="font-mono text-xs font-semibold text-stone-600 tabular-nums whitespace-nowrap">
          t = {fmtComma(currentTime, 2)} s / {fmtComma(timeline.totalDuration, 2)} s
        </label>
        <input
          id="sim-time-slider"
          type="range"
          min={0}
          max={timeline.totalDuration}
          step={0.01}
          value={currentTime}
          onChange={(e) => {
            setIsPlaying(false);
            const val = Number(e.target.value);
            timeRef.current = val;
            setCurrentTime(val);
          }}
          className="h-1.5 flex-1 cursor-pointer accent-[#7A1228]"
        />
      </div>

      {/* Live Physical Event Caption */}
      <div className="mt-3 rounded-xl border border-stone-200 bg-[#FDF5F6] px-4 py-2.5 text-xs sm:text-sm text-stone-800">
        <span className="font-bold text-[#7A1228]">Status Fisis: </span>
        <span>{sampled.recentEvent ? sampled.recentEvent.summary : sampled.caption}</span>
      </div>

      {/* Real-time Conservation Telemetry */}
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">
          <div className="text-[11px] font-medium text-stone-500">Total Momentum Sistem (Σp)</div>
          <div className="mt-0.5 font-mono text-sm font-bold text-stone-900 tabular-nums">
            {fmtComma(sampled.totalMomentum, 2)} Ns
          </div>
        </div>
        <div className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">
          <div className="text-[11px] font-medium text-stone-500">Total Energi Kinetik (ΣK)</div>
          <div className="mt-0.5 font-mono text-sm font-bold text-stone-900 tabular-nums">
            {fmtComma(sampled.totalKineticEnergy, 2)} J
          </div>
        </div>
        <div className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">
          <div className="text-[11px] font-medium text-stone-500">Jumlah Tumbukan Terjadi</div>
          <div className="mt-0.5 font-mono text-sm font-bold text-stone-900 tabular-nums">
            {timeline.events.filter((e) => e.time <= currentTime + 1e-6).length} / {timeline.events.length} peristiwa
          </div>
        </div>
      </div>

      {/* Live Per-Body Table */}
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-stone-200 text-stone-500">
              <th className="py-1.5 pr-3 font-semibold">Benda</th>
              <th className="py-1.5 pr-3 font-semibold">Massa</th>
              <th className="py-1.5 pr-3 font-semibold">Kecepatan v(t)</th>
              <th className="py-1.5 pr-3 font-semibold">Momentum p(t)</th>
              <th className="py-1.5 font-semibold">Energi Kinetik K(t)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-mono tabular-nums">
            {sampled.bodies.map((b) => (
              <tr key={b.id}>
                <td className="py-1.5 pr-3 font-sans font-bold text-stone-900">{b.label}</td>
                <td className="py-1.5 pr-3 text-stone-700">{fmtComma(b.mass, 2)} kg</td>
                <td className="py-1.5 pr-3 font-semibold text-[#047857]">
                  {b.v >= 0 ? '+' : ''}{fmtComma(b.v, 2)} m/s
                </td>
                <td className="py-1.5 pr-3 text-stone-700">{fmtComma(b.p, 2)} Ns</td>
                <td className="py-1.5 text-stone-700">{fmtComma(b.ke, 2)} J</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
