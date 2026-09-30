import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { opened, picked } from "#combobox/combobox.fixtures.tsx";

describe("ItemText", () => {
  it("renders a span with the row's words", async () => {
    await drawn(picked());
    await opened();

    expect(
      slotElement(screen.getByRole("option", { name: "Bridge Ledger" }), "combobox", "itemText")
        .tagName,
    ).toBe("SPAN");
  });

  it("sets data-state to checked on the selected row", async () => {
    await drawn(picked({ defaultValue: ["bridge"] }));
    await opened();

    expect(
      slotElement(screen.getByRole("option", { name: "Bridge Ledger" }), "combobox", "itemText")
        .dataset["state"],
    ).toBe("checked");
  });
});
