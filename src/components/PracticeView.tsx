import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  HelpCircle,
  Play,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { PRACTICE_QUESTIONS, type PracticeQuestion } from '../data/questionsBank';
import type { SpeechNarratorControls } from '../hooks/useSpeechNarrator';
import { evaluateNumericAnswer, formatIndonesianDecimal } from '../physics/answerEvaluator';
import { NarratorControlBar } from './NarratorControlBar';
import { PhysicsProofAnimator } from './PhysicsProofAnimator';
import { FreeBodyDiagram, QuestionStimulusDiagram } from './ScientificDiagrams';

export interface QuestionAttemptRecord {
  questionId: number;
  rawInput: string;
  normalizedInput: string;
  isCorrect: boolean;
  attemptsCount: number;
}

interface PracticeViewProps {
  activeQuestionId: number;
  onSelectQuestion: (id: number) => void;
  attempts: Record<number, QuestionAttemptRecord>;
  onSubmitAnswer: (questionId: number, rawInput: string) => {
    valid: boolean;
    isCorrect: boolean;
    message: string;
  };
  openExplanationOnLoad?: boolean;
  onConsumeOpenExplanationFlag?: () => void;
  narrator: SpeechNarratorControls;
  onGoToChapter: (chapterId: string) => void;
}

export function PracticeView({
  activeQuestionId,
  onSelectQuestion,
  attempts,
  onSubmitAnswer,
  openExplanationOnLoad = false,
  onConsumeOpenExplanationFlag,
  narrator,
  onGoToChapter,
}: PracticeViewProps) {
  const question: PracticeQuestion =
    PRACTICE_QUESTIONS.find((q) => q.id === activeQuestionId) ?? PRACTICE_QUESTIONS[0];

  const existingAttempt = attempts[question.id];

  const [inputValue, setInputValue] = useState<string>(existingAttempt?.rawInput ?? '');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [feedbackBanner, setFeedbackBanner] = useState<{
    isCorrect: boolean;
    message: string;
  } | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [animPlaySignal, setAnimPlaySignal] = useState<number>(0);
  const animContainerRef = useRef<HTMLDivElement | null>(null);

  // Reset per-question disclosure states when navigating between questions
  useEffect(() => {
    const saved = attempts[question.id];
    setInputValue(saved?.rawInput ?? '');
    setValidationError(null);
    if (saved) {
      const evalRes = evaluateNumericAnswer(saved.rawInput, question.expectedAnswer);
      setFeedbackBanner({ isCorrect: evalRes.isCorrect, message: evalRes.message });
    } else {
      setFeedbackBanner(null);
    }
    setShowHint(false);
    setShowExplanation(openExplanationOnLoad);
    setAnimPlaySignal(0);
    if (openExplanationOnLoad && onConsumeOpenExplanationFlag) {
      onConsumeOpenExplanationFlag();
    }
  }, [question.id, openExplanationOnLoad]); // intentionally run on question switch

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const res = onSubmitAnswer(question.id, inputValue);
    if (!res.valid) {
      setValidationError(res.message);
      setFeedbackBanner(null);
      return;
    }
    setValidationError(null);
    setFeedbackBanner({ isCorrect: res.isCorrect, message: res.message });
  };

  const handleTriggerAnimation = () => {
    if (!showExplanation) {
      setShowExplanation(true);
    }
    setAnimPlaySignal((n) => n + 1);
    window.setTimeout(() => {
      animContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
  };

  const currentIdx = PRACTICE_QUESTIONS.findIndex((q) => q.id === question.id);
  const prevQ = PRACTICE_QUESTIONS[currentIdx - 1];
  const nextQ = PRACTICE_QUESTIONS[currentIdx + 1];

  return (
    <div className="space-y-6">
      {/* Header & Question Selector Strip */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-xs font-bold tracking-wider text-[#7A1228] uppercase">
              Bank 15 Soal Latihan OSK 2026 · Isian Singkat
            </p>
            <h2 className="mt-0.5 text-xl font-extrabold text-stone-900 sm:text-2xl">
              Pendalaman Soal Nomor 14 ({Object.keys(attempts).length}/15 Dikerjakan)
            </h2>
          </div>
          <div className="text-xs text-stone-600">
            Format jawaban: <strong>1 desimal dengan tanda koma</strong> (contoh:{' '}
            <code className="font-mono font-semibold text-[#7A1228]">14,4</code>)
          </div>
        </div>

        {/* 1..15 Number Grid */}
        <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-15">
          {PRACTICE_QUESTIONS.map((q) => {
            const att = attempts[q.id];
            const isActive = q.id === question.id;
            let stateClasses =
              'border-stone-200 bg-white text-stone-700 hover:border-stone-400';
            if (isActive) {
              stateClasses = 'border-[#7A1228] bg-[#7A1228] text-white';
            } else if (att?.isCorrect) {
              stateClasses = 'border-emerald-300 bg-emerald-50 text-emerald-800';
            } else if (att && !att.isCorrect) {
              stateClasses = 'border-rose-300 bg-rose-50 text-rose-800';
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onSelectQuestion(q.id)}
                aria-label={`Pilih ${q.code}`}
                className={`rounded-lg border py-2 text-xs font-bold tabular-nums transition-colors cursor-pointer ${stateClasses}`}
              >
                {q.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Workspace */}
      <article className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        {/* Question Metadata & Title */}
        <header className="space-y-3 border-b border-stone-100 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-stone-500">
              <span className="font-mono font-bold text-[#7A1228]">{question.code}</span>
              <span aria-hidden="true">·</span>
              <span>Tingkat: {question.difficulty}</span>
              <span aria-hidden="true">·</span>
              <span>Satuan Akhir: {question.unit}</span>
            </div>
            <button
              type="button"
              onClick={() => onGoToChapter(question.relatedChapterId)}
              className="text-xs font-semibold text-[#7A1228] hover:underline cursor-pointer"
            >
              Lihat Teori Terkait →
            </button>
          </div>
          <h3 className="text-xl font-extrabold text-stone-900 sm:text-2xl">
            {question.title}
          </h3>

          <NarratorControlBar
            narrator={narrator}
            sourceId={`question-${question.id}`}
            text={question.promptNarration}
            label={`Narator Soal & Stimulus (${question.code})`}
            compact
          />
        </header>

        {/* Required Scientific Stimulus BEFORE Prompt */}
        <section aria-label="Stimulus Soal" className="space-y-2">
          <div className="text-xs font-bold text-stone-500 uppercase tracking-wide">
            Stimulus Fenomena Fisika
          </div>
          <QuestionStimulusDiagram stimulus={question.stimulus} />
        </section>

        {/* Question Prompt */}
        <section className="space-y-4">
          <p className="text-base leading-relaxed font-medium text-stone-900">
            {question.prompt}
          </p>

          {/* Short-answer numeric form */}
          <form onSubmit={handleSubmit} className="rounded-xl border border-stone-200 bg-[#FAF8F8] p-4 sm:p-5">
            <label htmlFor={`answer-input-${question.id}`} className="block text-xs font-bold text-stone-700 mb-2">
              Jawaban Numerik Anda (gunakan koma untuk desimal, 1 angka di belakang koma):
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center overflow-hidden rounded-xl border border-stone-300 bg-white focus-within:border-[#7A1228] focus-within:ring-2 focus-within:ring-[#7A1228]/20">
                <input
                  id={`answer-input-${question.id}`}
                  type="text"
                  inputMode="decimal"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Contoh: 14,4"
                  className="w-40 px-4 py-2.5 font-mono text-base font-bold text-stone-900 tabular-nums focus:outline-none"
                />
                <span className="border-l border-stone-200 bg-stone-50 px-3 py-2.5 font-mono text-xs font-semibold text-stone-600">
                  {question.unit}
                </span>
              </div>

              <button
                type="submit"
                className="rounded-xl bg-[#7A1228] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#5E0D1E] cursor-pointer whitespace-nowrap"
              >
                Periksa Jawaban
              </button>
            </div>

            {validationError && (
              <p className="mt-2.5 text-xs font-semibold text-rose-700">{validationError}</p>
            )}

            {feedbackBanner && (
              <div
                role="status"
                className={`mt-3 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-xs sm:text-sm font-medium ${
                  feedbackBanner.isCorrect
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                    : 'border-rose-300 bg-rose-50 text-rose-900'
                }`}
              >
                {feedbackBanner.isCorrect ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" aria-hidden="true" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0 text-rose-700 mt-0.5" aria-hidden="true" />
                )}
                <div>
                  <span className="font-bold">
                    {feedbackBanner.isCorrect ? 'BENAR — ' : 'BELUM TEPAT — '}
                  </span>
                  <span>{feedbackBanner.message}</span>
                </div>
              </div>
            )}
          </form>
        </section>

        {/* Required 4 Interactive Action Buttons */}
        <section className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => setShowHint((v) => !v)}
            aria-expanded={showHint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-bold text-stone-800 transition-colors hover:border-[#7A1228] hover:text-[#7A1228] cursor-pointer whitespace-nowrap"
          >
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            LIHAT PETUNJUK
          </button>

          <button
            type="button"
            onClick={() => setShowExplanation((v) => !v)}
            aria-expanded={showExplanation}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#7A1228] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#5E0D1E] cursor-pointer whitespace-nowrap"
          >
            {showExplanation ? (
              <>
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
                TUTUP PEMBAHASAN
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
                BUKA PEMBAHASAN
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleTriggerAnimation}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#7A1228] bg-[#FDF5F6] px-4 py-2 text-xs font-bold text-[#7A1228] transition-colors hover:bg-[#FCE8EC] cursor-pointer whitespace-nowrap"
          >
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
            PUTAR ANIMASI PEMBUKTIAN
          </button>

          {showExplanation && (
            <button
              type="button"
              onClick={handleTriggerAnimation}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-bold text-stone-700 transition-colors hover:border-stone-500 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              ULANGI ANIMASI
            </button>
          )}
        </section>

        {/* Hint Drawer */}
        {showHint && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-stone-800">
            <span className="font-bold text-amber-900">Petunjuk Penyelesaian: </span>
            {question.hint}
          </div>
        )}

        {/* Full Interactive A–J Textbook Explanation & Physics Proof Animation */}
        {showExplanation && (
          <section
            data-testid="question-explanation-panel"
            className="space-y-6 border-t border-stone-200 pt-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[#7A1228] uppercase tracking-wider">
                  Pembahasan Mendalam Standar Buku Teks Olimpiade
                </p>
                <h4 className="text-lg font-extrabold text-stone-900">
                  Solusi Lengkap {question.code}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowExplanation(false)}
                className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-bold text-stone-700 hover:border-[#7A1228] hover:text-[#7A1228] cursor-pointer"
              >
                TUTUP PEMBAHASAN
              </button>
            </div>

            <NarratorControlBar
              narrator={narrator}
              sourceId={`explanation-${question.id}`}
              text={question.explanationNarration}
              label={`Narator Pembahasan Lengkap & FBD (${question.code})`}
            />

            {/* Mandatory Physics Proof Animation */}
            <div ref={animContainerRef}>
              <PhysicsProofAnimator
                config={question.simulationConfig}
                title={`Animasi Pembuktian Fisika — ${question.code}`}
                formulaOverlay={question.explanation.fPersamaan.highlightedFormula}
                autoPlaySignal={animPlaySignal}
              />
            </div>

            {/* Structured A–J Sections */}
            <div className="space-y-5 text-sm leading-relaxed text-stone-800">
              <div className="rounded-xl border border-stone-200 bg-white p-5">
                <h5 className="font-bold text-[#7A1228]">A. Memahami Permasalahan</h5>
                <p className="mt-1.5 text-stone-700">{question.explanation.aMemahami}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-stone-200 bg-white p-5">
                  <h5 className="font-bold text-[#7A1228]">B. Informasi yang Diketahui</h5>
                  <ul className="mt-2 space-y-1 font-mono text-xs sm:text-sm text-stone-700">
                    {question.explanation.bDiketahui.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-stone-200 bg-white p-5">
                  <h5 className="font-bold text-[#7A1228]">C. Besaran yang Ditanyakan</h5>
                  <p className="mt-2 font-medium text-stone-800">
                    {question.explanation.cDitanyakan}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-stone-200 bg-white p-5">
                <h5 className="font-bold text-[#7A1228]">D. Analisis Konsep Fisika</h5>
                <p className="mt-1.5 text-stone-700">{question.explanation.dAnalisisKonsep}</p>
              </div>

              <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-5">
                <h5 className="font-bold text-[#7A1228]">
                  E. Visualisasi dan Free Body Diagram (FBD)
                </h5>
                <p className="text-stone-700">{question.explanation.eFbdExplanation}</p>
                <FreeBodyDiagram
                  vectors={question.explanation.eFbdVectors}
                  bodyLabels={question.stimulus.labels}
                />
              </div>

              <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-5">
                <h5 className="font-bold text-[#7A1228]">F. Persamaan dan Penurunan Rumus</h5>
                <div className="rounded-xl border border-[#E8B4BF] bg-[#FDF5F6] px-4 py-3 font-mono text-sm font-bold text-[#7A1228] overflow-x-auto">
                  {question.explanation.fPersamaan.highlightedFormula}
                </div>
                <ol className="space-y-1.5 pt-1 font-serif text-stone-700">
                  {question.explanation.fPersamaan.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-mono text-xs font-bold text-stone-500 mt-1">
                        {i + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-xl border border-stone-200 bg-white p-5">
                <h5 className="font-bold text-[#7A1228]">G. Substitusi dan Perhitungan</h5>
                <ul className="mt-2 space-y-1.5 font-mono text-xs sm:text-sm text-stone-800 tabular-nums">
                  {question.explanation.gSubstitusi.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-[#7A1228] bg-[#FDF5F6] p-5">
                <h5 className="font-bold text-[#7A1228]">H. Jawaban Akhir</h5>
                <div className="mt-1.5 font-mono text-2xl font-extrabold text-stone-900 tabular-nums">
                  {formatIndonesianDecimal(question.expectedAnswer)} {question.unit}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-5">
                  <h5 className="font-bold text-stone-900">I. Intuisi Fisika</h5>
                  <p className="mt-1.5 text-stone-700">{question.explanation.iIntuisiFisika}</p>
                </div>

                <div className="rounded-xl border border-stone-200 bg-stone-50 p-5">
                  <h5 className="font-bold text-[#7A1228]">J. Trik Cepat Olimpiade</h5>
                  <p className="mt-1.5 text-stone-700">{question.explanation.jTrikCepat}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Prev / Next Question Footer */}
        <footer className="flex items-center justify-between border-t border-stone-200 pt-5">
          <button
            type="button"
            disabled={!prevQ}
            onClick={() => prevQ && onSelectQuestion(prevQ.id)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-bold text-stone-800 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#7A1228] cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Soal Sebelumnya
          </button>

          <button
            type="button"
            disabled={!nextQ}
            onClick={() => nextQ && onSelectQuestion(nextQ.id)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#7A1228] px-4 py-2 text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#5E0D1E] cursor-pointer"
          >
            Soal Berikutnya
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </footer>
      </article>
    </div>
  );
}
