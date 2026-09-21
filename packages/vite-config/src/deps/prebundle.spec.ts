import { describe, expect, it } from "vitest";

import { prebundle } from "#deps/prebundle.ts";

describe("prebundle", () => {
  it("targets optimizeDeps.include", () => {
    for (const held of prebundle({ because: "why", deps: ["lodash-es"] })) {
      expect(held.at).toBe("optimizeDeps.include");
    }
  });

  it("returns one contribution per specifier named deps.prebundle(specifier)", () => {
    const held = prebundle({ because: "why", deps: ["one", "two"] });

    expect(held.map((each) => each.name)).toStrictEqual([
      "deps.prebundle(one)",
      "deps.prebundle(two)",
    ]);
  });

  it("sets item to the specifier including its deep subpath", () => {
    const [held] = prebundle({ because: "why", deps: ["@scope/pkg/deep/thing"] });

    expect(held?.item).toBe("@scope/pkg/deep/thing");
  });

  it("sets because to the reason it was given", () => {
    const [held] = prebundle({ because: "it is only imported dynamically", deps: ["one"] });

    expect(held?.because).toBe("it is only imported dynamically");
  });

  it("returns an empty array when deps is empty", () => {
    expect(prebundle({ because: "why", deps: [] })).toStrictEqual([]);
  });
});
