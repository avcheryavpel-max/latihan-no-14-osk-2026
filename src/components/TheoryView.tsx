import { ArrowRight, BookOpen } from 'lucide-react';
import { THEORY_CHAPTERS, type TheoryChapter } from '../data/theoryCurriculum';
import type { SpeechNarratorControls } from '../hooks/useSpeechNarrator';
import { NarratorControlBar } from './NarratorControlBar';
import { TheoryDiagram } from './ScientificDiagrams';

interface TheoryViewProps {
  activeChapterId: string;
  onSelectChapter: (chapterId: string) => void;
  onGoToPractice: () => void;
  narrator: SpeechNarratorControls;
}

export function TheoryView({
  activeChapterId,
  onSelectChapter,
  onGoToPractice,
  narrator,
}: TheoryViewProps) {
  const chapter: TheoryChapter =
    THEORY_CHAPTERS.find((c) => c.id === activeChapterId) ?? THEORY_CHAPTERS[0];
  const currentIndex = THEORY_CHAPTERS.findIndex((c) => c.id === chapter.id);
  const nextChapter = THEORY_CHAPTERS[currentIndex + 1];

  return (
    <div className="space-y-8">
      <div className="border-b border-stone-200 pb-5">
        <p className="text-xs font-bold tracking-wider text-[#7A1228] uppercase">
          Belajar Teori Terstruktur · Materi Soal No. 14 OSK 2026
        </p>
        <h2 className="mt-1 text-2xl font-extrabold text-stone-900 sm:text-3xl">
          Kurikulum Lengkap Tumbukan Elastis Beruntun
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-stone-600">
          Pelajari setiap bab secara berurutan agar Anda memahami tidak hanya rumus jadi,
          melainkan alasan fisis, penurunan matematis, batas keberlakuan, hingga trik cepat
          tingkat Olimpiade Sains Kota/Kabupaten.
        </p>
      </div>

      {/* Chapter Navigation Tabs */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {THEORY_CHAPTERS.map((ch) => {
          const isActive = ch.id === chapter.id;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => onSelectChapter(ch.id)}
              className={`text-left rounded-xl border p-3.5 transition-colors cursor-pointer ${
                isActive
                  ? 'border-[#7A1228] bg-[#FDF5F6]'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className={isActive ? 'text-[#7A1228]' : 'text-stone-500'}>
                  {ch.order}
                </span>
                <span className="text-stone-500">{ch.levelLabel}</span>
              </div>
              <div className="mt-1 text-xs font-bold text-stone-900 line-clamp-2">
                {ch.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Chapter Content */}
      <article className="space-y-8 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <header className="space-y-4 border-b border-stone-100 pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-stone-500">
            <span className="text-[#7A1228]">{chapter.order}</span>
            <span aria-hidden="true">·</span>
            <span>{chapter.levelLabel}</span>
            <span aria-hidden="true">·</span>
            <span>Pembimbing: Mister Jo</span>
          </div>
          <h3 className="text-2xl font-extrabold text-stone-900">{chapter.title}</h3>
          <p className="text-sm sm:text-base text-stone-600">{chapter.summary}</p>

          <NarratorControlBar
            narrator={narrator}
            sourceId={`theory-${chapter.id}`}
            text={`${chapter.title}. ${chapter.narrationText}`}
            label={`Narator Teori · ${chapter.order}`}
          />
        </header>

        {/* Scientific Diagram */}
        <section className="space-y-2.5">
          <h4 className="text-sm font-bold text-stone-900">
            Visualisasi Skema &amp; Stimulus Ilmiah
          </h4>
          <TheoryDiagram type={chapter.diagramType} />
        </section>

        {/* Core Ideas */}
        <section className="space-y-3">
          <h4 className="text-sm font-bold text-stone-900">Konsep Dasar yang Wajib Dikuasai</h4>
          <ul className="space-y-2.5">
            {chapter.keyIdeas.map((idea, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-stone-200 bg-[#FAF8F8] px-4 py-3 text-sm text-stone-800"
              >
                <span className="font-mono text-xs font-bold text-[#7A1228] mt-0.5 tabular-nums">
                  0{idx + 1}.
                </span>
                <span>{idea}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Symbols and Quantities Table */}
        <section className="space-y-3">
          <h4 className="text-sm font-bold text-stone-900">
            Definisi Besaran Pokok, Turunan, Simbol &amp; Satuan SI
          </h4>
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-700">
                  <th className="py-2.5 px-3 font-bold">Simbol</th>
                  <th className="py-2.5 px-3 font-bold">Nama Besaran</th>
                  <th className="py-2.5 px-3 font-bold">Klasifikasi</th>
                  <th className="py-2.5 px-3 font-bold">Satuan SI</th>
                  <th className="py-2.5 px-3 font-bold">Makna Fisis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {chapter.symbols.map((sym) => (
                  <tr key={sym.symbol}>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#7A1228] whitespace-nowrap">
                      {sym.symbol}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-stone-900">{sym.name}</td>
                    <td className="py-2.5 px-3 text-stone-600 whitespace-nowrap">
                      {sym.quantityType}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-stone-800 whitespace-nowrap">
                      {sym.unit}
                    </td>
                    <td className="py-2.5 px-3 text-stone-600">{sym.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Laws and Derivations */}
        <section className="space-y-4">
          <h4 className="text-sm font-bold text-stone-900">
            Hukum Fisika, Persamaan &amp; Penurunan Matematis
          </h4>
          {chapter.lawsAndDerivations.map((law, idx) => (
            <div key={idx} className="space-y-3 rounded-xl border border-stone-200 bg-white p-5">
              <div className="text-base font-bold text-stone-900">{law.heading}</div>
              <p className="text-sm text-stone-600">{law.explanation}</p>
              <div className="rounded-xl border border-[#E8B4BF] bg-[#FDF5F6] px-4 py-3 font-mono text-sm font-bold text-[#7A1228] overflow-x-auto">
                {law.equation}
              </div>
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold text-stone-500">Langkah Penurunan:</div>
                <ol className="space-y-2 text-sm text-stone-700">
                  {law.derivationSteps.map((step, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2.5">
                      <span className="font-mono text-xs font-bold text-stone-500 mt-1 tabular-nums">
                        {sIdx + 1})
                      </span>
                      <span className="font-serif leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </section>

        {/* Assumptions & Common Mistakes 2-col */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-5">
            <h4 className="text-sm font-bold text-stone-900">
              Asumsi &amp; Kondisi Berlakunya Persamaan
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-stone-700">
              {chapter.assumptions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-[#7A1228]">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-[#E8B4BF] bg-[#FDF5F6] p-5">
            <h4 className="text-sm font-bold text-[#7A1228]">
              Kesalahan Umum Peserta Olimpiade
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-stone-800">
              {chapter.commonMistakes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-[#7A1228]">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Olympiad Trick & Real World */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <h4 className="text-sm font-bold text-stone-900">Strategi Cepat Olimpiade</h4>
            <p className="mt-2 text-sm leading-relaxed text-stone-700">
              {chapter.olympiadTrick}
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <h4 className="text-sm font-bold text-stone-900">
              Penerapan dalam Fenomena Kehidupan Nyata
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-stone-700">
              {chapter.realWorldExample}
            </p>
          </div>
        </section>

        {/* Footer Actions */}
        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 pt-5">
          {nextChapter ? (
            <button
              type="button"
              onClick={() => onSelectChapter(nextChapter.id)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#7A1228] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#5E0D1E] cursor-pointer"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Lanjut ke {nextChapter.order}: {nextChapter.title}
            </button>
          ) : (
            <button
              type="button"
              onClick={onGoToPractice}
              className="inline-flex items-center gap-2 rounded-xl bg-[#7A1228] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#5E0D1E] cursor-pointer"
            >
              Selesai Teori — Mulai 15 Soal Latihan
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}

          <button
            type="button"
            onClick={onGoToPractice}
            className="text-sm font-semibold text-[#7A1228] hover:underline cursor-pointer"
          >
            Langsung ke Bank 15 Soal Latihan →
          </button>
        </footer>
      </article>
    </div>
  );
}
