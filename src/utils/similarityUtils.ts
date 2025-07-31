// src/utils/similarityUtils.ts
import { distance } from "fastest-levenshtein";

export function normalizeText(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9 ]/g, ""); // Remove punctuation
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

  if (normBluff === normAnswer) return true; // Exact match
  console.log(getSimilarityScore(bluff, answer));
  return getSimilarityScore(bluff, answer) > threshold;
}
