import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Moon } from "#chrome/moon.tsx";

describe("Moon", () => {
  it("draws a picture", () => {
    const { container } = render(<Moon />);

    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("hides the picture from a screen reader", () => {
    const { container } = render(<Moon />);

    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });
});
