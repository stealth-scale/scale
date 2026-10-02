import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Description } from "#drawer/description.tsx";
import { opened } from "#drawer/drawer.fixtures.tsx";

describe("Description", () => {
  it("renders a p", async () => {
    const { container } = await drawn(opened(<Description />));

    expect(slotElement(container, "drawer", "description").tagName).toBe("P");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(opened(<Description />));

    expect(slotElement(container, "drawer", "description").className).toContain(
      "drawer__description",
    );
  });

  it("sets the id the machine derives from the root's id", async () => {
    const { container } = await drawn(opened(<Description />, { id: "filters" }));

    expect(slotElement(container, "drawer", "description").id).toBe("dialog:filters:description");
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<Description as="span" />));

    expect(slotElement(container, "drawer", "description").tagName).toBe("SPAN");
  });
});
