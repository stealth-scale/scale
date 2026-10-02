import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { ItemGroupLabel } from "#select/item-group-label.tsx";
import { ItemGroup } from "#select/item-group.tsx";
import { accounts, opened, picked, rowsOf } from "#select/select.fixtures.tsx";

describe("ItemGroup", () => {
  it("renders a div with role group named by its label", async () => {
    await drawn(
      picked(
        {},
        {
          rows: (
            <ItemGroup id="settling">
              <ItemGroupLabel htmlFor="settling">Settling</ItemGroupLabel>
              {rowsOf(accounts().items)}
            </ItemGroup>
          ),
        },
      ),
    );
    await opened();

    expect(screen.getByRole("group", { name: "Settling" }).tagName).toBe("DIV");
  });
});
