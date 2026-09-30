import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { opened, picked } from "#select/select.fixtures.tsx";

describe("ItemText", () => {
  it("renders a span", async () => {
    await drawn(picked());
    await opened();

    expect(
      slotElement(screen.getByRole("option", { name: "Halden & Co" }), "select", "itemText")
        .tagName,
    ).toBe("SPAN");
  });

  it("sets data-state to checked on the selected row's text", async () => {
    await drawn(picked({ defaultValue: ["halden"] }));
    await opened();

    expect(
      slotElement(screen.getByRole("option", { name: "Halden & Co" }), "select", "itemText")
        .dataset["state"],
    ).toBe("checked");
  });
});
