import { describe, expect, it } from "vitest";

import { slugOf } from "#catalogue/slug.ts";

describe("slugOf", () => {
  it("lowers the case and joins the words with hyphens", () => {
    expect(slugOf("Looks and sizes")).toBe("looks-and-sizes");
  });

  it("turns a run of punctuation and space into one hyphen", () => {
    expect(slugOf("Date & time")).toBe("date-time");
  });

  it("keeps letters of any script", () => {
    expect(slugOf("Größe")).toBe("größe");
  });
});
