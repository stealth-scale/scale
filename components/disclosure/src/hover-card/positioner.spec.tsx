import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#hover-card/hover-card.fixtures.tsx";
import { Content, Positioner, Root } from "#hover-card/index.ts";

describe("Positioner", () => {
  it("renders a div", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "hover-card", "positioner").tagName).toBe("DIV");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "hover-card", "positioner").className).toContain(
      "hover-card__positioner",
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

    expect(slotElement(container, "hover-card", "positioner").tagName).toBe("SPAN");
  });

  it("renders nothing before the card first opens", async () => {
    const { container } = await drawn(composed());

    expect(container.querySelector(".hover-card__positioner")).toBeNull();
  });

  it("renders the closed panel with lazyMount false", async () => {
    const { container } = await drawn(composed({ lazyMount: false }));

    expect(slotElement(container, "hover-card", "positioner").tagName).toBe("DIV");
  });
});
