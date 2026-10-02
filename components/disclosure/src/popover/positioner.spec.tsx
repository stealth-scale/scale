import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Content, Positioner, Root } from "#popover/index.ts";
import { composed } from "#popover/popover.fixtures.tsx";

describe("Positioner", () => {
  it("renders a div", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "popover", "positioner").tagName).toBe("DIV");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "popover", "positioner").className).toContain(
      "popover__positioner",
    );
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(
      <Root defaultOpen>
        <Positioner as="span">
          <Content />
        </Positioner>
      </Root>,
    );

    expect(slotElement(container, "popover", "positioner").tagName).toBe("SPAN");
  });

  it("renders nothing before the popover first opens", async () => {
    const { container } = await drawn(composed());

    expect(container.querySelector(".popover__positioner")).toBeNull();
  });

  it("renders the closed panel with lazyMount false", async () => {
    const { container } = await drawn(composed({ lazyMount: false }));

    expect(slotElement(container, "popover", "positioner").tagName).toBe("DIV");
  });
});
