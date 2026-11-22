import { useState } from 'react';
import { ArrowRight, CheckCircle2, CircleDashed, RotateCcw, XCircle } from 'lucide-react';
import { PRACTICE_QUESTIONS, type QuestionDifficulty } from '../data/questionsBank';
import type { QuestionAttemptRecord } from './PracticeView';

interface EvaluationViewProps {
  attempts: Record<number, QuestionAttemptRecord>;
  onJumpToQuestion: (questionId: number, openExplanation: boolean) => void;
  onJumpToChapter: (chapterId: string) => void;
  onResetProgress: () => void;
}

const DIFFICULTIES: QuestionDifficulty[] = [
  'Pengenalan Konsep',
  'Aplikasi',
  'Analisis',
  'HOTS Olimpiade',
];

export function EvaluationView({
  attempts,
  onJumpToQuestion,
  onJumpToChapter,
  onResetProgress,
}: EvaluationViewProps) {
  const [confirmingReset, setConfirmingReset] = useState(false);

  const totalQuestions = PRACTICE_QUESTIONS.length;
  const answeredList = Object.values(attempts);
  const answeredCount = answeredList.length;
  const correctCount = answeredList.filter((a) => a.isCorrect).length;
  const wrongQuestions = PRACTICE_QUESTIONS.filter(
    (q) => attempts[q.id] && !attempts[q.id].isCorrect
  );
  const scoreOutOf100 = Math.round((correctCount / totalQuestions) * 100);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <p className="text-xs font-bold tracking-wider text-[#7A1228] uppercase">
            Hasil dan Evaluasi Latihan
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-stone-900 sm:text-3xl">
            Rekapitulasi Penguasaan Materi Soal No. 14
          </h2>
          <p className="mt-1.5 text-sm text-stone-600">
            Pantau skor otomatis, progres 15 soal, dan identifikasi topik yang perlu diperkuat.
          </p>
        </div>

        <div>
          {!confirmingReset ? (
            <button
              type="button"
              onClick={() => setConfirmingReset(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-bold text-stone-700 hover:border-[#7A1228] hover:text-[#7A1228] cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Atur Ulang Progres
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-xs">
              <span className="font-semibold text-rose-900">Hapus semua jawaban?</span>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmingReset(false);
                }}
                className="rounded-lg bg-[#7A1228] px-2.5 py-1 font-bold text-white cursor-pointer"
              >
                Ya, Hapus
              </button>
              <button
                type="button"
                onClick={() => setConfirmingReset(false)}
                className="rounded-lg border border-stone-300 bg-white px-2.5 py-1 font-semibold text-stone-700 cursor-pointer"
              >
                Batal
              </button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Summary Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="text-xs font-semibold text-stone-500">Skor Akhir Otomatis</div>
          <div className="mt-1 font-mono text-3xl font-extrabold text-[#7A1228] tabular-nums">
            {scoreOutOf100} / 100
          </div>
          <div className="mt-1 text-xs text-stone-600">Skala penilaian 15 soal isian singkat</div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="text-xs font-semibold text-stone-500">Progres Pengerjaan</div>
          <div className="mt-1 font-mono text-3xl font-extrabold text-stone-900 tabular-nums">
            {answeredCount} / {totalQuestions}
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full bg-[#7A1228] transition-all"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="text-xs font-semibold text-stone-500">Jawaban Benar</div>
          <div className="mt-1 font-mono text-3xl font-extrabold text-emerald-700 tabular-nums">
            {correctCount} Soal
          </div>
          <div className="mt-1 text-xs text-stone-600">
            Akurasi saat ini:{' '}
            {answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0}%
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="text-xs font-semibold text-stone-500">Perlu Diperbaiki</div>
          <div className="mt-1 font-mono text-3xl font-extrabold text-rose-700 tabular-nums">
            {wrongQuestions.length} Soal
          </div>
          <div className="mt-1 text-xs text-stone-600">
            {totalQuestions - answeredCount} soal belum dikerjakan
          </div>
        </div>
      </div>

      {/* Breakdown by Competency Tier */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <h3 className="text-base font-bold text-stone-900 mb-4">
          Analisis Penguasaan Berdasarkan Tingkat Kompetensi
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DIFFICULTIES.map((diff) => {
            const group = PRACTICE_QUESTIONS.filter((q) => q.difficulty === diff);
            const groupCorrect = group.filter((q) => attempts[q.id]?.isCorrect).length;
            const groupAttempted = group.filter((q) => Boolean(attempts[q.id])).length;
            return (
              <div key={diff} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                <div className="text-xs font-bold text-stone-900">{diff}</div>
                <div className="mt-1 font-mono text-lg font-extrabold text-[#7A1228] tabular-nums">
                  {groupCorrect} / {group.length} Benar
                </div>
                <div className="mt-1 text-xs text-stone-600 tabular-nums">
                  {groupAttempted} dari {group.length} dikerjakan
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Weakness Analysis & Study Recommendation */}
      <section className="rounded-2xl border border-[#E8B4BF] bg-[#FDF5F6] p-6">
        <h3 className="text-base font-bold text-[#7A1228]">
          Analisis Kelemahan &amp; Rekomendasi Pembinaan Mister Jo
        </h3>
        {answeredCount === 0 ? (
          <p className="mt-2 text-sm text-stone-700">
            Anda belum mengirimkan jawaban pada Bank 15 Soal Latihan. Mulai kerjakan soal terlebih
            dahulu agar sistem dapat memetakan nomor soal dan konsep yang perlu diperkuat.
          </p>
        ) : wrongQuestions.length === 0 && answeredCount === totalQuestions ? (
          <p className="mt-2 text-sm font-medium text-emerald-900">
            Luar biasa! Seluruh 15 soal telah dijawab dengan tepat. Anda telah menguasai tuntas
            analisis tumbukan elastis beruntun, optimasi m₂ = √(m₁m₃), kerangka pusat massa,
            hingga kasus batas tumbukan susulan.
          </p>
        ) : wrongQuestions.length === 0 ? (
          <p className="mt-2 text-sm text-stone-700">
            Sejauh ini seluruh soal yang Anda jawab sudah benar ({correctCount} soal). Lanjutkan
            menyelesaikan {totalQuestions - answeredCount} soal tersisa untuk menguji kesiapan HOTS
            Olimpiade penuh.
          </p>
        ) : (
          <div className="mt-3 space-y-2.5">
            <p className="text-sm text-stone-800">
              Terdeteksi <strong>{wrongQuestions.length} soal</strong> yang masih keliru. Pelajari
              kembali pembahasan FBD dan penurunan rumusnya melalui tautan di bawah ini:
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {wrongQuestions.map((wq) => (
                <div
                  key={wq.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#E8B4BF] bg-white px-4 py-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-stone-900 truncate">
                      {wq.code}: {wq.title}
                    </div>
                    <div className="text-stone-500">
                      Jawaban Anda: <span className="font-mono text-rose-700">{attempts[wq.id].normalizedInput}</span> · {wq.difficulty}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onJumpToChapter(wq.relatedChapterId)}
                      className="font-semibold text-stone-600 hover:text-[#7A1228] cursor-pointer"
                    >
                      Teori
                    </button>
                    <button
                      type="button"
                      onClick={() => onJumpToQuestion(wq.id, true)}
                      className="rounded-lg bg-[#7A1228] px-2.5 py-1.5 font-bold text-white hover:bg-[#5E0D1E] cursor-pointer whitespace-nowrap"
                    >
                      Pembahasan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Complete 15-Question Status Table */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <h3 className="text-base font-bold text-stone-900 mb-4">
          Daftar Rincian Nomor Soal 1 – 15
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500">
                <th className="py-2.5 pr-3 font-bold">Nomor</th>
                <th className="py-2.5 pr-3 font-bold">Topik Soal</th>
                <th className="py-2.5 pr-3 font-bold">Kompetensi</th>
                <th className="py-2.5 pr-3 font-bold">Status</th>
                <th className="py-2.5 pr-3 font-bold">Input Anda</th>
                <th className="py-2.5 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {PRACTICE_QUESTIONS.map((q) => {
                const att = attempts[q.id];
                return (
                  <tr key={q.id}>
                    <td className="py-2.5 pr-3 font-mono font-bold text-[#7A1228] whitespace-nowrap">
                      {q.code}
                    </td>
                    <td className="py-2.5 pr-3 font-semibold text-stone-900">{q.title}</td>
                    <td className="py-2.5 pr-3 text-stone-600 whitespace-nowrap">{q.difficulty}</td>
                    <td className="py-2.5 pr-3 whitespace-nowrap">
                      {!att ? (
                        <span className="inline-flex items-center gap-1 text-stone-500 font-medium">
                          <CircleDashed className="h-3.5 w-3.5" aria-hidden="true" />
                          Belum Dikerjakan
                        </span>
                      ) : att.isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Benar
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-bold">
                          <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          Salah
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 pr-3 font-mono tabular-nums text-stone-700 whitespace-nowrap">
                      {att ? `${att.normalizedInput} ${q.unit}` : '—'}
                    </td>
                    <td className="py-2.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onJumpToQuestion(q.id, Boolean(att))}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#7A1228] hover:underline cursor-pointer"
                      >
                        {att ? 'Pelajari Pembahasan' : 'Kerjakan'}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
