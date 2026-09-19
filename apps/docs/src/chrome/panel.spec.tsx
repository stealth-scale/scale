import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Panel } from "#chrome/panel.tsx";

describe("Panel", () => {
  it("draws a picture", () => {
    const { container } = render(<Panel />);

    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("hides the picture from a screen reader", () => {
    const { container } = render(<Panel />);

    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });
});
