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

  it("sets the move cursor for a part the pointer drags", () => {
    expect(tokenAt(cursor, "drag")).toBe("move");
  });

  it("sets the grabbing hand while the pointer drags a part", () => {
    expect(tokenAt(cursor, "dragging")).toBe("grabbing");
  });

  it("sets the open hand for a surface the pointer pans", () => {
    expect(tokenAt(cursor, "pan")).toBe("grab");
  });

  it("sets the crosshair for a port a connection is drawn from", () => {
    expect(tokenAt(cursor, "connect")).toBe("crosshair");
  });

  it("sets col-resize for a separator that changes a column's width", () => {
    expect(tokenAt(cursor, "resizeColumn")).toBe("col-resize");
  });
});
