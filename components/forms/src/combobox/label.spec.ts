import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { input, opened, picked } from "#combobox/combobox.fixtures.tsx";

describe("Label", () => {
  it("renders a label", async () => {
    const { container } = await drawn(picked());

    expect(slotElement(container, "combobox", "label").tagName).toBe("LABEL");
  });

  it("points at the input", async () => {
    const { container } = await drawn(picked());

    expect(slotElement(container, "combobox", "label").getAttribute("for")).toBe(input().id);
  });

  it("names the input", async () => {
    await drawn(picked());

    expect(screen.getByRole("combobox", { name: "Account" })).toBe(input());
  });

  it("names the panel while it is mounted", async () => {
    await drawn(picked());
    await opened();

    expect(screen.getByRole("listbox").getAttribute("aria-labelledby")).toBe(
      screen.getByText("Account").id,
    );
  });
});
