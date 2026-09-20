import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Chevron } from "#chrome/chevron.tsx";

describe("Chevron", () => {
  it("draws a picture", () => {
    const { container } = render(<Chevron />);

    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("hides the picture from a screen reader", () => {
    const { container } = render(<Chevron />);

    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });
});
