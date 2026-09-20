import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Check } from "#catalogue/check.tsx";

describe("Check", () => {
  it("draws a picture", () => {
    const { container } = render(<Check />);

    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("hides the picture from a screen reader", () => {
    const { container } = render(<Check />);

    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });
});
