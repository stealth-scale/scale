import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Description } from "#popover/description.tsx";
import { opened } from "#popover/popover.fixtures.tsx";

describe("Description", () => {
  it("renders a p", async () => {
    const { container } = await drawn(opened(<Description />));

    expect(slotElement(container, "popover", "description").tagName).toBe("P");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(opened(<Description />));

    expect(slotElement(container, "popover", "description").className).toContain(
      "popover__description",
    );
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<Description as="span" />));

    expect(slotElement(container, "popover", "description").tagName).toBe("SPAN");
  });
});
