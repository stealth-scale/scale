import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Body } from "#section/body.ts";
import { blocked } from "#section/section.fixtures.tsx";

describe("Body", () => {
  it("renders a div", () => {
    const { container } = render(blocked(<Body>The plan</Body>));

    expect(slotElement(container, "section", "body").tagName).toBe("DIV");
  });

  it("keeps data-bleed", () => {
    const { container } = render(blocked(<Body data-bleed="">A table</Body>));

    expect(slotElement(container, "section", "body").dataset["bleed"]).toBe("");
  });
});
