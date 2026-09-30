import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Description } from "#dialog/description.tsx";
import { opened } from "#dialog/dialog.fixtures.tsx";

describe("Description", () => {
  it("renders a p", async () => {
    const { container } = await drawn(opened(<Description />));

    expect(slotElement(container, "dialog", "description").tagName).toBe("P");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(opened(<Description />));

    expect(slotElement(container, "dialog", "description").className).toContain(
      "dialog__description",
    );
  });

  it("sets the id the machine derives from the root's id", async () => {
    const { container } = await drawn(opened(<Description />, { id: "rename" }));

    expect(slotElement(container, "dialog", "description").id).toBe("dialog:rename:description");
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<Description as="span" />));

    expect(slotElement(container, "dialog", "description").tagName).toBe("SPAN");
  });
});
