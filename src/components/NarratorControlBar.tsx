import { Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import type { SpeechNarratorControls } from '../hooks/useSpeechNarrator';

interface NarratorControlBarProps {
  narrator: SpeechNarratorControls;
  sourceId: string;
  text: string;
  label: string;
  compact?: boolean;
}

const SPEED_OPTIONS = [0.85, 1.0, 1.15, 1.3];

export function NarratorControlBar({
  narrator,
  sourceId,
  text,
  label,
  compact = false,
}: NarratorControlBarProps) {
  const isCurrent = narrator.activeSourceId === sourceId;
  const isPlaying = isCurrent && narrator.status === 'playing';
  const isPaused = isCurrent && narrator.status === 'paused';

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-stone-50/90 px-4 py-2.5 ${
        compact ? 'text-xs' : 'text-sm'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Volume2 className="h-4 w-4 shrink-0 text-[#7A1228]" aria-hidden="true" />
        <span className="font-semibold text-stone-800 truncate">{label}</span>
        {isPlaying && (
          <span className="text-xs font-medium text-[#7A1228] whitespace-nowrap">
            · Sedang membacakan
          </span>
        )}
        {isPaused && (
          <span className="text-xs font-medium text-stone-500 whitespace-nowrap">
            · Dijeda
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {!isPlaying && !isPaused && (
          <button
            type="button"
            onClick={() => narrator.play(text, sourceId)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#7A1228] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#5E0D1E] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
            PUTAR SUARA
          </button>
        )}

        {isPlaying && (
          <button
            type="button"
            onClick={narrator.pause}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#7A1228] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#5E0D1E] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Pause className="h-3.5 w-3.5" aria-hidden="true" />
            JEDA
          </button>
        )}

        {isPaused && (
          <button
            type="button"
            onClick={narrator.resume}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#7A1228] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#5E0D1E] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
            LANJUTKAN
          </button>
        )}

        <button
          type="button"
          onClick={() => narrator.play(text, sourceId)}
          aria-label={`Ulangi suara ${label}`}
          className="inline-flex items-center gap-1 rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:border-[#7A1228] hover:text-[#7A1228] whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          ULANGI
        </button>

        <div className="flex items-center gap-1 rounded-lg border border-stone-300 bg-white px-2 py-1">
          <label htmlFor={`rate-${sourceId}`} className="text-[11px] font-medium text-stone-500 whitespace-nowrap">
            Kecepatan
          </label>
          <select
            id={`rate-${sourceId}`}
            value={narrator.rate}
            onChange={(e) => narrator.setRate(Number(e.target.value))}
            className="bg-transparent text-xs font-semibold text-stone-800 tabular-nums focus:outline-none cursor-pointer"
          >
            {SPEED_OPTIONS.map((spd) => (
              <option key={spd} value={spd}>
                {spd.toFixed(2).replace('.', ',').replace(',00', ',0')}x
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={narrator.toggleMute}
          aria-label={narrator.muted ? 'Bunyikan suara' : 'Bisukan suara'}
          className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            narrator.muted
              ? 'border-[#7A1228] bg-[#FDF2F4] text-[#7A1228]'
              : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
          }`}
        >
          {narrator.muted ? (
            <>
              <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
              MUTE
            </>
          ) : (
            <>
              <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
              AKTIF
            </>
          )}
        </button>
      </div>
    </div>
  );
}
