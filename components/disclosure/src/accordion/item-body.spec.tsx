import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { itemed } from "#accordion/accordion.fixtures.tsx";
import { ItemBody } from "#accordion/item-body.ts";

describe("ItemBody", () => {
  it("renders a div with the item body class", async () => {
    const { container } = await drawn(itemed(<ItemBody>The answer</ItemBody>));

    expect(slotElement(container, "accordion", "itemBody").tagName).toBe("DIV");
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(itemed(<ItemBody as="section">The answer</ItemBody>));

    expect(slotElement(container, "accordion", "itemBody").tagName).toBe("SECTION");
  });
});
