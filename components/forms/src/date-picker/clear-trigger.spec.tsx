import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ClearTrigger } from "#date-picker/clear-trigger.tsx";
import { framed, hiddenOf, OCTOBER_14, picked } from "#date-picker/date-picker.fixtures.tsx";
import { Input } from "#date-picker/input.tsx";

/**
 * Dates the cases that need one start with.
 */
const SET = [OCTOBER_14];

describe("ClearTrigger", () => {
  it("renders a button", async () => {
    const { container } = await drawn(picked({ defaultValue: SET }));

    expect(slotElement(container, "date-picker", "clearTrigger").tagName).toBe("BUTTON");
  });

  it("is hidden while no date is set", async () => {
    const { container } = await drawn(picked());

    expect(slotElement(container, "date-picker", "clearTrigger").hidden).toBe(true);
  });

  it("shows while a date is set", async () => {
    const { container } = await drawn(picked({ defaultValue: SET }));

    expect(slotElement(container, "date-picker", "clearTrigger").hidden).toBe(false);
  });

  it("is hidden in a read-only picker", async () => {
    const { container } = await drawn(picked({ defaultValue: SET, readOnly: true }));

    expect(slotElement(container, "date-picker", "clearTrigger").hidden).toBe(true);
  });

  it("is disabled in a disabled picker", async () => {
    const { container } = await drawn(picked({ defaultValue: SET, disabled: true }));

    expect(slotElement(container, "date-picker", "clearTrigger").hasAttribute("disabled")).toBe(
      true,
    );
  });

  it("is named Clear date by default", async () => {
    await drawn(picked({ defaultValue: SET }));

    expect(screen.getByRole("button", { name: "Clear date" })).toBeDefined();
  });

  it("is named by label", async () => {
    await drawn(
      picked(
        { defaultValue: SET },
        {
          control: (
            <>
              <Input />
              <ClearTrigger label="Clear the visit" />
            </>
          ),
        },
      ),
    );

    expect(screen.getByRole("button", { name: "Clear the visit" })).toBeDefined();
  });

  it("clears the dates when pressed", async () => {
    const { container } = await drawn(picked({ defaultValue: SET }));

    await pressed(screen.getByRole("button", { name: "Clear date" }));
    await settled();

    expect(hiddenOf(container).value).toBe("");
  });

  it("moves focus to the input when pressed", async () => {
    await drawn(picked({ defaultValue: SET }));
    await pressed(screen.getByRole("button", { name: "Clear date" }));
    await settled();
    await framed();

    expect(document.activeElement).toBe(screen.getByRole("textbox"));
  });

  it("calls the caller's onClick", async () => {
    const clicked = vi.fn<() => void>();

    await drawn(
      picked(
        { defaultValue: SET },
        {
          control: (
            <>
              <Input />
              <ClearTrigger onClick={clicked} />
            </>
          ),
        },
      ),
    );
    await pressed(screen.getByRole("button", { name: "Clear date" }));

    expect(clicked).toHaveBeenCalledOnce();
  });
});
