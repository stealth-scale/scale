import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { scoped } from "#format/format.fixtures.tsx";
import { useFormatLocale } from "#format/locale.ts";

describe("useFormatLocale", () => {
  it("returns the stated locale over the locale in scope", () => {
    const { result } = renderHook(() => useFormatLocale("ja-JP"), {
      wrapper: ({ children }) => scoped("de-DE", children),
    });

    expect(result.current).toBe("ja-JP");
  });

  it("returns the locale in scope when none is stated", () => {
    const { result } = renderHook(() => useFormatLocale(), {
      wrapper: ({ children }) => scoped("de-DE", children),
    });

    expect(result.current).toBe("de-DE");
  });

  it("returns the runtime's default locale outside a provider", () => {
    const { result } = renderHook(() => useFormatLocale());

    expect(result.current).toBe(new Intl.NumberFormat().resolvedOptions().locale);
  });
});
