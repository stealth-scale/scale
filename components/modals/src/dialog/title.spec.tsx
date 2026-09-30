import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { opened } from "#dialog/dialog.fixtures.tsx";
import { Title } from "#dialog/title.tsx";

describe("Title", () => {
  it("renders an h2", async () => {
    const { container } = await drawn(opened(<Title />));

    expect(slotElement(container, "dialog", "title").tagName).toBe("H2");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(opened(<Title />));

    expect(slotElement(container, "dialog", "title").className).toContain("dialog__title");
  });

  it("sets the id the machine derives from the root's id", async () => {
    const { container } = await drawn(opened(<Title />, { id: "rename" }));

    expect(slotElement(container, "dialog", "title").id).toBe("dialog:rename:title");
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<Title as="h3" />));

    expect(slotElement(container, "dialog", "title").tagName).toBe("H3");
  });
});
