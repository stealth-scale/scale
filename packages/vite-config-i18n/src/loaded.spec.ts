import { describe, expect, it } from "vitest";

import { loaded } from "#loaded.ts";

describe("loaded", () => {
  it("loads the catalogue plugin package", async () => {
    const held = await loaded();

    expect(held.i18n).toBeTypeOf("function");
  });
});
