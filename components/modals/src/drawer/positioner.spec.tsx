import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#drawer/drawer.fixtures.tsx";
import { Content, Positioner, Root } from "#drawer/index.ts";

describe("Positioner", () => {
  it("renders a div", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "drawer", "positioner").tagName).toBe("DIV");
  });

  it("applies the class of the root's placement", async () => {
    const { container } = await drawn(composed({ defaultOpen: true, placement: "bottom" }));

    expect(slotElement(container, "drawer", "positioner").className).toContain(
      "drawer__positioner--bottom",
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

    expect(slotElement(container, "drawer", "positioner").tagName).toBe("SPAN");
  });

  it("renders nothing before the drawer first opens", async () => {
    const { container } = await drawn(composed());

    expect(container.querySelector(".drawer__positioner")).toBeNull();
  });

  it("renders the closed panel with lazyMount false", async () => {
    const { container } = await drawn(composed({ lazyMount: false }));

    expect(slotElement(container, "drawer", "positioner").tagName).toBe("DIV");
  });
});
