import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Content, Positioner, Root } from "#toggle-tip/index.ts";
import { composed } from "#toggle-tip/toggle-tip.fixtures.tsx";

describe("Positioner", () => {
  it("renders a div", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "toggle-tip", "positioner").tagName).toBe("DIV");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "toggle-tip", "positioner").className).toContain(
      "toggle-tip__positioner",
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

    expect(slotElement(container, "toggle-tip", "positioner").tagName).toBe("SPAN");
  });

  it("renders nothing before the note first opens", async () => {
    const { container } = await drawn(composed());

    expect(container.querySelector(".toggle-tip__positioner")).toBeNull();
  });

  it("renders the closed note with lazyMount false", async () => {
    const { container } = await drawn(composed({ lazyMount: false }));

    expect(slotElement(container, "toggle-tip", "positioner").tagName).toBe("DIV");
  });
});
