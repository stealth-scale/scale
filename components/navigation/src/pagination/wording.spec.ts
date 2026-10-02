import { describe, expect, it, vi } from "vitest";

import { type PageDetails, worded } from "#pagination/wording.ts";

/**
 * Details of page 12 of 24, with the items 111 to 120 of 235.
 */
const DETAILS: PageDetails = {
  count: 235,
  page: 12,
  pageRange: { end: 120, start: 110 },
  totalPages: 24,
};

describe("worded", () => {
  it.each([
    { format: "compact", want: "Page 12 of 24" },
    { format: "short", want: "12 / 24" },
    { format: "long", want: "111–120 of 235" },
  ] as const)("returns $want for $format", ({ format, want }) => {
    expect(worded(DETAILS, format)).toBe(want);
  });

  it.each([
    { format: "compact", want: "Page 0 of 0" },
    { format: "short", want: "0 / 0" },
    { format: "long", want: "0–0 of 0" },
  ] as const)("returns $want for $format when the count is zero", ({ format, want }) => {
    const empty = { count: 0, page: 1, pageRange: { end: 0, start: 0 }, totalPages: 0 };

    expect(worded(empty, format)).toBe(want);
  });

  it("returns the words a function format gives", () => {
    expect(worded(DETAILS, ({ page, totalPages }) => `Seite ${page} von ${totalPages}`)).toBe(
      "Seite 12 von 24",
    );
  });

  it("passes the four details alone to a function format", () => {
    const format = vi.fn<(details: PageDetails) => string>(() => "");
    const api = { ...DETAILS, pageSize: 10 };

    worded(api, format);

    expect(format).toHaveBeenCalledExactlyOnceWith(DETAILS);
  });
});
