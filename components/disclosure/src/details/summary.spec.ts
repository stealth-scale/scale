import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { detailed } from "#details/details.fixtures.tsx";

describe("Summary", () => {
  it("renders a summary with the details' summary class", () => {
    const { container } = render(detailed());

    expect(slotElement(container, "details", "summary").tagName).toBe("SUMMARY");
  });

  it("renders as the first child of the root", () => {
    const { container } = render(detailed());

    expect(slotElement(container, "details", "root").firstElementChild).toBe(
      slotElement(container, "details", "summary"),
    );
  });
});
