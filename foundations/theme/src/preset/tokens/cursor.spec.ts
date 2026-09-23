import { describe, expect, it } from "vitest";

import { cursor } from "#preset/tokens/cursor.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("cursor", () => {
  it.each(["button", "switch"])("sets the hand for %s", (name) => {
    expect(tokenAt(cursor, name)).toBe("pointer");
  });

  it.each(["checkbox", "radio", "menuitem", "option", "slider"])(
    "sets the arrow for %s",
    (name) => {
      expect(tokenAt(cursor, name)).toBe("default");
    },
  );

  it("sets not-allowed for a disabled control", () => {
    expect(tokenAt(cursor, "disabled")).toBe("not-allowed");
  });

  it("sets the I-beam for a box around a text field", () => {
    expect(tokenAt(cursor, "field")).toBe("text");
  });
});
