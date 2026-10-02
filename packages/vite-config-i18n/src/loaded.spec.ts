import { describe, expect, it } from "vitest";

import { loaded } from "#loaded.ts";

describe("loaded", () => {
  it("resolves to the plugin package exporting i18n", async () => {
    const held = await loaded();

    expect(held.i18n).toBeTypeOf("function");
  });
});
