import { describe, expect, it } from "vitest";

import { loaded } from "#loaded.ts";

describe("loaded", () => {
  it("loads the specimen plugin package", async () => {
    const held = await loaded();

    expect(held.specimens).toBeTypeOf("function");
  });
});
