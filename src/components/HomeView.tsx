import { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Compass, PlayCircle } from 'lucide-react';
import { analyzeThreeMassChain, optimalMiddleMass } from '../physics/collisionEngine';
import { PhysicsProofAnimator } from './PhysicsProofAnimator';

interface HomeViewProps {
  onStartLearn: () => void;
  onStartPractice: () => void;
  onOpenConceptMap: () => void;
  completedCount: number;
  correctCount: number;
}

export function HomeView({
  onStartLearn,
  onStartPractice,
  onOpenConceptMap,
  completedCount,
  correctCount,
}: HomeViewProps) {
  const [heroM2, setHeroM2] = useState<number>(1.5);
  const [heroPlayTrigger, setHeroPlayTrigger] = useState<number>(0);

  const m1 = 9.0;
  const m3 = 0.25;
  const v1 = 4.9;
  const m2Opt = optimalMiddleMass(m1, m3); // 1.5 kg

  const chainStats = useMemo(
    () => analyzeThreeMassChain(m1, heroM2, m3, v1, 1),
    [heroM2]
  );

  const heroConfig = useMemo(
    () => ({
      bodies: [
        { id: 'h1', label: 'm₁', mass: m1, x0: 1.2, v0: v1, radius: 0.5, color: '#7A1228' },
        { id: 'h2', label: 'm₂', mass: heroM2, x0: 5.0, v0: 0.0, radius: 0.36, color: '#B45309' },
        { id: 'h3', label: 'm₃', mass: m3, x0: 8.5, v0: 0.0, radius: 0.26, color: '#1E3A5F' },
      ],
      duration: 2.1,
    }),
    [heroM2]
  );

  return (
    <div className="space-y-12">
      {/* Hero Split */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        <div className="flex flex-col justify-start gap-6 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 lg:col-span-5">
          <div>
            <p className="text-xs font-bold tracking-wider text-[#7A1228] uppercase">
              OLYMPIAD PHYSICS TRAINING · CITY LEVEL – OSK 2026
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl text-balance">
              SPECIAL TRAINING: QUESTION NUMBER 14
            </h1>
            <p className="mt-3 text-sm font-semibold text-stone-700">
              TEACHER: MISTER JO
            </p>

            <div className="my-5 h-px bg-stone-200" />

            <p className="text-sm sm:text-base leading-relaxed text-stone-600">
              Program pembinaan terstruktur untuk menguasai tuntas materi{' '}
              <strong className="font-semibold text-stone-900">
                Tumbukan Elastis Beruntun 3-Massa &amp; Optimasi Transfer Momentum
              </strong>{' '}
              dari Soal Nomor 14 OSK Fisika SMA 2026. Mulai dari konsep dasar,
              penurunan rumus, Free Body Diagram, animasi pembuktian hukum fisika,
              narator suara Indonesia, hingga 15 soal latihan isian singkat.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onStartLearn}
                className="inline-flex items-center gap-2 rounded-xl bg-[#7A1228] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#5E0D1E] cursor-pointer whitespace-nowrap"
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                MULAI BELAJAR
              </button>
              <button
                type="button"
                onClick={onStartPractice}
                className="inline-flex items-center gap-2 rounded-xl border border-[#7A1228] bg-white px-5 py-3 text-sm font-bold text-[#7A1228] transition-colors hover:bg-[#FDF5F6] cursor-pointer whitespace-nowrap"
              >
                MULAI LATIHAN
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenConceptMap}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#7A1228] transition-colors cursor-pointer"
            >
              <Compass className="h-3.5 w-3.5" aria-hidden="true" />
              Lihat Peta Konsep Pembelajaran
            </button>
          </div>
        </div>

        {/* Interactive Phenomenon Visualizer Stage */}
        <div className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-[#FAF8F8] p-5 sm:p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Laboratorium Mini Soal Asli OSK 2026 No. 14
              </h2>
              <p className="text-xs text-stone-600">
                m₁ = 9,0 kg (v₁ = 4,9 m/s) · m₃ = 0,25 kg · Ubah m₂ untuk melihat puncak v₃!
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setHeroM2(1.5);
                setHeroPlayTrigger((n) => n + 1);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#7A1228] hover:border-[#7A1228] cursor-pointer whitespace-nowrap"
            >
              <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />
              Setel Titik Optimal (m₂ = 1,5 kg)
            </button>
          </div>

          <div className="mb-4 rounded-xl border border-stone-200 bg-white p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-1.5">
              <label htmlFor="hero-m2-slider" className="font-semibold text-stone-800">
                Massa Perantara m₂:{' '}
                <span className="font-mono text-[#7A1228] tabular-nums">
                  {heroM2.toFixed(2).replace('.', ',')} kg
                </span>
                {Math.abs(heroM2 - m2Opt) < 0.06 && (
                  <span className="ml-2 font-semibold text-[#047857]">
                    · Titik Optimum √(m₁·m₃)
                  </span>
                )}
              </label>
              <span className="font-mono text-stone-600 tabular-nums">
                v₃ akhir ={' '}
                <strong className="text-[#7A1228]">
                  {chainStats.v3AfterSecond.toFixed(2).replace('.', ',')} m/s
                </strong>
              </span>
            </div>
            <input
              id="hero-m2-slider"
              type="range"
              min={0.3}
              max={5.0}
              step={0.1}
              value={heroM2}
              onChange={(e) => setHeroM2(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer accent-[#7A1228]"
            />
          </div>

          <PhysicsProofAnimator
            config={heroConfig}
            title="Simulasi Langsung Sistem 3-Massa (m₁ → m₂ → m₃)"
            formulaOverlay="m₂* = √(9,0 × 0,25) = 1,5 kg  |  v₃′ = [4m₁m₂ / ((m₁+m₂)(m₂+m₃))] · v₁"
            autoPlaySignal={heroPlayTrigger}
          />
        </div>
      </section>

      {/* Curriculum Metrics Row */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="text-xs font-semibold text-stone-500">Fokus Materi Asli</div>
          <div className="mt-1 text-xl font-extrabold text-stone-900 tabular-nums">Soal No. 14</div>
          <p className="mt-1.5 text-xs text-stone-600">
            Momentum Linear: Tumbukan elastis beruntun 3-massa &amp; optimasi transfer energi.
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="text-xs font-semibold text-stone-500">Kurikulum Teori</div>
          <div className="mt-1 text-xl font-extrabold text-stone-900 tabular-nums">5 Bab Sistematis</div>
          <p className="mt-1.5 text-xs text-stone-600">
            Dari hukum kekekalan dasar, kerangka pusat massa, hingga batas tumbukan susulan.
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="text-xs font-semibold text-stone-500">Bank Soal Olimpiade</div>
          <div className="mt-1 text-xl font-extrabold text-stone-900 tabular-nums">15 Isian Singkat</div>
          <p className="mt-1.5 text-xs text-stone-600">
            Jawaban numerik 1 desimal (koma), lengkap dengan FBD, pembahasan A–J, dan animasi bukti.
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="text-xs font-semibold text-stone-500">Progres Belajar Anda</div>
          <div className="mt-1 text-xl font-extrabold text-[#7A1228] tabular-nums">
            {completedCount} / 15 Soal ({correctCount} Benar)
          </div>
          <p className="mt-1.5 text-xs text-stone-600">
            Rekam jejak otomatis tersimpan dengan analisis kelemahan per kompetensi.
          </p>
        </div>
      </section>
    </div>
  );
}
