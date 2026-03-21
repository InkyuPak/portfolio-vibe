import type { LocalizedText } from "@/lib/i18n";
import { joinLines, splitLines } from "@/lib/utils";

export function flattenLocalizedEntries(entries: LocalizedText[]) {
  return {
    ko: joinLines(entries.map((entry) => entry.ko)),
    en: joinLines(entries.map((entry) => entry.en)),
  };
}

export function pairLocalizedEntries(
  koreanValue: string,
  englishValue: string,
) {
  const koreanLines = splitLines(koreanValue);
  const englishLines = splitLines(englishValue);
  const length = Math.max(koreanLines.length, englishLines.length);

  return Array.from({ length }, (_, index) => ({
    ko: koreanLines[index] ?? "",
    en: englishLines[index] ?? "",
  })).filter((entry) => entry.ko.length > 0 || entry.en.length > 0);
}
