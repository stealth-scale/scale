import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Sun } from "#chrome/sun.tsx";

describe("Sun", () => {
  it("draws a picture", () => {
    const { container } = render(<Sun />);

    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("hides the picture from a screen reader", () => {
    const { container } = render(<Sun />);

    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });
});
