import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { namesOf as shared } from "#naming.ts";
import { namesOf, useShared } from "#select/state.ts";

describe("state", () => {
  it("throws with the select's name for a part outside a root", () => {
    expect(() => renderHook(() => useShared())).toThrow(
      "A part of Select was drawn outside the root that holds it together.",
    );
  });

  it("shares the names through the forms package's namesOf", () => {
    expect(namesOf).toBe(shared);
  });
});
