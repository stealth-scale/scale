import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, parts, rootedViolations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ItemText } from "#menu/item-text.tsx";
import { Item } from "#menu/item.tsx";
import { grouped, listed } from "#menu/menu.fixtures.tsx";

describe("ItemText", () => {
  it("renders a span", async () => {
    const { container } = await drawn(
      listed(
        <Item value="rename">
          <ItemText>Rename</ItemText>
        </Item>,
      ),
    );

    expect(slotElement(container, "menu", "itemText").tagName).toBe("SPAN");
  });

  it("renders its text inside the row", async () => {
    await drawn(grouped({ defaultOpen: true }));

    expect(screen.getByRole("menuitemradio", { name: "Comfortable" }).textContent).toContain(
      "Comfortable",
    );
  });

  it("sets data-state checked on a checked row", async () => {
    const { container } = await drawn(grouped({ defaultOpen: true }));

    expect(parts(container, "item-text")[0]?.dataset["state"]).toBe("checked");
  });

  it("sets data-state unchecked on an unchecked row", async () => {
    const { container } = await drawn(grouped({ defaultOpen: true }));

    expect(parts(container, "item-text")[1]?.dataset["state"]).toBe("unchecked");
  });

  it("throws outside a row", () => {
    expect(rootedViolations({ ItemText }, "A part of Menu")).toStrictEqual([]);
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(
      listed(
        <Item value="rename">
          <ItemText as="strong">Rename</ItemText>
        </Item>,
      ),
    );

    expect(slotElement(container, "menu", "itemText").tagName).toBe("STRONG");
  });
});
