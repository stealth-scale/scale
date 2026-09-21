import { describe, expect, it } from "vitest";

import { loaded } from "#loaded.ts";

describe("loaded", () => {
  it("loads the theme plugin package", async () => {
    const held = await loaded();

    expect(held.theme.stylesheet).toBeTypeOf("function");
    expect(held.theme.runtime).toBeTypeOf("function");
  });
});
