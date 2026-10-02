import { describe, expect, it } from "vitest";

import { attr, drawn, parts, rootedViolations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ItemIndicator } from "#menu/item-indicator.tsx";
import { Item } from "#menu/item.tsx";
import { grouped, listed } from "#menu/menu.fixtures.tsx";

describe("ItemIndicator", () => {
  it("renders a span", async () => {
    const { container } = await drawn(
      listed(
        <Item value="rename">
          <ItemIndicator>*</ItemIndicator>
        </Item>,
      ),
    );

    expect(slotElement(container, "menu", "itemIndicator").tagName).toBe("SPAN");
  });

  it("sets data-state checked on a checked row", async () => {
    const { container } = await drawn(grouped({ defaultOpen: true }));

    expect(parts(container, "item-indicator")[0]?.dataset["state"]).toBe("checked");
  });

  it("sets data-state unchecked on an unchecked row", async () => {
    const { container } = await drawn(grouped({ defaultOpen: true }));

    expect(parts(container, "item-indicator")[1]?.dataset["state"]).toBe("unchecked");
  });

  it("sets no data-state in a plain row", async () => {
    const { container } = await drawn(
      listed(
        <Item value="rename">
          <ItemIndicator>*</ItemIndicator>
        </Item>,
      ),
    );

    expect(attr(container, "item-indicator", "state")).toBeUndefined();
  });

  it("sets aria-hidden", async () => {
    const { container } = await drawn(
      listed(
        <Item value="rename">
          <ItemIndicator>*</ItemIndicator>
        </Item>,
      ),
    );

    expect(slotElement(container, "menu", "itemIndicator").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("throws outside a row", () => {
    expect(rootedViolations({ ItemIndicator }, "A part of Menu")).toStrictEqual([]);
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(
      listed(
        <Item value="rename">
          <ItemIndicator as="svg" />
        </Item>,
      ),
    );

    expect(slotElement(container, "menu", "itemIndicator").tagName).toBe("svg");
  });
});
