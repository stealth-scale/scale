import { describe, expect, it } from "vitest";

import * as chordDiagram from "#chord-diagram/index.ts";

describe("index", () => {
  it("exports ChordDiagram and its layout", () => {
    expect(Object.keys(chordDiagram).toSorted()).toStrictEqual(["ChordDiagram", "chordLayout"]);
  });
});
