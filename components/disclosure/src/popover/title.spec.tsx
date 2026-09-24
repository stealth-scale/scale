import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { opened } from "#popover/popover.fixtures.tsx";
import { Title } from "#popover/title.tsx";

describe("Title", () => {
  it("renders an h2", () => {
    const { container } = render(opened(<Title />));

    expect(slotElement(container, "popover", "title").tagName).toBe("H2");
  });

  it("applies its slot class", () => {
    const { container } = render(opened(<Title />));

    expect(slotElement(container, "popover", "title").className).toContain("popover__title");
  });

  it("renders the element as names", () => {
    const { container } = render(opened(<Title as="h3" />));

    expect(slotElement(container, "popover", "title").tagName).toBe("H3");
  });
});
