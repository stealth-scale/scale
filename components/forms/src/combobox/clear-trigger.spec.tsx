import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ClearTrigger } from "#combobox/clear-trigger.tsx";
import { accounts, framed, hiddenOf, input, picked } from "#combobox/combobox.fixtures.tsx";
import { Control } from "#combobox/control.tsx";
import { Input } from "#combobox/input.tsx";
import { Root } from "#combobox/root.tsx";

describe("ClearTrigger", () => {
  it("is hidden while nothing is selected", async () => {
    const { container } = await drawn(picked());

    expect(slotElement(container, "combobox", "clearTrigger").hidden).toBe(true);
  });

  it("shows while a value is selected", async () => {
    const { container } = await drawn(picked({ defaultValue: ["bridge"] }));

    expect(slotElement(container, "combobox", "clearTrigger").hidden).toBe(false);
  });

  it("is named Clear value by default", async () => {
    await drawn(picked({ defaultValue: ["bridge"] }));

    expect(screen.getByRole("button", { name: "Clear value" })).toBeDefined();
  });

  it("is named by label", async () => {
    await drawn(
      <Root collection={accounts()} defaultValue={["bridge"]}>
        <Control>
          <Input aria-label="Account" />
          <ClearTrigger label="Clear the account" />
        </Control>
      </Root>,
    );

    expect(screen.getByRole("button", { name: "Clear the account" })).toBeDefined();
  });

  it("leaves the button out of the tab order", async () => {
    await drawn(picked({ defaultValue: ["bridge"] }));

    expect(screen.getByRole("button", { name: "Clear value" }).tabIndex).toBe(-1);
  });

  it("clears the value when pressed", async () => {
    const { container } = await drawn(picked({ defaultValue: ["bridge"] }));

    await pressed(screen.getByRole("button", { name: "Clear value" }));
    await settled();

    expect(hiddenOf(container).value).toBe("");
  });

  it("clears the text when pressed", async () => {
    await drawn(picked({ defaultValue: ["bridge"] }));
    await pressed(screen.getByRole("button", { name: "Clear value" }));
    await settled();
    await framed();

    expect(input().value).toBe("");
  });
});
