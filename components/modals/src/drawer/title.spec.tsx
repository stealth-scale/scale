import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { opened } from "#drawer/drawer.fixtures.tsx";
import { Title } from "#drawer/title.tsx";

describe("Title", () => {
  it("renders an h2", async () => {
    const { container } = await drawn(opened(<Title />));

    expect(slotElement(container, "drawer", "title").tagName).toBe("H2");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(opened(<Title />));

    expect(slotElement(container, "drawer", "title").className).toContain("drawer__title");
  });

  it("sets the id the machine derives from the root's id", async () => {
    const { container } = await drawn(opened(<Title />, { id: "filters" }));

    expect(slotElement(container, "drawer", "title").id).toBe("dialog:filters:title");
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<Title as="h3" />));

    expect(slotElement(container, "drawer", "title").tagName).toBe("H3");
  });
});
