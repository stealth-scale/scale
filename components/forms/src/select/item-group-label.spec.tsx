import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { ItemGroupLabel } from "#select/item-group-label.tsx";
import { ItemGroup } from "#select/item-group.tsx";
import { accounts, opened, picked, rowsOf } from "#select/select.fixtures.tsx";

/**
 * Renders the accounts in one group labelled Settling, and opens the panel.
 */
async function grouped(): Promise<void> {
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
}

describe("ItemGroupLabel", () => {
  it("renders a span with role presentation", async () => {
    await grouped();

    expect(screen.getByText("Settling").getAttribute("role")).toBe("presentation");
  });

  it("takes the ID its group's aria-labelledby names", async () => {
    await grouped();

    expect(screen.getByRole("group").getAttribute("aria-labelledby")).toBe(
      screen.getByText("Settling").id,
    );
  });
});
