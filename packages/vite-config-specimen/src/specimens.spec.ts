import { describe, expect, it } from "vitest";

import { contribute } from "@stealthscale/vite-config-core";

import { renamed, SPECIMENS } from "#specimens.ts";

describe("SPECIMENS", () => {
  it("names any specimen file", () => {
    expect(SPECIMENS).toStrictEqual(["**/*.specimen.tsx"]);
  });
});

describe("renamed", () => {
  it("renames a contribution after this package and the call a consumer wrote", () => {
    const held = contribute({ at: "plugins", because: "a case", item: 1, name: "test.omit(x)" });

    expect(renamed(held, "test.omit", "specimen.uncounted").name).toBe("specimen.uncounted(x)");
  });

  it("keeps everything but the name", () => {
    const held = contribute({ at: "plugins", because: "a case", item: 1, name: "test.omit(x)" });

    expect(renamed(held, "test.omit", "specimen.uncounted")).toMatchObject({
      at: "plugins",
      because: "a case",
      item: 1,
    });
  });
});
