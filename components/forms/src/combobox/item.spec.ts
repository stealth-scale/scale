import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";

import { input, opened, picked } from "#combobox/combobox.fixtures.tsx";

describe("Item", () => {
  it("renders a div with role option", async () => {
    await drawn(picked());
    await opened();

    expect(screen.getByRole("option", { name: "Bridge Ledger" }).tagName).toBe("DIV");
  });

  it("sets aria-selected on the row of the value", async () => {
    await drawn(picked({ defaultValue: ["halden"] }));
    await opened();

    expect(screen.getByRole("option", { name: "Halden & Co" }).getAttribute("aria-selected")).toBe(
      "true",
    );
  });

  it("sets aria-disabled on the row of a disabled item", async () => {
    await drawn(picked());
    await opened();

    expect(
      screen.getByRole("option", { name: "Voss Holdings" }).getAttribute("aria-disabled"),
    ).toBe("true");
  });

  it("picks its item when pressed", async () => {
    await drawn(picked());
    await opened();
    await pressed(screen.getByRole("option", { name: "Bridge Ledger" }));
    await settled();

    expect(input().value).toBe("Bridge Ledger");
  });
});
