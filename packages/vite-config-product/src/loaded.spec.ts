import { describe, expect, it } from "vitest";

import { loaded } from "#loaded.ts";

describe("loaded", () => {
  it("resolves to the plugin package exporting product", async () => {
    const plugin = await loaded();

    expect(plugin.product).toBeTypeOf("function");
  });
});
