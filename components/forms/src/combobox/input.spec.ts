import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { hiddenOf, input, keyed, picked, typed } from "#combobox/combobox.fixtures.tsx";

describe("Input", () => {
  it("renders an input with role combobox", async () => {
    await drawn(picked());

    expect(input().tagName).toBe("INPUT");
  });

  it("is named by aria-label without a label", async () => {
    await drawn(picked({}, { labelled: false, named: "Account" }));

    expect(screen.getByRole("combobox", { name: "Account" })).toBe(input());
  });

  it("names the panel by its aria-label without a label", async () => {
    await drawn(picked({}, { labelled: false, named: "Account" }));
    await typed("a");

    expect(screen.getByRole("listbox", { name: "Account" })).toBeDefined();
  });

  it("leaves name to the hidden select", async () => {
    const { container } = await drawn(picked({ name: "account" }));

    expect(hiddenOf(container).name === "account" && !input().hasAttribute("name")).toBe(true);
  });

  it("reports required through aria-required", async () => {
    await drawn(picked({ required: true }));

    expect(input().getAttribute("aria-required")).toBe("true");
  });

  it("leaves required to the hidden select", async () => {
    await drawn(picked({ required: true }));

    expect(input().required).toBe(false);
  });

  it("carries name while custom values are allowed", async () => {
    await drawn(picked({ allowCustomValue: true, name: "account" }));

    expect(input().name).toBe("account");
  });

  it("carries required while custom values are allowed", async () => {
    await drawn(picked({ allowCustomValue: true, required: true }));

    expect(input().required).toBe(true);
  });

  it("opens the panel as a person types", async () => {
    await drawn(picked());
    await typed("ha");

    expect(input().getAttribute("aria-expanded")).toBe("true");
  });

  it("points aria-activedescendant at the first row on ArrowDown", async () => {
    await drawn(picked());
    await typed("b");
    await keyed("ArrowDown");

    expect(input().getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("option", { name: "Bridge Ledger" }).id,
    );
  });

  it("picks the highlighted row on Enter", async () => {
    await drawn(picked());
    await typed("b");
    await keyed("ArrowDown");
    await keyed("Enter");

    expect(input().value).toBe("Bridge Ledger");
  });

  it("restores the value's text on a second Escape", async () => {
    await drawn(picked({ defaultValue: ["halden"] }));
    await typed("Halx");
    await keyed("Escape");
    await keyed("Escape");

    expect(input().value).toBe("Halden & Co");
  });

  it("closes the panel on Escape", async () => {
    await drawn(picked());
    await typed("ha");
    await keyed("Escape");

    expect(input().getAttribute("aria-expanded")).toBe("false");
  });
});
