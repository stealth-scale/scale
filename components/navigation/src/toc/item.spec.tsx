import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Item } from "#toc/item.tsx";
import { List } from "#toc/list.tsx";
import { composed, railed } from "#toc/toc.fixtures.tsx";

describe("Item", () => {
  it("draws a list item inside the root it needs above it", async () => {
    const { container } = await drawn(
      railed(
        <List>
          <Item item={{ depth: 2, value: "sizes" }}>Sizes</Item>
        </List>,
      ),
    );

    expect(slotElement(container, "toc", "item").tagName).toBe("LI");
  });

  it("carries the depth of its heading for the recipe to indent by", async () => {
    const { container } = await drawn(
      railed(
        <List>
          <Item item={{ depth: 3, value: "large" }}>Large</Item>
        </List>,
      ),
    );
    const item = slotElement(container, "toc", "item");

    expect(item.dataset["depth"]).toBe("3");
    expect(item.style.getPropertyValue("--depth")).toBe("3");
  });

  it("says whether its heading is on screen", async () => {
    const { container } = await drawn(composed({ defaultActiveIds: ["large"] }));
    const items = container.querySelectorAll<HTMLElement>(".toc__item");

    expect([...items].map((item) => item.dataset["active"])).toStrictEqual([
      undefined,
      "",
      undefined,
    ]);
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(
      railed(
        <List>
          <Item as="div" item={{ depth: 2, value: "sizes" }}>
            Sizes
          </Item>
        </List>,
      ),
    );

    expect(slotElement(container, "toc", "item").tagName).toBe("DIV");
  });
});
