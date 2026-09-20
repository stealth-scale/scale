import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Panel } from "#chrome/panel.tsx";

describe("Panel", () => {
  it("draws a picture", () => {
    const { container } = render(<Panel open={false} />);

    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("hides the picture from a screen reader", () => {
    const { container } = render(<Panel open={false} />);

    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("draws the arrow that closes the navigation while it is open", () => {
    const { container } = render(<Panel open />);

    expect(container.querySelectorAll("path")).toHaveLength(2);
  });

  it("draws no arrow while the navigation is closed", () => {
    const { container } = render(<Panel open={false} />);

    expect(container.querySelectorAll("path")).toHaveLength(1);
  });
});
