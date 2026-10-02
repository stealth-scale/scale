import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { namesOf, useShared } from "#color-picker/state.ts";
import { namesOf as shared } from "#naming.ts";

describe("state", () => {
  it("throws with the color picker's name for a part outside a root", () => {
    expect(() => renderHook(() => useShared())).toThrow(
      "A part of ColorPicker was drawn outside the root that holds it together.",
    );
  });

  it("shares the names through the forms package's namesOf", () => {
    expect(namesOf).toBe(shared);
  });
});
