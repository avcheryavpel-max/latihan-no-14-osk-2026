import type { FBDVectorSpec, StimulusSpec } from '../data/questionsBank';
import type { TheoryChapter } from '../data/theoryCurriculum';

export function TheoryDiagram({ type }: { type: TheoryChapter['diagramType'] }) {
  if (type === 'two-body') {
    return (
      <svg viewBox="0 0 640 210" className="w-full h-auto rounded-xl border border-stone-200 bg-white" role="img" aria-label="Diagram tumbukan elastis dua benda">
        <line x1="30" y1="165" x2="610" y2="165" stroke="#57534E" strokeWidth="2.5" />
        <text x="45" y="34" fontSize="12" fontWeight="700" fill="#7A1228">Tahap Kontak Impulsif (Δt → 0)</text>
        <text x="45" y="52" fontSize="11" fill="#57534E">Gaya dalam F₁₂ = −F₂₁ saling meniadakan untuk sistem total</text>

        {/* Left ball */}
        <circle cx="220" cy="133" r="32" fill="#7A1228" />
        <text x="220" y="137" textAnchor="middle" fill="#FFF" fontSize="13" fontWeight="700">m₁</text>
        {/* Right ball */}
        <circle cx="305" cy="139" r="26" fill="#1E3A5F" />
        <text x="305" y="143" textAnchor="middle" fill="#FFF" fontSize="13" fontWeight="700">m₂</text>

        {/* Action-reaction arrows */}
        <line x1="252" y1="133" x2="170" y2="133" stroke="#DC2626" strokeWidth="2.5" />
        <polygon points="170,133 178,128 178,138" fill="#DC2626" />
        <text x="155" y="120" textAnchor="middle" fill="#DC2626" fontSize="11" fontWeight="700">F₂₁</text>

        <line x1="279" y1="139" x2="365" y2="139" stroke="#DC2626" strokeWidth="2.5" />
        <polygon points="365,139 357,134 357,144" fill="#DC2626" />
        <text x="380" y="126" textAnchor="middle" fill="#DC2626" fontSize="11" fontWeight="700">F₁₂</text>

        {/* Velocity comparison right box */}
        <rect x="425" y="35" width="185" height="105" rx="10" fill="#FDF5F6" stroke="#E8B4BF" />
        <text x="440" y="58" fontSize="11" fontWeight="700" fill="#7A1228">Hasil Tumbukan (v₂ = 0):</text>
        <text x="440" y="80" fontSize="11" fontFamily="IBM Plex Mono, monospace" fill="#1C1917">v₁′ = (m₁−m₂)/(m₁+m₂)·v₁</text>
        <text x="440" y="102" fontSize="11" fontFamily="IBM Plex Mono, monospace" fill="#1C1917">v₂′ = 2m₁/(m₁+m₂)·v₁</text>
        <text x="440" y="124" fontSize="11" fontWeight="600" fill="#047857">v₂′ − v₁′ = v₁ (e = 1)</text>
      </svg>
    );
  }

  if (type === 'cm-frame') {
    return (
      <svg viewBox="0 0 640 215" className="w-full h-auto rounded-xl border border-stone-200 bg-white" role="img" aria-label="Diagram Kerangka Pusat Massa">
        <text x="28" y="30" fontSize="12" fontWeight="700" fill="#7A1228">Sudut Pandang Kerangka Pusat Massa (v_CM = konstan)</text>
        {/* Before in CM */}
        <rect x="28" y="46" width="275" height="145" rx="10" fill="#FAF8F8" stroke="#E7E0E0" />
        <text x="44" y="68" fontSize="11" fontWeight="700" fill="#1C1917">Sebelum Tumbukan (dalam CM)</text>
        <circle cx="95" cy="122" r="22" fill="#7A1228" />
        <text x="95" y="126" textAnchor="middle" fill="#FFF" fontSize="11" fontWeight="700">m₁</text>
        <line x1="120" y1="122" x2="155" y2="122" stroke="#047857" strokeWidth="2.5" />
        <polygon points="155,122 147,117 147,127" fill="#047857" />
        <text x="137" y="112" textAnchor="middle" fontSize="10" fontWeight="700" fill="#047857">+u₁</text>

        <line x1="166" y1="90" x2="166" y2="165" stroke="#78716C" strokeDasharray="4 3" />
        <text x="166" y="180" textAnchor="middle" fontSize="10" fill="#57534E">CM (Σp_CM = 0)</text>

        <circle cx="238" cy="122" r="18" fill="#1E3A5F" />
        <text x="238" y="126" textAnchor="middle" fill="#FFF" fontSize="11" fontWeight="700">m₂</text>
        <line x1="217" y1="122" x2="180" y2="122" stroke="#047857" strokeWidth="2.5" />
        <polygon points="180,122 188,117 188,127" fill="#047857" />
        <text x="198" y="112" textAnchor="middle" fontSize="10" fontWeight="700" fill="#047857">−u₂</text>

        {/* After in CM */}
        <rect x="335" y="46" width="277" height="145" rx="10" fill="#FDF5F6" stroke="#E8B4BF" />
        <text x="351" y="68" fontSize="11" fontWeight="700" fill="#7A1228">Sesudah Tumbukan (Arah Berbalik)</text>
        <circle cx="405" cy="122" r="22" fill="#7A1228" />
        <text x="405" y="126" textAnchor="middle" fill="#FFF" fontSize="11" fontWeight="700">m₁</text>
        <line x1="380" y1="122" x2="345" y2="122" stroke="#DC2626" strokeWidth="2.5" />
        <polygon points="345,122 353,117 353,127" fill="#DC2626" />
        <text x="364" y="112" textAnchor="middle" fontSize="10" fontWeight="700" fill="#DC2626">u₁′ = −u₁</text>

        <circle cx="540" cy="122" r="18" fill="#1E3A5F" />
        <text x="540" y="126" textAnchor="middle" fill="#FFF" fontSize="11" fontWeight="700">m₂</text>
        <line x1="561" y1="122" x2="598" y2="122" stroke="#DC2626" strokeWidth="2.5" />
        <polygon points="598,122 590,117 590,127" fill="#DC2626" />
        <text x="580" y="112" textAnchor="middle" fontSize="10" fontWeight="700" fill="#DC2626">u₂′ = −u₂</text>

        <text x="473" y="176" textAnchor="middle" fontSize="11" fontFamily="IBM Plex Mono, monospace" fontWeight="600" fill="#7A1228">
          Kembali ke Lab: vᵢ′ = 2·v_CM − vᵢ
        </text>
      </svg>
    );
  }

  if (type === 'three-body-chain') {
    return (
      <svg viewBox="0 0 640 220" className="w-full h-auto rounded-xl border border-stone-200 bg-white" role="img" aria-label="Skema tumbukan beruntun tiga massa OSK 2026 Nomor 14">
        <text x="24" y="28" fontSize="12" fontWeight="700" fill="#7A1228">Arsitektur Soal OSK 2026 No. 14: Tumbukan Beruntun 3 Massa</text>
        {/* Top row: initial */}
        <text x="24" y="58" fontSize="11" fontWeight="600" fill="#57534E">Keadaan Awal:</text>
        <circle cx="150" cy="70" r="24" fill="#7A1228" />
        <text x="150" y="74" textAnchor="middle" fill="#FFF" fontSize="12" fontWeight="700">m₁</text>
        <line x1="178" y1="70" x2="235" y2="70" stroke="#047857" strokeWidth="2.5" />
        <polygon points="235,70 226,65 226,75" fill="#047857" />
        <text x="206" y="60" textAnchor="middle" fontSize="11" fontWeight="700" fill="#047857">v₁</text>

        <circle cx="320" cy="70" r="18" fill="#B45309" />
        <text x="320" y="74" textAnchor="middle" fill="#FFF" fontSize="12" fontWeight="700">m₂</text>
        <text x="320" y="102" textAnchor="middle" fontSize="10" fill="#57534E">diam (v₂=0)</text>

        <circle cx="480" cy="70" r="13" fill="#1E3A5F" />
        <text x="480" y="74" textAnchor="middle" fill="#FFF" fontSize="10" fontWeight="700">m₃</text>
        <text x="480" y="102" textAnchor="middle" fontSize="10" fill="#57534E">diam (v₃=0)</text>

        <line x1="24" y1="118" x2="616" y2="118" stroke="#E7E0E0" strokeDasharray="4 4" />

        {/* Bottom row: final */}
        <text x="24" y="144" fontSize="11" fontWeight="600" fill="#57534E">Keadaan Akhir:</text>
        <circle cx="150" cy="166" r="24" fill="#7A1228" />
        <text x="150" y="170" textAnchor="middle" fill="#FFF" fontSize="12" fontWeight="700">m₁</text>
        <line x1="178" y1="166" x2="215" y2="166" stroke="#047857" strokeWidth="2" />
        <polygon points="215,166 207,162 207,170" fill="#047857" />
        <text x="196" y="156" textAnchor="middle" fontSize="10" fill="#047857">v₁′ &lt; v₁</text>

        <circle cx="320" cy="166" r="18" fill="#B45309" />
        <text x="320" y="170" textAnchor="middle" fill="#FFF" fontSize="12" fontWeight="700">m₂</text>
        <line x1="342" y1="166" x2="395" y2="166" stroke="#047857" strokeWidth="2.5" />
        <polygon points="395,166 387,161 387,171" fill="#047857" />
        <text x="368" y="156" textAnchor="middle" fontSize="10" fill="#047857">v₂″ &gt; v₁′</text>

        <circle cx="480" cy="166" r="13" fill="#1E3A5F" />
        <text x="480" y="170" textAnchor="middle" fill="#FFF" fontSize="10" fontWeight="700">m₃</text>
        <line x1="497" y1="166" x2="596" y2="166" stroke="#7A1228" strokeWidth="3" />
        <polygon points="596,166 586,160 586,172" fill="#7A1228" />
        <text x="548" y="154" textAnchor="middle" fontSize="11" fontWeight="700" fill="#7A1228">v₃′ MAKSIMUM!</text>
      </svg>
    );
  }

  if (type === 'optimization-curve') {
    // Exact plot of v3'/v1 = 4*9*m2 / ((9+m2)*(m2+0.25)) for m2 in [0.1, 6.0]
    const pts: string[] = [];
    const xMin = 0.1;
    const xMax = 6.0;
    const yMax = 3.2;
    const plotX = (m2: number) => 65 + ((m2 - xMin) / (xMax - xMin)) * 520;
    const plotY = (ratio: number) => 185 - (ratio / yMax) * 145;
    for (let i = 0; i <= 80; i++) {
      const m2 = xMin + (i / 80) * (xMax - xMin);
      const ratio = (4 * 9 * m2) / ((9 + m2) * (m2 + 0.25));
      pts.push(`${plotX(m2).toFixed(1)},${plotY(ratio).toFixed(1)}`);
    }
    const optX = plotX(1.5);
    const optY = plotY(144 / 49);

    return (
      <svg viewBox="0 0 640 225" className="w-full h-auto rounded-xl border border-stone-200 bg-white" role="img" aria-label="Grafik optimasi kelajuan akhir v3 terhadap massa m2">
        <text x="65" y="24" fontSize="12" fontWeight="700" fill="#7A1228">
          Kurva Penguatan Kecepatan v₃′/v₁ terhadap m₂ (m₁ = 9 kg, m₃ = 0,25 kg)
        </text>
        {/* Axes */}
        <line x1="65" y1="35" x2="65" y2="185" stroke="#57534E" strokeWidth="2" />
        <line x1="65" y1="185" x2="600" y2="185" stroke="#57534E" strokeWidth="2" />
        <text x="20" y="112" fontSize="11" fontWeight="600" fill="#57534E" transform="rotate(-90 20 112)" textAnchor="middle">v₃′ / v₁</text>
        <text x="330" y="213" fontSize="11" fontWeight="600" fill="#57534E" textAnchor="middle">Massa perantara m₂ (kg)</text>

        {/* Direct collision reference line 1.946 */}
        <line x1="65" y1={plotY(1.946)} x2="585" y2={plotY(1.946)} stroke="#94A3B8" strokeDasharray="5 4" />
        <text x="582" y={plotY(1.946) - 5} textAnchor="end" fontSize="10" fill="#64748B">
          Tanpa m₂ (langsung): 1,95×
        </text>

        {/* Curve */}
        <polyline fill="none" stroke="#7A1228" strokeWidth="3" points={pts.join(' ')} />

        {/* Peak marker */}
        <line x1={optX} y1={optY} x2={optX} y2="185" stroke="#047857" strokeDasharray="4 3" strokeWidth="1.5" />
        <circle cx={optX} cy={optY} r="5.5" fill="#047857" stroke="#FFF" strokeWidth="2" />
        <text x={optX + 12} y={optY + 4} fontSize="11" fontWeight="700" fill="#047857">
          Puncak: m₂* = √(9 × 0,25) = 1,5 kg (v₃′ = 2,94 v₁)
        </text>
        <text x={optX} y="199" textAnchor="middle" fontSize="10" fontWeight="700" fill="#047857">1,5</text>
        <text x={plotX(3.0)} y="199" textAnchor="middle" fontSize="10" fill="#57534E">3,0</text>
        <text x={plotX(4.5)} y="199" textAnchor="middle" fontSize="10" fill="#57534E">4,5</text>
        <text x={plotX(6.0)} y="199" textAnchor="middle" fontSize="10" fill="#57534E">6,0</text>
      </svg>
    );
  }

  // recollision-boundary
  return (
    <svg viewBox="0 0 640 210" className="w-full h-auto rounded-xl border border-stone-200 bg-white" role="img" aria-label="Diagram perbandingan batas tumbukan susulan">
      <text x="24" y="28" fontSize="12" fontWeight="700" fill="#7A1228">Peta Daerah Tanpa Tumbukan Susulan vs Tumbukan Susulan</text>
      <rect x="24" y="45" width="285" height="145" rx="10" fill="#ECFDF5" stroke="#A7F3D0" />
      <text x="40" y="68" fontSize="11" fontWeight="700" fill="#047857">Zona Aman (Hanya 2 Tumbukan)</text>
      <text x="40" y="88" fontSize="11" fill="#1C1917">Syarat: v₂″ ≥ v₁′</text>
      <text x="40" y="108" fontSize="11" fontFamily="IBM Plex Mono, monospace" fill="#1C1917">m₂² + (m₁+m₃)m₂ − 3m₁m₃ ≥ 0</text>
      <text x="40" y="134" fontSize="11" fill="#065F46">Titik optimum m₂* = √(m₁m₃) selalu</text>
      <text x="40" y="150" fontSize="11" fill="#065F46">berada di dalam zona aman (jika m₁ &gt; m₃).</text>

      <rect x="330" y="45" width="286" height="145" rx="10" fill="#FDF2F4" stroke="#E8B4BF" />
      <text x="346" y="68" fontSize="11" fontWeight="700" fill="#7A1228">Zona Tumbukan Susulan (≥ 3 Tumbukan)</text>
      <text x="346" y="88" fontSize="11" fill="#1C1917">Terjadi bila: v₂″ &lt; v₁′ atau m₂ &lt; m₃</text>
      <text x="346" y="108" fontSize="11" fill="#44403C">• Bila m₂ terlalu kecil, m₁ mengejar m₂ lagi.</text>
      <text x="346" y="128" fontSize="11" fill="#44403C">• Bila m₂ &lt; m₃, m₂ memantul ke kiri (−x)</text>
      <text x="346" y="144" fontSize="11" fill="#44403C">  lalu menghantam m₁ dan berbalik ke m₃.</text>
    </svg>
  );
}

