import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { quality } from "#pack/quality.ts";

function checked(): {
  attw: { excludeEntrypoints: RegExp[]; profile: string };
  publint: boolean;
} {
  return (quality().config as UserConfig).pack as {
    attw: { excludeEntrypoints: RegExp[]; profile: string };
    publint: boolean;
  };
}

describe("quality", () => {
  it("turns on both manifest checks", () => {
    expect(checked().attw).toBeTruthy();
    expect(checked().publint).toBe(true);
  });

  it("checks the published types in the ES module resolution modes alone", () => {
    expect(checked().attw.profile).toBe("esm-only");
  });

  it("stops the type checker resolving a stylesheet", () => {
    expect(checked().attw.excludeEntrypoints.some((one) => one.test("./dist/style.css"))).toBe(
      true,
    );
  });

  it("leaves a module to the type checker", () => {
    expect(checked().attw.excludeEntrypoints.some((one) => one.test("./dist/index.js"))).toBe(
      false,
    );
  });

  it("names the layer so a repository can remove it", () => {
    expect(quality().name).toBe("pack.quality");
  });
});
