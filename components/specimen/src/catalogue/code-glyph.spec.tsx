import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CodeGlyph } from "#catalogue/code-glyph.tsx";

describe("CodeGlyph", () => {
  it("draws a picture", () => {
    const { container } = render(<CodeGlyph />);

    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("hides the picture from a screen reader", () => {
    const { container } = render(<CodeGlyph />);

    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });
});
