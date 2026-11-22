import { useMemo, useState } from 'react';
import {
  analyzeThreeMassChain,
  collide1D,
  optimalMiddleMass,
  type SimulationConfig,
} from '../physics/collisionEngine';
import { PhysicsProofAnimator } from './PhysicsProofAnimator';

type GalleryLabId = 'osk14-opt' | 'cm-frame' | 'multi-chain' | 'recollision';

export function VisualizationGalleryView() {
  const [activeLab, setActiveLab] = useState<GalleryLabId>('osk14-opt');

  // Lab 1 state: OSK 14 optimizer
  const [m1, setM1] = useState<number>(9.0);
  const [m2, setM2] = useState<number>(1.5);
  const [m3, setM3] = useState<number>(0.25);
  const [v1, setV1] = useState<number>(4.0);

  // Lab 2 state: CM Frame
  const [cmM1, setCmM1] = useState<number>(6.0);
  const [cmV1, setCmV1] = useState<number>(6.0);
  const [cmM2, setCmM2] = useState<number>(2.0);
  const [cmV2, setCmV2] = useState<number>(-2.0);

  // Lab 3 state: N-chain
  const [chainN, setChainN] = useState<number>(4);
  const [chainMode, setChainMode] = useState<'optimal' | 'direct'>('optimal');

  // Lab 4 state: Boundary & recollision
  const [boundM2, setBoundM2] = useState<number>(1.0);

  const m2Star = optimalMiddleMass(m1, m3);
  const lab1Stats = useMemo(() => analyzeThreeMassChain(m1, m2, m3, v1, 1), [m1, m2, m3, v1]);

  const lab1Config: SimulationConfig = useMemo(
    () => ({
      bodies: [
        { id: 'l1', label: 'm₁', mass: m1, x0: 1.0, v0: v1, radius: 0.48, color: '#7A1228' },
        { id: 'l2', label: 'm₂', mass: m2, x0: 4.8, v0: 0, radius: 0.36, color: '#B45309' },
        { id: 'l3', label: 'm₃', mass: m3, x0: 8.2, v0: 0, radius: 0.26, color: '#1E3A5F' },
      ],
      duration: 3.0,
    }),
    [m1, m2, m3, v1]
  );

  // Live SVG curve points for Lab 1
  const lab1Curve = useMemo(() => {
    const minPlot = Math.max(0.1, m3 * 0.4);
    const maxPlot = Math.max(m1 * 0.9, m2Star * 3.0);
    const points: { x: number; y: number; m2Val: number; ratio: number }[] = [];
    let maxRatio = 0;
    for (let i = 0; i <= 60; i++) {
      const val = minPlot + (i / 60) * (maxPlot - minPlot);
      const ratio = (4 * m1 * val) / ((m1 + val) * (val + m3));
      maxRatio = Math.max(maxRatio, ratio);
      points.push({ x: 0, y: 0, m2Val: val, ratio });
    }
    const yCeil = Math.max(maxRatio * 1.12, 2.0);
    const toPxX = (v: number) => 55 + ((v - minPlot) / (maxPlot - minPlot)) * 500;
    const toPxY = (r: number) => 170 - (r / yCeil) * 135;

    const poly = points.map((p) => `${toPxX(p.m2Val).toFixed(1)},${toPxY(p.ratio).toFixed(1)}`).join(' ');
    const curRatio = (4 * m1 * m2) / ((m1 + m2) * (m2 + m3));
    const optRatio = (4 * m1 * m2Star) / ((m1 + m2Star) * (m2Star + m3));
    return {
      poly,
      curX: toPxX(Math.min(maxPlot, Math.max(minPlot, m2))),
      curY: toPxY(curRatio),
      optX: toPxX(m2Star),
      optY: toPxY(optRatio),
      curRatio,
      optRatio,
    };
  }, [m1, m2, m3, m2Star]);

  // Lab 2 CM Frame calculations
  const vCm = (cmM1 * cmV1 + cmM2 * cmV2) / (cmM1 + cmM2);
  const [cmV1Prime, cmV2Prime] = collide1D(cmM1, cmV1, cmM2, cmV2, 1);
  const lab2Config: SimulationConfig = useMemo(
    () => ({
      bodies: [
        { id: 'c1', label: 'm₁', mass: cmM1, x0: 2.0, v0: cmV1, radius: 0.44, color: '#7A1228' },
        { id: 'c2', label: 'm₂', mass: cmM2, x0: 7.5, v0: cmV2, radius: 0.34, color: '#1E3A5F' },
      ],
      duration: 2.8,
    }),
    [cmM1, cmV1, cmM2, cmV2]
  );

  // Lab 3 Multi-mass N-chain
  const lab3Config: SimulationConfig = useMemo(() => {
    const mStart = 16.0;
    const mEnd = 1.0;
    if (chainMode === 'direct') {
      return {
        bodies: [
          { id: 'd1', label: 'm₁', mass: mStart, x0: 1.5, v0: 4.0, radius: 0.5, color: '#7A1228' },
          { id: 'd2', label: `m_${chainN}`, mass: mEnd, x0: 7.5, v0: 0, radius: 0.28, color: '#1E3A5F' },
        ],
        duration: 2.8,
      };
    }
    const r = Math.pow(mEnd / mStart, 1 / (chainN - 1));
    const palette = ['#7A1228', '#961A34', '#B45309', '#0F766E', '#1E3A5F'];
    const bodies = Array.from({ length: chainN }).map((_, idx) => {
      const m = Number((mStart * Math.pow(r, idx)).toFixed(2));
      return {
        id: `n-${idx}`,
        label: `m${idx + 1}`,
        mass: m,
        x0: 1.0 + idx * (7.5 / (chainN - 1)),
        v0: idx === 0 ? 4.0 : 0.0,
        radius: Math.max(0.24, 0.50 - idx * 0.06),
        color: palette[idx % palette.length],
      };
    });
    return { bodies, duration: 3.0 };
  }, [chainN, chainMode]);

  // Lab 4 Recollision sandbox (m1 = 6, m3 = 3)
  const lab4Config: SimulationConfig = useMemo(
    () => ({
      bodies: [
        { id: 'r1', label: 'm₁', mass: 6.0, x0: 1.0, v0: 4.9, radius: 0.48, color: '#7A1228' },
        { id: 'r2', label: 'm₂', mass: boundM2, x0: 4.8, v0: 0, radius: 0.34, color: '#B45309' },
        { id: 'r3', label: 'm₃', mass: 3.0, x0: 7.6, v0: 0, radius: 0.40, color: '#1E3A5F' },
      ],
      duration: 4.0,
    }),
    [boundM2]
  );

  const tabs: { id: GalleryLabId; title: string; subtitle: string }[] = [
    { id: 'osk14-opt', title: '1. Kurva Optimasi OSK No. 14', subtitle: 'm₂ = √(m₁m₃) & penguatan v₃' },
    { id: 'cm-frame', title: '2. Kerangka Pusat Massa', subtitle: 'Transformasi v′ = 2v_CM − v' },
    { id: 'multi-chain', title: '3. Rantai N-Massa Geometrik', subtitle: 'Perbandingan langsung vs bertahap' },
    { id: 'recollision', title: '4. Uji Tumbukan Susulan', subtitle: 'Saat m₂ < m₃ atau m₂ terlalu kecil' },
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-stone-200 pb-5">
        <p className="text-xs font-bold tracking-wider text-[#7A1228] uppercase">
          Galeri Visualisasi Fisika Interaktif
        </p>
        <h2 className="mt-1 text-2xl font-extrabold text-stone-900 sm:text-3xl">
          Eksperimen Virtual Hukum Tumbukan Elastis Beruntun
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-stone-600">
          Ubah parameter massa dan kecepatan secara langsung untuk mengamati perubahan kurva
          optimasi, kerja kerangka pusat massa, efek amplifikasi rantai multi-benda, serta
          munculnya tumbukan susulan.
        </p>
      </div>

      {/* Lab Selector */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {tabs.map((tab) => {
          const active = tab.id === activeLab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveLab(tab.id)}
              className={`text-left rounded-xl border p-3.5 transition-colors cursor-pointer ${
                active
                  ? 'border-[#7A1228] bg-[#FDF5F6]'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className={`text-xs font-bold ${active ? 'text-[#7A1228]' : 'text-stone-900'}`}>
                {tab.title}
              </div>
              <div className="mt-1 text-[11px] text-stone-500">{tab.subtitle}</div>
            </button>
          );
        })}
      </div>

      {activeLab === 'osk14-opt' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 lg:col-span-5">
            <h3 className="text-base font-bold text-stone-900">Kontrol Parameter 3-Massa</h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-stone-700">
                  <label htmlFor="g-m1">Massa m₁ (penumbuk)</label>
                  <span className="font-mono text-[#7A1228] tabular-nums">{m1.toFixed(1).replace('.', ',')} kg</span>
                </div>
                <input id="g-m1" type="range" min={2} max={20} step={0.5} value={m1} onChange={(e) => setM1(Number(e.target.value))} className="mt-1 w-full accent-[#7A1228] cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-stone-700">
                  <label htmlFor="g-m2">Massa m₂ (perantara)</label>
                  <span className="font-mono text-[#7A1228] tabular-nums">{m2.toFixed(2).replace('.', ',')} kg</span>
                </div>
                <input id="g-m2" type="range" min={0.2} max={10} step={0.05} value={m2} onChange={(e) => setM2(Number(e.target.value))} className="mt-1 w-full accent-[#7A1228] cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-stone-700">
                  <label htmlFor="g-m3">Massa m₃ (target)</label>
                  <span className="font-mono text-[#7A1228] tabular-nums">{m3.toFixed(2).replace('.', ',')} kg</span>
                </div>
                <input id="g-m3" type="range" min={0.25} max={4} step={0.25} value={m3} onChange={(e) => setM3(Number(e.target.value))} className="mt-1 w-full accent-[#7A1228] cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-stone-700">
                  <label htmlFor="g-v1">Kecepatan awal v₁</label>
                  <span className="font-mono text-[#7A1228] tabular-nums">{v1.toFixed(1).replace('.', ',')} m/s</span>
                </div>
                <input id="g-v1" type="range" min={2} max={10} step={0.5} value={v1} onChange={(e) => setV1(Number(e.target.value))} className="mt-1 w-full accent-[#7A1228] cursor-pointer" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setM2(Number(m2Star.toFixed(2)))}
              className="w-full rounded-xl bg-[#7A1228] px-4 py-2 text-xs font-bold text-white hover:bg-[#5E0D1E] cursor-pointer"
            >
              Terapkan Nilai Optimum m₂* = √(m₁m₃) = {m2Star.toFixed(2).replace('.', ',')} kg
            </button>

            {/* Live optimization SVG plot */}
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
              <div className="text-[11px] font-bold text-stone-700 mb-1">
                Kurva Penguatan v₃′/v₁ vs m₂ (Rasio Saat Ini: {lab1Curve.curRatio.toFixed(2).replace('.', ',')}×)
              </div>
              <svg viewBox="0 0 580 195" className="w-full h-auto">
                <line x1="55" y1="25" x2="55" y2="170" stroke="#57534E" strokeWidth="1.8" />
                <line x1="55" y1="170" x2="560" y2="170" stroke="#57534E" strokeWidth="1.8" />
                <polyline fill="none" stroke="#7A1228" strokeWidth="2.5" points={lab1Curve.poly} />
                <line x1={lab1Curve.optX} y1={lab1Curve.optY} x2={lab1Curve.optX} y2="170" stroke="#047857" strokeDasharray="4 3" />
                <circle cx={lab1Curve.optX} cy={lab1Curve.optY} r="4.5" fill="#047857" />
                <circle cx={lab1Curve.curX} cy={lab1Curve.curY} r="6" fill="#B45309" stroke="#FFF" strokeWidth="2" />
                <text x={lab1Curve.optX} y="185" textAnchor="middle" fontSize="10" fontWeight="700" fill="#047857">
                  m₂*={m2Star.toFixed(2).replace('.', ',')}
                </text>
              </svg>
              {lab1Stats.hasSecondaryM1M2 && (
                <p className="mt-1 text-[11px] font-semibold text-[#7A1228]">
                  Catatan fisis: m₂ terlalu kecil sehingga m₁ akan mengejar m₂ lagi setelah tumbukan 2!
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <PhysicsProofAnimator
              config={lab1Config}
              title="Simulasi Real-Time 3-Massa Elastis"
              formulaOverlay={`v₃′(2-tahap) = ${lab1Stats.v3AfterSecond.toFixed(2).replace('.', ',')} m/s  |  m₂* = ${m2Star.toFixed(2).replace('.', ',')} kg`}
            />
          </div>
        </div>
      )}

      {activeLab === 'cm-frame' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 lg:col-span-5">
            <h3 className="text-base font-bold text-stone-900">Kalkulator Kerangka Pusat Massa</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label htmlFor="cm-m1" className="font-semibold text-stone-700">m₁ (kg)</label>
                <input id="cm-m1" type="number" min={1} max={20} step={0.5} value={cmM1} onChange={(e) => setCmM1(Math.max(0.5, Number(e.target.value)))} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-1.5 font-mono" />
              </div>
              <div>
                <label htmlFor="cm-v1" className="font-semibold text-stone-700">v₁ awal (m/s)</label>
                <input id="cm-v1" type="number" min={-10} max={15} step={0.5} value={cmV1} onChange={(e) => setCmV1(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-1.5 font-mono" />
              </div>
              <div>
                <label htmlFor="cm-m2" className="font-semibold text-stone-700">m₂ (kg)</label>
                <input id="cm-m2" type="number" min={1} max={20} step={0.5} value={cmM2} onChange={(e) => setCmM2(Math.max(0.5, Number(e.target.value)))} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-1.5 font-mono" />
              </div>
              <div>
                <label htmlFor="cm-v2" className="font-semibold text-stone-700">v₂ awal (m/s)</label>
                <input id="cm-v2" type="number" min={-15} max={10} step={0.5} value={cmV2} onChange={(e) => setCmV2(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-1.5 font-mono" />
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-[#E8B4BF] bg-[#FDF5F6] p-4 font-mono text-xs text-stone-800 tabular-nums">
              <div className="font-sans font-bold text-[#7A1228]">Hasil Transformasi Pusat Massa:</div>
              <div>v_CM = ({cmM1}·({cmV1}) + {cmM2}·({cmV2})) / ({cmM1 + cmM2}) = <strong>{vCm.toFixed(2).replace('.', ',')} m/s</strong></div>
              <div>Dalam CM sebelum: u₁ = {(cmV1 - vCm).toFixed(2).replace('.', ',')}, u₂ = {(cmV2 - vCm).toFixed(2).replace('.', ',')}</div>
              <div>Dalam CM sesudah: u₁′ = {(-(cmV1 - vCm)).toFixed(2).replace('.', ',')}, u₂′ = {(-(cmV2 - vCm)).toFixed(2).replace('.', ',')}</div>
              <div className="pt-1 text-[#047857] font-bold">
                Kembali ke Lab: v₁′ = {cmV1Prime.toFixed(2).replace('.', ',')} m/s · v₂′ = {cmV2Prime.toFixed(2).replace('.', ',')} m/s
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <PhysicsProofAnimator
              config={lab2Config}
              title="Simulasi Tumbukan Dua Benda Bergerak"
              formulaOverlay={`v_CM = ${vCm.toFixed(2).replace('.', ',')} m/s  |  vᵢ′ = 2·v_CM − vᵢ`}
            />
          </div>
        </div>
      )}

      {activeLab === 'multi-chain' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 lg:col-span-5">
            <h3 className="text-base font-bold text-stone-900">
              Amplifikasi Rantai N-Benda (m₁ = 16 kg → m_N = 1 kg)
            </h3>
            <p className="text-xs text-stone-600">
              Bandingkan tumbukan langsung (tanpa perantara) dengan penyisipan bola perantara
              berbarisan geometri optimal.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-semibold text-stone-700">
                <label htmlFor="n-chain">Jumlah Total Benda (N)</label>
                <span className="font-mono text-[#7A1228]">{chainN} benda</span>
              </div>
              <input id="n-chain" type="range" min={2} max={5} step={1} value={chainN} onChange={(e) => setChainN(Number(e.target.value))} className="w-full accent-[#7A1228] cursor-pointer" />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setChainMode('optimal')}
                className={`flex-1 rounded-xl border px-3 py-2 text-xs font-bold cursor-pointer ${
                  chainMode === 'optimal'
                    ? 'border-[#7A1228] bg-[#7A1228] text-white'
                    : 'border-stone-300 bg-white text-stone-700'
                }`}
              >
                Rantai Geometrik ({chainN} Bola)
              </button>
              <button
                type="button"
                onClick={() => setChainMode('direct')}
                className={`flex-1 rounded-xl border px-3 py-2 text-xs font-bold cursor-pointer ${
                  chainMode === 'direct'
                    ? 'border-[#7A1228] bg-[#7A1228] text-white'
                    : 'border-stone-300 bg-white text-stone-700'
                }`}
              >
                Tumbukan Langsung (2 Bola)
              </button>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5 text-xs text-stone-700">
              Pada rantai geometrik N={chainN} dari 16 kg ke 1 kg, rasio massa berurutan r = (1/16)^(1/{chainN - 1}) ={' '}
              <strong className="font-mono text-[#7A1228]">
                {Math.pow(1 / 16, 1 / (chainN - 1)).toFixed(2).replace('.', ',')}
              </strong>
              , menghasilkan kelajuan akhir{' '}
              <strong className="font-mono text-[#047857]">
                {(Math.pow(2 / (1 + Math.pow(1 / 16, 1 / (chainN - 1))), chainN - 1) * 4)
                  .toFixed(2)
                  .replace('.', ',')}{' '}
                m/s
              </strong>{' '}
              (dibanding langsung hanya 7,53 m/s!).
            </div>
          </div>

          <div className="lg:col-span-7">
            <PhysicsProofAnimator
              config={lab3Config}
              title={`Simulasi Rantai ${chainMode === 'optimal' ? `${chainN} Bola Optimal` : 'Langsung 16 kg → 1 kg'}`}
              formulaOverlay="v_N = [2 / (1 + r)]^(N−1) · v₁"
            />
          </div>
        </div>
      )}

      {activeLab === 'recollision' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 lg:col-span-5">
            <h3 className="text-base font-bold text-stone-900">
              Uji Tumbukan Susulan (m₁ = 6,0 kg · m₃ = 3,0 kg)
            </h3>
            <p className="text-xs text-stone-600">
              Geser massa tengah m₂ di bawah 3,0 kg untuk menyaksikan m₂ memantul ke kiri setelah
              menumbuk m₃, memicu tumbukan ke-3 dan ke-4!
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-semibold text-stone-700">
                <label htmlFor="bound-m2">Massa Perantara m₂</label>
                <span className="font-mono text-[#7A1228]">{boundM2.toFixed(1).replace('.', ',')} kg</span>
              </div>
              <input id="bound-m2" type="range" min={0.5} max={5.0} step={0.5} value={boundM2} onChange={(e) => setBoundM2(Number(e.target.value))} className="w-full accent-[#7A1228] cursor-pointer" />
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setBoundM2(1.0)} className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#7A1228] hover:border-[#7A1228] cursor-pointer">
                m₂ = 1,0 kg (4 Tumbukan)
              </button>
              <button type="button" onClick={() => setBoundM2(4.0)} className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#047857] hover:border-[#047857] cursor-pointer">
                m₂ = 4,0 kg (Aman, 2 Tumbukan)
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <PhysicsProofAnimator
              config={lab4Config}
              title="Simulasi Pelacakan Tumbukan Susulan"
              formulaOverlay="Syarat 2 tumbukan saja: v₂″ ≥ v₁′"
            />
          </div>
        </div>
      )}
    </div>
  );
}
