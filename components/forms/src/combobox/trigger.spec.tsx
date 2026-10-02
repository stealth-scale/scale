import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";

import { accounts, framed, input, opened, picked } from "#combobox/combobox.fixtures.tsx";
import { Control } from "#combobox/control.tsx";
import { Input } from "#combobox/input.tsx";
import { Root } from "#combobox/root.tsx";
import { Trigger } from "#combobox/trigger.tsx";

describe("Trigger", () => {
  it("renders a button", async () => {
    await drawn(picked());

    expect(screen.getByRole("button", { name: "Toggle suggestions" }).tagName).toBe("BUTTON");
  });

  it("is named by label", async () => {
    await drawn(
      <Root collection={accounts()}>
        <Control>
          <Input aria-label="Account" />
          <Trigger label="Show accounts" />
        </Control>
      </Root>,
    );

    expect(screen.getByRole("button", { name: "Show accounts" })).toBeDefined();
  });

  it("leaves the button out of the tab order", async () => {
    await drawn(picked());

    expect(screen.getByRole("button", { name: "Toggle suggestions" }).tabIndex).toBe(-1);
  });

  it("opens the panel when pressed", async () => {
    await drawn(picked());
    await opened();

    expect(input().getAttribute("aria-expanded")).toBe("true");
  });

  it("closes the open panel when pressed", async () => {
    await drawn(picked());
    await opened();
    await pressed(screen.getByRole("button", { name: "Toggle suggestions" }));
    await settled();
    await framed();

    expect(input().getAttribute("aria-expanded")).toBe("false");
  });

  it("moves focus to the input when pressed", async () => {
    await drawn(picked());
    await opened();

    expect(document.activeElement).toBe(input());
  });
});
