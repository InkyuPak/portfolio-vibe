export const locales = ["ko", "en"] as const;

export type Locale = (typeof locales)[number];

export type LocalizedText = Record<Locale, string>;

export type SearchParamRecord = Record<string, string | string[] | undefined>;

export type SearchParamsLike = SearchParamRecord | Promise<SearchParamRecord>;

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "ko" || value === "en";
}

export function pickLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : "ko";
}

export function localePrefix(locale: Locale) {
  return locale === "en" ? "/en" : "";
}

export function detectLocaleFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ko";
}

export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/en") {
    return "/";
  }

  return pathname.startsWith("/en/") ? pathname.slice(3) : pathname;
}

export function localizePath(pathname: string, locale: Locale): string {
  const normalized = pathname === "" ? "/" : pathname;
  const barePath = stripLocalePrefix(normalized);

  if (locale === "ko") {
    return barePath;
  }

  return barePath === "/" ? "/en" : `/en${barePath}`;
}

export async function resolveLocale(
  searchParams?: SearchParamsLike,
): Promise<Locale> {
  if (!searchParams) {
    return "ko";
  }

  const resolved = await searchParams;
  const rawValue = resolved.lang;
  const lang = Array.isArray(rawValue) ? rawValue[0] : rawValue;

  return pickLocale(lang);
}

export function translate(text: LocalizedText, locale: Locale): string {
  return text[locale];
}

export function translateWithFallback(
  text: Partial<Record<Locale, string>>,
  locale: Locale,
): string {
  if (locale === "en" && text.en?.trim()) {
    return text.en;
  }

  return text.ko ?? "";
}

export function localizeHref(pathname: string, locale: Locale): string {
  const [path, rawQuery = ""] = pathname.split("?");
  const params = new URLSearchParams(rawQuery);
  params.set("lang", locale);

  const query = params.toString();

  return query ? `${path}?${query}` : path;
}
