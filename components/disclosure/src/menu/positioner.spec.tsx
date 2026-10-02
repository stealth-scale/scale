import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Content, Positioner, Root } from "#menu/index.ts";
import { composed } from "#menu/menu.fixtures.tsx";

describe("Positioner", () => {
  it("renders a div", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "menu", "positioner").tagName).toBe("DIV");
  });

  it("takes the machine's absolute position", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(slotElement(container, "menu", "positioner").style.position).toBe("absolute");
  });

  it("contains the content", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(
      slotElement(container, "menu", "positioner").querySelector(
        "[data-scope=menu][data-part=content]",
      ),
    ).not.toBeNull();
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(
      <Root defaultOpen>
        <Positioner as="span">
          <Content />
        </Positioner>
      </Root>,
    );

    expect(slotElement(container, "menu", "positioner").tagName).toBe("SPAN");
  });

  it("renders nothing while closed", async () => {
    const { container } = await drawn(composed());

    expect(container.querySelector(".menu__positioner")).toBeNull();
  });
});
