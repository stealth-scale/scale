import { describe, expect, it } from "vitest";

import { layers } from "#layers.ts";

describe("layers", () => {
  it("states one layer for a package that holds specimens", () => {
    expect(layers()).toHaveLength(1);
  });

  it("names every layer under this package", () => {
    expect(layers().every((layer) => layer.name.startsWith("specimen."))).toBe(true);
  });

  it("stops counting the specimens towards the package's coverage", () => {
    expect(layers()[0]?.name).toBe("specimen.uncounted(**/*.specimen.tsx)");
  });

  it("stops counting the files a package names instead", () => {
    expect(layers(["src/pages/**/*.specimen.tsx"]).map((layer) => layer.name)).toStrictEqual([
      "specimen.uncounted(src/pages/**/*.specimen.tsx)",
    ]);
  });
});
