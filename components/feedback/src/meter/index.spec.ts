import { describe, expect, it } from "vitest";

import * as barrel from "#meter/index.ts";
import * as bar from "#progress/index.ts";

describe("index", () => {
  it("exports the seven parts and no other runtime name", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Label",
      "Marker",
      "Range",
      "Root",
      "Segment",
      "Track",
      "ValueText",
    ]);
  });

  it("exports the progress bar's parts beside a root of its own", () => {
    expect([
      barrel.Label,
      barrel.Marker,
      barrel.Range,
      barrel.Segment,
      barrel.Track,
      barrel.ValueText,
    ]).toStrictEqual([bar.Label, bar.Marker, bar.Range, bar.Segment, bar.Track, bar.ValueText]);
  });

  it("exports a root that is not the progress bar's", () => {
    expect(barrel.Root).not.toBe(bar.Root);
  });
});
