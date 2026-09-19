import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Cross } from "#catalogue/cross.tsx";

describe("Cross", () => {
  it("draws a picture", () => {
    const { container } = render(<Cross />);

    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("hides the picture from a screen reader", () => {
    const { container } = render(<Cross />);

    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });
});
