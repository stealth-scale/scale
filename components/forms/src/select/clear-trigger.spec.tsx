import { act, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ClearTrigger } from "#select/clear-trigger.tsx";
import { Control } from "#select/control.tsx";
import { Root } from "#select/root.tsx";
import { accounts, framed, opened, picked, trigger } from "#select/select.fixtures.tsx";
import { Trigger } from "#select/trigger.tsx";

describe("ClearTrigger", () => {
  it("is hidden while nothing is selected", async () => {
    const { container } = await drawn(picked());

    expect(slotElement(container, "select", "clearTrigger").hidden).toBe(true);
  });

  it("shows while a value is selected", async () => {
    const { container } = await drawn(picked({ defaultValue: ["bridge"] }));

    expect(slotElement(container, "select", "clearTrigger").hidden).toBe(false);
  });

  it("is named Clear value by default", async () => {
    await drawn(picked({ defaultValue: ["bridge"] }));

    expect(screen.getByRole("button", { name: "Clear value" })).toBeDefined();
  });

  it("is named by label", async () => {
    await drawn(
      <Root collection={accounts()} defaultValue={["bridge"]}>
        <Control>
          <Trigger aria-label="Account" />
          <ClearTrigger label="Clear the account" />
        </Control>
      </Root>,
    );

    expect(screen.getByRole("button", { name: "Clear the account" })).toBeDefined();
  });

  it("clears the value when pressed", async () => {
    await drawn(picked({ defaultValue: ["bridge"] }));
    await pressed(screen.getByRole("button", { name: "Clear value" }));
    await settled();

    expect(trigger().textContent).toBe("Pick an account");
  });

  it("moves focus to the trigger once it clears the value", async () => {
    await drawn(picked({ defaultValue: ["bridge"] }));
    await pressed(screen.getByRole("button", { name: "Clear value" }));
    await settled();
    await framed();

    expect(document.activeElement).toBe(trigger());
  });

  it("closes the open panel when it takes focus", async () => {
    await drawn(picked({ defaultValue: ["bridge"] }));
    await opened();
    act(() => {
      screen.getByRole("button", { name: "Clear value" }).focus();
    });
    await settled();
    await framed();

    expect(trigger().getAttribute("aria-expanded")).toBe("false");
  });

  it("leaves the closed panel closed when it takes focus", async () => {
    await drawn(picked({ defaultValue: ["bridge"] }));
    act(() => {
      screen.getByRole("button", { name: "Clear value" }).focus();
    });
    await settled();

    expect(trigger().getAttribute("aria-expanded")).toBe("false");
  });

  it("keeps focus when it closes the open panel", async () => {
    await drawn(picked({ defaultValue: ["bridge"] }));
    await opened();
    act(() => {
      screen.getByRole("button", { name: "Clear value" }).focus();
    });
    await settled();
    await framed();

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Clear value" }));
  });
});
