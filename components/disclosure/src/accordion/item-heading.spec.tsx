import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { itemed } from "#accordion/accordion.fixtures.tsx";
import { ItemHeading } from "#accordion/item-heading.ts";
import { ItemTrigger } from "#accordion/item-trigger.tsx";

describe("ItemHeading", () => {
  it("renders an h3", async () => {
    await drawn(
      itemed(
        <ItemHeading>
          <ItemTrigger>Delivery</ItemTrigger>
        </ItemHeading>,
      ),
    );

    expect(screen.getByRole("heading", { level: 3, name: "Delivery" })).toBeTruthy();
  });

  it("renders the level as names", async () => {
    await drawn(
      itemed(
        <ItemHeading as="h2">
          <ItemTrigger>Delivery</ItemTrigger>
        </ItemHeading>,
      ),
    );

    expect(screen.getByRole("heading", { level: 2, name: "Delivery" })).toBeTruthy();
  });

  it("applies the item heading class", async () => {
    const { container } = await drawn(itemed(<ItemHeading />));

    expect(slotElement(container, "accordion", "itemHeading").tagName).toBe("H3");
  });
});
