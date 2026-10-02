import { describe, expect, it } from "vitest";

import { EXAMPLES, uncapped, undescribed, unmeasured } from "#examples.ts";

describe("examples", () => {
  it("matches every .example.tsx file", () => {
    expect(EXAMPLES).toStrictEqual(["**/*.example.tsx"]);
  });

  it("excludes the example glob from coverage", () => {
    expect(unmeasured().map((layer) => [layer.at, layer.item])).toStrictEqual([
      ["test.coverage.exclude", "**/*.example.tsx"],
    ]);
  });

  it("names the coverage layer specimen.example.uncounted", () => {
    expect(unmeasured()[0]?.name).toBe("specimen.example.uncounted(**/*.example.tsx)");
  });

  it("excludes the globs passed as files from coverage", () => {
    expect(unmeasured(["src/**/*.example.tsx"])[0]?.item).toBe("src/**/*.example.tsx");
  });

  it("gives the coverage layer a non-empty reason", () => {
    expect(unmeasured().every((layer) => layer.because !== "")).toBe(true);
  });

  it("names the lint layer specimen.example.undocumented", () => {
    expect(undescribed().name).toBe("specimen.example.undocumented");
  });

  it("names the dependency layer specimen.example.composed", () => {
    expect(uncapped().name).toBe("specimen.example.composed");
  });

  it("turns import/max-dependencies off for the example glob", () => {
    const layer = uncapped();

    expect("item" in layer ? layer.item : undefined).toStrictEqual({
      files: ["**/*.example.tsx"],
      rules: { "import/max-dependencies": "off" },
    });
  });

  it("turns the dependency cap off for the globs passed as files", () => {
    const layer = uncapped(["src/**/*.example.tsx"]);

    expect("item" in layer ? layer.item : undefined).toMatchObject({
      files: ["src/**/*.example.tsx"],
    });
  });
});
