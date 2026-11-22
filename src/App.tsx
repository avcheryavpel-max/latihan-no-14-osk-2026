import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AboutView } from './components/AboutView';
import { ConceptMapView } from './components/ConceptMapView';
import { EvaluationView } from './components/EvaluationView';
import { HomeView } from './components/HomeView';
import { PracticeView, type QuestionAttemptRecord } from './components/PracticeView';
import { TheoryView } from './components/TheoryView';
import { VisualizationGalleryView } from './components/VisualizationGalleryView';
import { PRACTICE_QUESTIONS } from './data/questionsBank';
import { useSpeechNarrator } from './hooks/useSpeechNarrator';
import { evaluateNumericAnswer } from './physics/answerEvaluator';

export type NavSection =
  | 'beranda'
  | 'peta-konsep'
  | 'belajar-teori'
  | 'galeri-visualisasi'
  | 'latihan-15'
  | 'evaluasi'
  | 'tentang';

const NAV_ITEMS: { id: NavSection; label: string }[] = [
  { id: 'beranda', label: 'BERANDA' },
  { id: 'peta-konsep', label: 'PETA KONSEP' },
  { id: 'belajar-teori', label: 'BELAJAR TEORI' },
  { id: 'galeri-visualisasi', label: 'GALERI VISUALISASI FISIKA' },
  { id: 'latihan-15', label: '15 SOAL LATIHAN' },
  { id: 'evaluasi', label: 'HASIL DAN EVALUASI' },
  { id: 'tentang', label: 'TENTANG PEMBELAJARAN' },
];

const STORAGE_KEY = 'osk2026_q14_attempts_v1';

