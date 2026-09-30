import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Body } from "#section/body.tsx";
import { blocked } from "#section/section.fixtures.tsx";

describe("Body", () => {
  it("renders a div", () => {
    const { container } = render(blocked(<Body>The plan</Body>));

    expect(slotElement(container, "section", "body").tagName).toBe("DIV");
  });

  it("sets data-bleed when bleed is true", () => {
    const { container } = render(blocked(<Body bleed>A table</Body>));

    expect(slotElement(container, "section", "body").dataset["bleed"]).toBe("");
  });

  it("sets no data-bleed by default", () => {
    const { container } = render(blocked(<Body>The plan</Body>));

    expect(slotElement(container, "section", "body").dataset["bleed"]).toBeUndefined();
  });
});
