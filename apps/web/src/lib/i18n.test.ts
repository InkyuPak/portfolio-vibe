import { describe, expect, it } from "vitest";

import {
  detectLocaleFromPathname,
  localizePath,
  stripLocalePrefix,
  translateWithFallback,
} from "@/lib/i18n";

describe("i18n helpers", () => {
  it("localizes paths with /en prefix only for English", () => {
    expect(localizePath("/", "ko")).toBe("/");
    expect(localizePath("/", "en")).toBe("/en");
    expect(localizePath("/projects", "ko")).toBe("/projects");
    expect(localizePath("/projects", "en")).toBe("/en/projects");
  });

  it("detects locale from pathname and strips prefix", () => {
    expect(detectLocaleFromPathname("/")).toBe("ko");
    expect(detectLocaleFromPathname("/en/projects")).toBe("en");
    expect(stripLocalePrefix("/en/projects/test")).toBe("/projects/test");
  });

  it("falls back to Korean text when English is missing", () => {
    expect(translateWithFallback({ ko: "안녕하세요", en: "" }, "en")).toBe(
      "안녕하세요",
    );
  });
});
