// src/utils/similarityUtils.ts
import { distance } from "fastest-levenshtein";

// Strips punctuation while keeping letters and digits from EVERY script.
// The previous `[^a-z0-9 ]` erased all non-Latin text, so an Arabic bluff and
// an Arabic answer both normalized to "" \u2014 they compared equal, and the exact
// match guard in BluffSection refused every Arabic submission outright.
export function normalizeText(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Latin accents
    .replace(/[^\p{L}\p{N} ]/gu, "") // punctuation, any script
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function getSimilarityScore(a: string, b: string): number {
  const normA = normalizeText(a);
  const normB = normalizeText(b);

  if (normA.length === 0 || normB.length === 0) return 0;

  const dist = distance(normA, normB);
  const maxLength = Math.max(normA.length, normB.length);
  return 1 - dist / maxLength;
}

export function isBluffTooClose(
  bluff: string,
  answer: string,
  threshold = 0.75
): boolean {
  const normBluff = normalizeText(bluff);
  const normAnswer = normalizeText(answer);

  // Two strings that both normalize to empty (emoji-only, say) are not a match.
  if (!normBluff || !normAnswer) return false;
  if (normBluff === normAnswer) return true; // Exact match
  return getSimilarityScore(bluff, answer) > threshold;
}
