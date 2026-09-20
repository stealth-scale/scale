import { describe, expect, it } from "vitest";

import { button } from "#recipes/button.ts";

describe("button", () => {
  it("rounds every button to a pill and names no class or slot", () => {
    expect(button).toStrictEqual({ base: { borderRadius: "full" } });
  });
});
