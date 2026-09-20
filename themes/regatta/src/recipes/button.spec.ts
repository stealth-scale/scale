import { describe, expect, it } from "vitest";

import { button } from "#recipes/button.ts";

describe("button", () => {
  it("sets every label in capitals and names no class or slot", () => {
    expect(button).toStrictEqual({ base: { textTransform: "uppercase" } });
  });
});
