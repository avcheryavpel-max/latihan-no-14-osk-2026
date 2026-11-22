export interface AnswerCheckResult {
  valid: boolean;
  isCorrect: boolean;
  parsedValue: number | null;
  normalizedInput: string;
  message: string;
}

/**
 * Parse a student's numeric short answer.
 * - Ignores leading/trailing and internal spaces around minus sign.
 * - Accepts Indonesian comma decimal separator (e.g. "14,4") as well as dot ("14.4")
 *   since differences in decimal punctuation that don't change mathematical value should be accepted.
 * - Rejects empty strings, multiple separators, or non-numeric characters.
 */
export function parseStudentNumericAnswer(raw: string): number | null {
  const cleaned = raw
    .trim()
    .replace(/\u2212/g, '-') // unicode minus
    .replace(/\s+/g, '');

  if (!cleaned) return null;

  // Match optional sign, digits, optional single decimal separator (. or ,) and digits
  // Also allow ",5" or "-,5" -> handled cleanly
  const validFormat = /^[+-]?(\d+([.,]\d+)?|[.,]\d+)$/;
  if (!validFormat.test(cleaned)) {
    return null;
  }

  const normalized = cleaned.replace(',', '.');
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return parsed;
}

/**
 * Standard mathematical rounding to 1 decimal place (half away from zero).
 */
export function roundToOneDecimal(value: number): number {
  const sign = value < 0 ? -1 : 1;
  return (sign * Math.round(Math.abs(value) * 10 + 1e-12)) / 10;
}

/**
 * Format number with Indonesian comma decimal separator and 1 decimal digit.
 */
export function formatIndonesianDecimal(value: number): string {
  const rounded = roundToOneDecimal(value);
  // Avoid "-0,0"
  const safe = Object.is(rounded, -0) || Math.abs(rounded) < 1e-9 ? 0 : rounded;
  return safe.toFixed(1).replace('.', ',');
}

/**
 * Evaluate a student's numeric answer against the exact verified 1-decimal key.
 * Rejects approximate answers that differ mathematically from the exact rounded answer.
 */
export function evaluateNumericAnswer(
  rawInput: string,
  expectedAnswer: number
): AnswerCheckResult {
  const parsed = parseStudentNumericAnswer(rawInput);

  if (parsed === null) {
    return {
      valid: false,
      isCorrect: false,
      parsedValue: null,
      normalizedInput: rawInput.trim(),
      message:
        'Masukkan angka numerik yang valid dengan tanda koma sebagai pemisah desimal (contoh: 14,4).',
    };
  }

  const expectedRounded = roundToOneDecimal(expectedAnswer);
  // Exact match check (ignoring trailing zero differences like 8 vs 8,0 or 14,40)
  const isCorrect = Math.abs(parsed - expectedRounded) < 1e-6;

  return {
    valid: true,
    isCorrect,
    parsedValue: parsed,
    normalizedInput: formatIndonesianDecimal(parsed),
    message: isCorrect
      ? `Tepat! Jawaban Anda (${formatIndonesianDecimal(parsed)}) sesuai dengan perhitungan fisika.`
      : `Belum tepat. Nilai ${formatIndonesianDecimal(parsed)} belum sesuai hukum kekekalan momentum dan energi pada sistem ini. Pelajari petunjuk atau buka pembahasan A–J.`,
  };
}
