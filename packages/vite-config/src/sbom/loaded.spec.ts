import { describe, expect, it } from "vitest";

import { loaded } from "#sbom/loaded.ts";

describe("loaded", () => {
  it("resolves to the module exporting sbom", async () => {
    const held = await loaded();

    expect(held.sbom).toBeTypeOf("function");
    expect(held.sbom().name).toBe("stealth:sbom");
  });
});
