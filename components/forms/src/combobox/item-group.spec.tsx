import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { accounts, opened, picked, rowsOf } from "#combobox/combobox.fixtures.tsx";
import { ItemGroupLabel } from "#combobox/item-group-label.tsx";
import { ItemGroup } from "#combobox/item-group.tsx";

describe("ItemGroup", () => {
  it("renders a div with role group named by its label", async () => {
    await drawn(
      picked(
        {},
        {
          rows: (
            <ItemGroup id="settlements">
              <ItemGroupLabel htmlFor="settlements">Settlements</ItemGroupLabel>
              {rowsOf(accounts().items)}
            </ItemGroup>
          ),
        },
      ),
    );
    await opened();

    expect(screen.getByRole("group", { name: "Settlements" }).tagName).toBe("DIV");
  });
});
