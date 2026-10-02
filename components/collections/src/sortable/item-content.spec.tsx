import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import * as Sortable from "#sortable/index.ts";
import { STAGES } from "#sortable/sortable.fixtures.tsx";

describe("ItemContent", () => {
  it("renders a div with the recipe's item content class", () => {
    const { container } = render(
      <Sortable.Root items={STAGES}>
        <Sortable.ItemContent>Draft</Sortable.ItemContent>
      </Sortable.Root>,
    );

    expect(slotElement(container, "sortable", "itemContent").tagName).toBe("DIV");
  });
});
