import { describe, expect, it } from "vitest";

import { separatorOf } from "#chart/separator.ts";

describe("separatorOf", () => {
  it.each([
    { locale: "en-US", want: ", " },
    { locale: "de-DE", want: ", " },
    { locale: "ja-JP", want: "、" },
  ])("returns $want as the list separator of $locale", ({ locale, want }) => {
    expect(separatorOf(locale)).toBe(want);
  });
});
