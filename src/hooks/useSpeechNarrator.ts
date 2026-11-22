import { useCallback, useEffect, useRef, useState } from 'react';

export type NarratorStatus = 'idle' | 'playing' | 'paused';

export interface SpeechNarratorControls {
  status: NarratorStatus;
  activeSourceId: string | null;
  rate: number;
  muted: boolean;
  isSupported: boolean;
  play: (text: string, sourceId: string) => void;
  pause: () => void;
  resume: () => void;
  replay: () => void;
  stop: () => void;
  setRate: (newRate: number) => void;
  toggleMute: () => void;
}

function splitIntoChunks(text: string): string[] {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return [];
  const rawParts = normalized.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let buffer = '';
  for (const part of rawParts) {
    if ((buffer + ' ' + part).trim().length > 180 && buffer.length > 0) {
      chunks.push(buffer.trim());
      buffer = part;
    } else {
      buffer = buffer ? `${buffer} ${part}` : part;
    }
  }
  if (buffer.trim()) {
    chunks.push(buffer.trim());
  }
  return chunks;
}

export function useSpeechNarrator(): SpeechNarratorControls {
  const [status, setStatus] = useState<NarratorStatus>('idle');
  const [activeSourceId, setActiveSourceId] = useState<string | null>(null);
  const [rate, setRateState] = useState<number>(1.0);
  const [muted, setMuted] = useState<boolean>(false);

  const isSupported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance !== 'undefined';

  const currentTextRef = useRef<string>('');
  const currentSourceRef = useRef<string | null>(null);
  const chunksRef = useRef<string[]>([]);
  const chunkIdxRef = useRef<number>(0);
  const rateRef = useRef<number>(1.0);
  const mutedRef = useRef<boolean>(false);
  const sessionTokenRef = useRef<number>(0);
  const fallbackTimerRef = useRef<number | null>(null);

  const clearFallbackTimer = () => {
    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  };

  const pickIndonesianVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (!isSupported) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
    const exactId = voices.find((v) => v.lang.toLowerCase() === 'id-id');
    if (exactId) return exactId;
    const prefixId = voices.find((v) => v.lang.toLowerCase().startsWith('id'));
    if (prefixId) return prefixId;
    const indoName = voices.find((v) => v.name.toLowerCase().includes('indonesia'));
    return indoName ?? voices[0];
  }, [isSupported]);

  const stop = useCallback(() => {
    sessionTokenRef.current += 1;
    clearFallbackTimer();
    if (isSupported) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore browser cancel quirk
      }
    }
    setStatus('idle');
    setActiveSourceId(null);
  }, [isSupported]);

  const speakChunkAt = useCallback(
    (index: number, token: number) => {
      if (token !== sessionTokenRef.current) return;
      const chunks = chunksRef.current;
      if (index >= chunks.length) {
        setStatus('idle');
        setActiveSourceId(null);
        return;
      }

      chunkIdxRef.current = index;

      if (!isSupported) {
        // Graceful visual timer fallback if browser lacks Web Speech API
        const approxMs = Math.max(1500, (chunks[index].length * 55) / rateRef.current);
        fallbackTimerRef.current = window.setTimeout(() => {
          speakChunkAt(index + 1, token);
        }, approxMs);
        return;
      }

      const utterance = new window.SpeechSynthesisUtterance(chunks[index]);
      utterance.lang = 'id-ID';
      utterance.rate = rateRef.current;
      utterance.pitch = 1.0;
      utterance.volume = mutedRef.current ? 0 : 1;

      const voice = pickIndonesianVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        if (token === sessionTokenRef.current) {
          speakChunkAt(index + 1, token);
        }
      };

      utterance.onerror = () => {
        if (token === sessionTokenRef.current) {
          setStatus('idle');
        }
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch {
        setStatus('idle');
      }
    },
    [isSupported, pickIndonesianVoice]
  );

  const play = useCallback(
    (text: string, sourceId: string) => {
      stop();
      const chunks = splitIntoChunks(text);
      if (chunks.length === 0) return;

      currentTextRef.current = text;
      currentSourceRef.current = sourceId;
      chunksRef.current = chunks;
      chunkIdxRef.current = 0;

      const token = sessionTokenRef.current;
      setActiveSourceId(sourceId);
      setStatus('playing');
      speakChunkAt(0, token);
    },
    [speakChunkAt, stop]
  );

  const pause = useCallback(() => {
    if (status !== 'playing') return;
    if (isSupported) {
      try {
        window.speechSynthesis.pause();
      } catch {
        // Fallback: stop current utterance while remembering index
      }
    }
    clearFallbackTimer();
    setStatus('paused');
  }, [isSupported, status]);

  const resume = useCallback(() => {
    if (status !== 'paused') return;
    if (isSupported) {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
          setStatus('playing');
          return;
        }
      } catch {
        // Fallback below
      }
    }
    setStatus('playing');
    const token = ++sessionTokenRef.current;
    speakChunkAt(chunkIdxRef.current, token);
  }, [isSupported, speakChunkAt, status]);

  const replay = useCallback(() => {
    if (!currentTextRef.current || !currentSourceRef.current) return;
    play(currentTextRef.current, currentSourceRef.current);
  }, [play]);

  const setRate = useCallback(
    (newRate: number) => {
      rateRef.current = newRate;
      setRateState(newRate);
      if (status === 'playing' && currentTextRef.current && currentSourceRef.current) {
        const resumeIdx = chunkIdxRef.current;
        const token = ++sessionTokenRef.current;
        clearFallbackTimer();
        if (isSupported) {
          try {
            window.speechSynthesis.cancel();
          } catch {
            // ignore
          }
        }
        speakChunkAt(resumeIdx, token);
      }
    },
    [isSupported, speakChunkAt, status]
  );

  const toggleMute = useCallback(() => {
    const nextMuted = !mutedRef.current;
    mutedRef.current = nextMuted;
    setMuted(nextMuted);
    if (status === 'playing' && currentTextRef.current && currentSourceRef.current) {
      const resumeIdx = chunkIdxRef.current;
      const token = ++sessionTokenRef.current;
      clearFallbackTimer();
      if (isSupported) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // ignore
        }
      }
      speakChunkAt(resumeIdx, token);
    }
  }, [isSupported, speakChunkAt, status]);

  useEffect(() => {
    if (isSupported) {
      window.speechSynthesis.getVoices();
    }
    return () => {
      sessionTokenRef.current += 1;
      clearFallbackTimer();
      if (isSupported) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // ignore
        }
      }
    };
  }, [isSupported]);

  return {
    status,
    activeSourceId,
    rate,
    muted,
    isSupported,
    play,
    pause,
    resume,
    replay,
    stop,
    setRate,
    toggleMute,
  };
}