export function QuestionStimulusDiagram({ stimulus }: { stimulus: StimulusSpec }) {
  if (stimulus.kind === 'data-table-moving') {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-4">
        <div className="text-xs font-semibold text-stone-600 mb-3">{stimulus.caption}</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-700">
                <th className="py-2 px-3 font-bold">Objek</th>
                <th className="py-2 px-3 font-bold">Massa</th>
                <th className="py-2 px-3 font-bold">Kecepatan Awal (Vektor)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono tabular-nums">
              {stimulus.labels.map((lbl, idx) => (
                <tr key={lbl}>
                  <td className="py-2 px-3 font-sans font-bold text-stone-900">{lbl}</td>
                  <td className="py-2 px-3 text-stone-800">{stimulus.masses[idx]}</td>
                  <td className="py-2 px-3 font-semibold text-[#7A1228]">{stimulus.velocities[idx]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {stimulus.extraNote && (
          <p className="mt-2.5 text-xs text-stone-600">{stimulus.extraNote}</p>
        )}
      </div>
    );
  }

  if (stimulus.kind === 'curve-m2-vs-v3') {
    const pts: string[] = [];
    const plotX = (m2: number) => 55 + ((m2 - 0.1) / 5.9) * 520;
    const plotY = (frac: number) => 165 - frac * 120;
    for (let i = 0; i <= 70; i++) {
      const m2 = 0.1 + (i / 70) * 5.9;
      const eta1 = (4 * 4 * m2) / Math.pow(4 + m2, 2);
      const eta2 = (4 * m2 * 1) / Math.pow(m2 + 1, 2);
      pts.push(`${plotX(m2).toFixed(1)},${plotY(eta1 * eta2).toFixed(1)}`);
    }
    const peakX = plotX(2.0);
    const peakY = plotY(64 / 81);
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-3 sm:p-4">
        <div className="text-xs font-semibold text-stone-600 mb-2">{stimulus.caption}</div>
        <svg viewBox="0 0 620 195" className="w-full h-auto" role="img" aria-label={stimulus.caption}>
          <line x1="55" y1="25" x2="55" y2="165" stroke="#57534E" strokeWidth="2" />
          <line x1="55" y1="165" x2="590" y2="165" stroke="#57534E" strokeWidth="2" />
          <text x="18" y="95" fontSize="10" fontWeight="600" fill="#57534E" transform="rotate(-90 18 95)" textAnchor="middle">K₃′ / E₀</text>
          <text x="320" y="186" fontSize="10" fontWeight="600" fill="#57534E" textAnchor="middle">Massa perantara m₂ (kg)</text>
          <polyline fill="none" stroke="#7A1228" strokeWidth="2.8" points={pts.join(' ')} />
          <line x1={peakX} y1={peakY} x2={peakX} y2="165" stroke="#047857" strokeDasharray="4 3" strokeWidth="1.5" />
          <circle cx={peakX} cy={peakY} r="5" fill="#047857" stroke="#FFF" strokeWidth="1.5" />
          <text x={peakX + 12} y={peakY + 4} fontSize="11" fontWeight="700" fill="#047857">
            Puncak kurva (m₂* = √(m₁m₃)) · E₀ = 40,5 J
          </text>
          <text x={peakX} y="178" textAnchor="middle" fontSize="10" fontWeight="700" fill="#047857">m₂*</text>
        </svg>
        {stimulus.extraNote && <p className="mt-1.5 text-xs text-stone-600">{stimulus.extraNote}</p>}
      </div>
    );
  }

  if (stimulus.kind === 'ramp-launch-three-body') {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-3 sm:p-4">
        <div className="text-xs font-semibold text-stone-600 mb-2">{stimulus.caption}</div>
        <svg viewBox="0 0 640 190" className="w-full h-auto" role="img" aria-label={stimulus.caption}>
          {/* Curved left ramp, flat track, angled right ramp */}
          <path d="M 40 45 Q 75 150 165 150 L 465 150 L 595 55" fill="none" stroke="#57534E" strokeWidth="2.5" />
          <line x1="40" y1="45" x2="40" y2="150" stroke="#94A3B8" strokeDasharray="4 3" />
          <text x="48" y="102" fontSize="11" fontWeight="700" fill="#7A1228">h = 3,2 m</text>

          {/* m1 at top */}
          <rect x="44" y="34" width="26" height="20" rx="4" fill="#7A1228" />
          <text x="57" y="48" textAnchor="middle" fill="#FFF" fontSize="10" fontWeight="700">m₁</text>
          <text x="95" y="48" fontSize="10" fontWeight="600" fill="#44403C">9,0 kg (diam)</text>

          {/* m2 and m3 on flat */}
          <rect x="260" y="128" width="24" height="22" rx="4" fill="#B45309" />
          <text x="272" y="143" textAnchor="middle" fill="#FFF" fontSize="10" fontWeight="700">m₂</text>
          <text x="272" y="168" textAnchor="middle" fontSize="10" fill="#44403C">m₂* (diam)</text>

          <rect x="370" y="132" width="20" height="18" rx="4" fill="#1E3A5F" />
          <text x="380" y="145" textAnchor="middle" fill="#FFF" fontSize="10" fontWeight="700">m₃</text>
          <text x="380" y="168" textAnchor="middle" fontSize="10" fill="#44403C">1,0 kg (diam)</text>

          {/* target H_maks */}
          <line x1="560" y1="80" x2="560" y2="150" stroke="#047857" strokeDasharray="4 3" />
          <text x="548" y="115" textAnchor="end" fontSize="11" fontWeight="700" fill="#047857">H_maks = ?</text>
        </svg>
        {stimulus.extraNote && <p className="mt-1.5 text-xs text-stone-600">{stimulus.extraNote}</p>}
      </div>
    );
  }

  if (stimulus.kind === 'spring-end-three-body') {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-3 sm:p-4">
        <div className="text-xs font-semibold text-stone-600 mb-2">{stimulus.caption}</div>
        <svg viewBox="0 0 640 165" className="w-full h-auto" role="img" aria-label={stimulus.caption}>
          <line x1="30" y1="125" x2="575" y2="125" stroke="#57534E" strokeWidth="2.5" />
          <rect x="575" y="45" width="14" height="80" fill="#292524" />
          <text x="582" y="36" textAnchor="middle" fontSize="10" fontWeight="600" fill="#44403C">Dinding</text>

          {/* m1 */}
          <circle cx="105" cy="98" r="26" fill="#7A1228" />
          <text x="105" y="102" textAnchor="middle" fill="#FFF" fontSize="12" fontWeight="700">m₁</text>
          <text x="105" y="145" textAnchor="middle" fontSize="10" fontWeight="600" fill="#44403C">12,0 kg</text>
          <line x1="136" y1="98" x2="188" y2="98" stroke="#047857" strokeWidth="2.5" />
          <polygon points="188,98 179,93 179,103" fill="#047857" />
          <text x="162" y="88" textAnchor="middle" fontSize="10" fontWeight="700" fill="#047857">5,0 m/s</text>

          {/* m2 */}
          <circle cx="275" cy="105" r="20" fill="#B45309" />
          <text x="275" y="109" textAnchor="middle" fill="#FFF" fontSize="11" fontWeight="700">m₂</text>
          <text x="275" y="145" textAnchor="middle" fontSize="10" fontWeight="600" fill="#44403C">m₂* (diam)</text>

          {/* m3 + spring */}
          <circle cx="425" cy="110" r="15" fill="#1E3A5F" />
          <text x="425" y="114" textAnchor="middle" fill="#FFF" fontSize="10" fontWeight="700">m₃</text>
          <text x="425" y="145" textAnchor="middle" fontSize="10" fontWeight="600" fill="#44403C">0,75 kg</text>
          <polyline
            fill="none"
            stroke="#7A1228"
            strokeWidth="2.2"
            points="440,110 455,102 470,118 485,102 500,118 515,102 530,118 545,102 560,110 575,110"
          />
          <text x="508" y="90" textAnchor="middle" fontSize="10" fontWeight="700" fill="#7A1228">k = 1200 N/m</text>
        </svg>
        {stimulus.extraNote && <p className="mt-1.5 text-xs text-stone-600">{stimulus.extraNote}</p>}
      </div>
    );
  }

  // Generic track renderer for two-body, three-body, four-body, and wall-bounce
  const count = stimulus.labels.length;
  const hasWall = stimulus.kind === 'wall-bounce-track';
  const bodyCount = hasWall ? count - 1 : count;
  const colors = ['#7A1228', '#B45309', '#1E3A5F', '#0F766E'];

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-3 sm:p-4">
      <div className="text-xs font-semibold text-stone-600 mb-2">{stimulus.caption}</div>
      <svg viewBox="0 0 640 160" className="w-full h-auto" role="img" aria-label={stimulus.caption}>
        <line x1="30" y1="120" x2={hasWall ? 555 : 610} y2="120" stroke="#57534E" strokeWidth="2.5" />
        {hasWall && (
          <>
            <rect x="555" y="38" width="14" height="82" fill="#292524" />
            <text x="562" y="28" textAnchor="middle" fontSize="10" fontWeight="700" fill="#292524">Dinding</text>
          </>
        )}

        {Array.from({ length: bodyCount }).map((_, idx) => {
          const spacing = (hasWall ? 470 : 510) / bodyCount;
          const cx = 95 + idx * spacing;
          const r = Math.max(15, 26 - idx * 3);
          const cy = 120 - r;
          const velText = stimulus.velocities[idx] || '';
          const isMovingRight = velText.includes('→') || (velText.includes('+') && !velText.includes('diam'));
          return (
            <g key={stimulus.labels[idx]}>
              <circle cx={cx} cy={cy} r={r} fill={colors[idx % colors.length]} />
              <text x={cx} y={cy + 4} textAnchor="middle" fill="#FFF" fontSize="11" fontWeight="700">
                {stimulus.labels[idx].replace(/\s*\(.*\)/, '')}
              </text>
              <text x={cx} y="140" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#1C1917">
                {stimulus.masses[idx]}
              </text>
              {isMovingRight ? (
                <>
                  <line x1={cx + r + 8} y1={cy} x2={cx + r + 58} y2={cy} stroke="#047857" strokeWidth="2.4" />
                  <polygon points={`${cx + r + 58},${cy} ${cx + r + 50},${cy - 4.5} ${cx + r + 50},${cy + 4.5}`} fill="#047857" />
                  <text x={cx + r + 35} y={cy - 12} textAnchor="middle" fontSize="10" fontWeight="700" fill="#047857">
                    {velText.replace('→', '').trim()}
                  </text>
                </>
              ) : (
                <text x={cx} y={cy - r - 8} textAnchor="middle" fontSize="10" fontWeight="600" fill="#57534E">
                  {velText}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {stimulus.extraNote && <p className="mt-1.5 text-xs text-stone-600">{stimulus.extraNote}</p>}
    </div>
  );
}

export function FreeBodyDiagram({
  vectors,
  bodyLabels,
}: {
  vectors: FBDVectorSpec[];
  bodyLabels: string[];
}) {
  const uniqueBodies = Array.from(new Set(vectors.map((v) => v.targetBodyIndex))).sort((a, b) => a - b);
  const count = Math.max(uniqueBodies.length, 1);

  const colorByCategory: Record<FBDVectorSpec['category'], string> = {
    normal: '#1E3A5F',
    weight: '#57534E',
    impulse: '#7A1228',
    velocity: '#047857',
    spring: '#B45309',
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-3 sm:p-4">
      <svg viewBox="0 0 640 220" className="w-full h-auto" role="img" aria-label="Free Body Diagram (FBD) sistem benda">
        {/* Coordinate axes top-left */}
        <g transform="translate(36, 56)">
          <line x1="0" y1="0" x2="36" y2="0" stroke="#292524" strokeWidth="1.8" />
          <polygon points="36,0 30,-3.5 30,3.5" fill="#292524" />
          <text x="42" y="4" fontSize="10" fontWeight="700" fill="#292524">+x</text>

          <line x1="0" y1="0" x2="0" y2="-36" stroke="#292524" strokeWidth="1.8" />
          <polygon points="0,-36 -3.5,-30 3.5,-30" fill="#292524" />
          <text x="-5" y="-41" fontSize="10" fontWeight="700" fill="#292524">+y</text>
        </g>

        {/* Reference ground line */}
        <line x1="85" y1="150" x2="605" y2="150" stroke="#D6D3D1" strokeWidth="1.5" strokeDasharray="4 4" />

        {uniqueBodies.map((bodyIdx, posIdx) => {
          const cx = 165 + posIdx * (390 / Math.max(count, 1));
          const cy = 116;
          const r = 20;
          const bodyVectors = vectors.filter((v) => v.targetBodyIndex === bodyIdx);
          const label = bodyLabels[bodyIdx] ?? `m${bodyIdx + 1}`;

          return (
            <g key={bodyIdx}>
              {/* Body circle + CoM dot */}
              <circle cx={cx} cy={cy} r={r} fill="#FAF8F8" stroke="#292524" strokeWidth="2" />
              <circle cx={cx} cy={cy} r="3" fill="#7A1228" />
              <text x={cx + r + 6} y={cy - r + 2} fontSize="11" fontWeight="700" fill="#1C1917">
                {label.replace(/\s*\(.*\)/, '')}
              </text>

              {bodyVectors.map((vec, vIdx) => {
                const color = colorByCategory[vec.category];
                const len = 46;
                let x1 = cx;
                let y1 = cy;
                let x2 = cx;
                let y2 = cy;
                let lx = cx;
                let ly = cy;
                let anchor: 'start' | 'middle' | 'end' = 'middle';

                if (vec.direction === 'up') {
                  y1 = cy - 4;
                  y2 = cy - len;
                  lx = cx;
                  ly = y2 - 8;
                } else if (vec.direction === 'down') {
                  y1 = cy + 4;
                  y2 = cy + len;
                  lx = cx;
                  ly = y2 + 14;
                } else if (vec.direction === 'right') {
                  const offsetY = (vIdx % 2) * 14 - 4;
                  x1 = cx + 6;
                  y1 = cy + offsetY;
                  x2 = cx + len + 10;
                  y2 = cy + offsetY;
                  lx = x2 + 6;
                  ly = y2 + 4;
                  anchor = 'start';
                } else {
                  const offsetY = (vIdx % 2) * 14 - 4;
                  x1 = cx - 6;
                  y1 = cy + offsetY;
                  x2 = cx - len - 10;
                  y2 = cy + offsetY;
                  lx = x2 - 6;
                  ly = y2 + 4;
                  anchor = 'end';
                }

                // Arrowhead angle
                const angle = Math.atan2(y2 - y1, x2 - x1);
                const ah1x = x2 - 8 * Math.cos(angle - Math.PI / 6);
                const ah1y = y2 - 8 * Math.sin(angle - Math.PI / 6);
                const ah2x = x2 - 8 * Math.cos(angle + Math.PI / 6);
                const ah2y = y2 - 8 * Math.sin(angle + Math.PI / 6);

                return (
                  <g key={`${vec.label}-${vIdx}`}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2.4" />
                    <polygon points={`${x2},${y2} ${ah1x},${ah1y} ${ah2x},${ah2y}`} fill={color} />
                    <text x={lx} y={ly} textAnchor={anchor} fontSize="11" fontWeight="700" fill={color}>
                      {vec.label}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Legend */}
        <text x="36" y="205" fontSize="10" fill="#57534E">
          Legenda: Biru = Gaya Normal (N) · Abu = Gaya Berat (W) · Merah Marun = Gaya Impulsif Kontak (F) · Hijau = Vektor Kecepatan (v)
        </text>
      </svg>
    </div>
  );
}
