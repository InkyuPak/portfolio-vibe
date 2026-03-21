"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { detectLocaleFromPathname, locales, localizePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LocaleToggleProps {
  tone?: "light" | "dark";
}

export function LocaleToggle({
  tone = "light",
}: LocaleToggleProps) {
  const pathname = usePathname();
  const currentLocale = detectLocaleFromPathname(pathname);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border p-1 text-xs font-medium",
        tone === "dark"
          ? "border-white/12 bg-[#10161d] text-white/60"
          : "border-black/10 bg-white/70 text-black/45 backdrop-blur",
      )}
      aria-label="Language switcher"
    >
      {locales.map((locale) => {
        const href = localizePath(pathname, locale);

        return (
          <Link
            key={locale}
            href={href}
            className={cn(
              "min-w-[3rem] rounded-full px-3 py-1.5 text-center text-[11px] tracking-[0.18em] uppercase transition-colors",
              currentLocale === locale
                ? tone === "dark"
                  ? "bg-[#8b5cf6] text-white"
                  : "bg-black text-white"
                : tone === "dark"
                  ? "text-white/40 hover:text-white/70"
                  : "hover:bg-black/5 hover:text-black/70",
            )}
          >
            {locale}
          </Link>
        );
      })}
    </div>
  );
}
