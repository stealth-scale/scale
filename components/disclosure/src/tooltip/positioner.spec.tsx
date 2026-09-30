import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#tooltip/content.tsx";
import { Positioner } from "#tooltip/positioner.tsx";
import { Root } from "#tooltip/root.tsx";
import { composed } from "#tooltip/tooltip.fixtures.tsx";

describe("Positioner", () => {
  it("renders a div", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "tooltip", "positioner").tagName).toBe("DIV");
  });

  it("takes the machine's absolute position", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "tooltip", "positioner").style.position).toBe("absolute");
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(
      <Root defaultOpen>
        <Positioner as="span">
          <Content>Saves</Content>
        </Positioner>
      </Root>,
    );

    expect(slotElement(container, "tooltip", "positioner").tagName).toBe("SPAN");
  });

  it("renders nothing before the tooltip first opens", async () => {
    const { container } = await drawn(composed());

    expect(container.querySelector(".tooltip__positioner")).toBeNull();
  });
});