function loadStoredAttempts(): Record<number, QuestionAttemptRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        return 'latihan-15';
      }
    }
    return 'beranda';
  });
  const [activeChapterId, setActiveChapterId] = useState<string>('bab-1');
  const [activeQuestionId, setActiveQuestionId] = useState<number>(1);
  const [openExplanationOnLoad, setOpenExplanationOnLoad] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<Record<number, QuestionAttemptRecord>>(
    loadStoredAttempts
  );

  const narrator = useSpeechNarrator();

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
    } catch {
      // Ignore storage quota errors
    }
  }, [attempts]);

  const navigateTo = (section: NavSection) => {
    narrator.stop();
    setActiveSection(section);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenChapter = (chapterId: string) => {
    setActiveChapterId(chapterId);
    navigateTo('belajar-teori');
  };

  const handleJumpToQuestion = (questionId: number, openExplanation: boolean) => {
    setActiveQuestionId(questionId);
    setOpenExplanationOnLoad(openExplanation);
    navigateTo('latihan-15');
  };

  const handleSubmitAnswer = (questionId: number, rawInput: string) => {
    const q = PRACTICE_QUESTIONS.find((item) => item.id === questionId);
    if (!q) {
      return { valid: false, isCorrect: false, message: 'Soal tidak ditemukan.' };
    }
    const result = evaluateNumericAnswer(rawInput, q.expectedAnswer);
    if (!result.valid) {
      return { valid: false, isCorrect: false, message: result.message };
    }

    setAttempts((prev) => {
      const existing = prev[questionId];
      return {
        ...prev,
        [questionId]: {
          questionId,
          rawInput,
          normalizedInput: result.normalizedInput,
          isCorrect: result.isCorrect,
          attemptsCount: (existing?.attemptsCount ?? 0) + 1,
        },
      };
    });

    return {
      valid: true,
      isCorrect: result.isCorrect,
      message: result.message,
    };
  };

  const handleResetProgress = () => {
    setAttempts({});
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const completedCount = Object.keys(attempts).length;
  const correctCount = Object.values(attempts).filter((a) => a.isCorrect).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F8] text-stone-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigateTo('beranda')}
            className="text-left text-base font-extrabold tracking-tight text-[#7A1228] whitespace-nowrap shrink-0 cursor-pointer"
          >
            OSK 2026 · MISTER JO
          </button>

          <nav aria-label="Navigasi Utama" className="hidden xl:flex items-center gap-5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateTo(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-2 text-xs font-bold tracking-wide transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'text-[#7A1228]'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-[#7A1228]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigateTo('latihan-15')}
              className="hidden sm:inline-flex items-center rounded-lg bg-[#7A1228] px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#5E0D1E] whitespace-nowrap shrink-0 cursor-pointer"
            >
              Latihan ({completedCount}/15)
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              aria-expanded={mobileMenuOpen}
              className="inline-flex xl:hidden items-center justify-center rounded-lg border border-stone-200 p-2 text-stone-700 hover:border-[#7A1228] hover:text-[#7A1228] cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Responsive Drawer for Tablet & Mobile */}
        {mobileMenuOpen && (
          <nav
            aria-label="Navigasi Seluler"
            className="border-t border-stone-200 bg-white px-4 py-3 xl:hidden"
          >
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigateTo(item.id)}
                    className={`rounded-lg px-3 py-2.5 text-left text-xs font-bold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#FDF5F6] text-[#7A1228]'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:py-10">
        {activeSection === 'beranda' && (
          <HomeView
            onStartLearn={() => navigateTo('belajar-teori')}
            onStartPractice={() => navigateTo('latihan-15')}
            onOpenConceptMap={() => navigateTo('peta-konsep')}
            completedCount={completedCount}
            correctCount={correctCount}
          />
        )}

        {activeSection === 'peta-konsep' && (
          <ConceptMapView onOpenChapter={handleOpenChapter} />
        )}

        {activeSection === 'belajar-teori' && (
          <TheoryView
            activeChapterId={activeChapterId}
            onSelectChapter={(id) => {
              narrator.stop();
              setActiveChapterId(id);
            }}
            onGoToPractice={() => navigateTo('latihan-15')}
            narrator={narrator}
          />
        )}

        {activeSection === 'galeri-visualisasi' && <VisualizationGalleryView />}

        {activeSection === 'latihan-15' && (
          <PracticeView
            activeQuestionId={activeQuestionId}
            onSelectQuestion={(id) => {
              narrator.stop();
              setActiveQuestionId(id);
            }}
            attempts={attempts}
            onSubmitAnswer={handleSubmitAnswer}
            openExplanationOnLoad={openExplanationOnLoad}
            onConsumeOpenExplanationFlag={() => setOpenExplanationOnLoad(false)}
            narrator={narrator}
            onGoToChapter={handleOpenChapter}
          />
        )}

        {activeSection === 'evaluasi' && (
          <EvaluationView
            attempts={attempts}
            onJumpToQuestion={handleJumpToQuestion}
            onJumpToChapter={handleOpenChapter}
            onResetProgress={handleResetProgress}
          />
        )}

        {activeSection === 'tentang' && (
          <AboutView
            onStartLearn={() => navigateTo('belajar-teori')}
            onStartPractice={() => navigateTo('latihan-15')}
          />
        )}
      </main>

      {/* Clean Editorial Footer */}
      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-xs text-stone-500 sm:px-6">
          <div>
            <span className="font-bold text-[#7A1228]">OLYMPIAD PHYSICS TRAINING</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>CITY LEVEL – OSK 2026</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>SPECIAL TRAINING: QUESTION NUMBER 14</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span className="font-semibold text-stone-700">TEACHER: MISTER JO</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigateTo('belajar-teori')}
              className="hover:text-[#7A1228] cursor-pointer"
            >
              Belajar Teori
            </button>
            <button
              type="button"
              onClick={() => navigateTo('latihan-15')}
              className="hover:text-[#7A1228] cursor-pointer"
            >
              15 Soal Latihan
            </button>
            <button
              type="button"
              onClick={() => navigateTo('evaluasi')}
              className="hover:text-[#7A1228] cursor-pointer"
            >
              Evaluasi
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
