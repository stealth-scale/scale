import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Copy } from "#catalogue/copy.tsx";

describe("Copy", () => {
  it("draws a picture", () => {
    const { container } = render(<Copy />);

    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("hides the picture from a screen reader", () => {
    const { container } = render(<Copy />);

    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });
});
