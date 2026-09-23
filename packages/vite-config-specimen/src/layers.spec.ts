import { describe, expect, it } from "vitest";

import { layers } from "#layers.ts";

describe("layers", () => {
  it("returns two layers for a package with specimens", () => {
    expect(layers()).toHaveLength(2);
  });

  it("prefixes every layer name with specimen.", () => {
    expect(layers().every((layer) => layer.name.startsWith("specimen."))).toBe(true);
  });

  it("excludes specimen files and example files from coverage", () => {
    expect(layers().map((layer) => layer.name)).toStrictEqual([
      "specimen.uncounted(**/*.specimen.tsx)",
      "specimen.example.uncounted(**/*.example.tsx)",
    ]);
  });

  it("excludes the specimen globs passed as files from coverage", () => {
    expect(layers(["src/pages/**/*.specimen.tsx"])[0]?.name).toBe(
      "specimen.uncounted(src/pages/**/*.specimen.tsx)",
    );
  });
});
