import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { accounts, opened, picked, rowsOf } from "#combobox/combobox.fixtures.tsx";
import { ItemGroupLabel } from "#combobox/item-group-label.tsx";
import { ItemGroup } from "#combobox/item-group.tsx";

describe("ItemGroupLabel", () => {
  it("renders a span with role presentation", async () => {
    await drawn(
      picked(
        {},
        {
          rows: (
            <ItemGroup id="freight">
              <ItemGroupLabel htmlFor="freight">Freight</ItemGroupLabel>
              {rowsOf(accounts().items)}
            </ItemGroup>
          ),
        },
      ),
    );
    await opened();

    expect(screen.getByText("Freight").getAttribute("role")).toBe("presentation");
  });
});
