import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Mark } from "#switcher/mark.ts";
import { held } from "#switcher/parts.fixtures.tsx";

describe("Mark", () => {
  it("renders a span inside the trigger", () => {
    const { container } = render(held(<Mark>A</Mark>));

    expect(slotElement(container, "switcher", "mark").tagName).toBe("SPAN");
  });

  it("defaults aria-hidden to true", () => {
    const { container } = render(held(<Mark>A</Mark>));

    expect(slotElement(container, "switcher", "mark").getAttribute("aria-hidden")).toBe("true");
  });
});
