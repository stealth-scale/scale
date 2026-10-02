import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { opened } from "#popover/popover.fixtures.tsx";
import { Title } from "#popover/title.tsx";

describe("Title", () => {
  it("renders an h2", async () => {
    const { container } = await drawn(opened(<Title />));

    expect(slotElement(container, "popover", "title").tagName).toBe("H2");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(opened(<Title />));

    expect(slotElement(container, "popover", "title").className).toContain("popover__title");
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<Title as="h3" />));

    expect(slotElement(container, "popover", "title").tagName).toBe("H3");
  });
});
