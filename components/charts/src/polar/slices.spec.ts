import { describe, expect, it } from "vitest";

import { OTHER, slicesOf, valueOf } from "#polar/slices.ts";

/**
 * Lists four kinds of file by storage in use, smallest first.
 */
const KINDS = [
  { key: "documents", label: "Documents", value: 9.5 },
  { key: "archives", label: "Archives", value: 26 },
  { key: "video", label: "Video", value: 118 },
  { key: "images", label: "Images", value: 42 },
];

describe("slices", () => {
  it("names the key of the gathered slice", () => {
    expect(OTHER).toBe("other");
  });

  it("returns a slice's value", () => {
    expect(valueOf({ key: "video", value: 118 })).toBe(118);
  });

  it("counts a value that is not a finite number as zero", () => {
    expect(valueOf({ key: "video", value: Number.NaN })).toBe(0);
  });

  it("orders the slices largest first", () => {
    expect(slicesOf(KINDS).map((slice) => slice.key)).toStrictEqual([
      "video",
      "images",
      "archives",
      "documents",
    ]);
  });

  it("orders a slice whose value is not a finite number last", () => {
    expect(
      slicesOf([{ key: "lost", value: Number.NaN }, ...KINDS])
        .map((slice) => slice.key)
        .at(-1),
    ).toBe("lost");
  });

  it("keeps every slice when they fit within maxSlices", () => {
    expect(slicesOf(KINDS, 4)).toHaveLength(4);
  });

  it("gathers the slices past maxSlices into one", () => {
    expect(slicesOf(KINDS, 3).map((slice) => slice.key)).toStrictEqual(["video", "images", OTHER]);
  });

  it("sums the gathered slices into the value of the one they form", () => {
    expect(slicesOf(KINDS, 3).at(-1)?.value).toBe(35.5);
  });

  it("names the gathered slice Other unless stated", () => {
    expect(slicesOf(KINDS, 3).at(-1)?.label).toBe("Other");
  });

  it("names the gathered slice by otherLabel", () => {
    expect(slicesOf(KINDS, 3, "Everything else").at(-1)?.label).toBe("Everything else");
  });

  it("colors the gathered slice from the neutral palette", () => {
    expect(slicesOf(KINDS, 3).at(-1)?.color).toBe("neutral");
  });

  it("keeps every slice when maxSlices is under one", () => {
    expect(slicesOf(KINDS, 0)).toHaveLength(4);
  });
});
