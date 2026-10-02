import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useFormScope } from "#form/scope.ts";

describe("useFormScope", () => {
  it("returns no glyph and no size outside a form", () => {
    const { result } = renderHook(() => useFormScope());

    expect(result.current).toStrictEqual({
      glyphs: {},
      headingLevel: 2,
      mark: "required",
      orientation: "vertical",
    });
  });
});
