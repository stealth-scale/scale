import { parseDate } from "@internationalized/date";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ClearTrigger } from "#date-input/clear-trigger.tsx";
import { Control } from "#date-input/control.tsx";
import { dated, framed, hiddenOf, segment } from "#date-input/date-input.fixtures.tsx";
import { Root } from "#date-input/root.tsx";
import { Segments } from "#date-input/segments.tsx";

/**
 * Date the cases that need one start with.
 */
const SET = [parseDate("2026-09-26")];

describe("ClearTrigger", () => {
  it("is hidden while no date is set", async () => {
    const { container } = await drawn(dated());

    expect(slotElement(container, "date-input", "clearTrigger").hidden).toBe(true);
  });

  it("shows while a date is set", async () => {
    const { container } = await drawn(dated({ defaultValue: SET }));

    expect(slotElement(container, "date-input", "clearTrigger").hidden).toBe(false);
  });

  it("is hidden in a read-only input", async () => {
    const { container } = await drawn(dated({ defaultValue: SET, readOnly: true }));

    expect(slotElement(container, "date-input", "clearTrigger").hidden).toBe(true);
  });

  it("is disabled in a disabled input", async () => {
    const { container } = await drawn(dated({ defaultValue: SET, disabled: true }));

    expect(slotElement(container, "date-input", "clearTrigger").hasAttribute("disabled")).toBe(
      true,
    );
  });

  it("is named Clear date by default", async () => {
    await drawn(dated({ defaultValue: SET }));

    expect(screen.getByRole("button", { name: "Clear date" })).toBeDefined();
  });

  it("is named by label", async () => {
    await drawn(
      <Root defaultValue={SET}>
        <Control>
          <Segments aria-label="Visit" />
          <ClearTrigger label="Clear the visit" />
        </Control>
      </Root>,
    );

    expect(screen.getByRole("button", { name: "Clear the visit" })).toBeDefined();
  });

  it("keeps the button in the tab order", async () => {
    await drawn(dated({ defaultValue: SET }));

    expect(screen.getByRole("button", { name: "Clear date" }).tabIndex).toBe(0);
  });

  it("clears the date when pressed", async () => {
    const { container } = await drawn(dated({ defaultValue: SET }));

    await pressed(screen.getByRole("button", { name: "Clear date" }));
    await settled();

    expect(hiddenOf(container).value).toBe("");
  });

  it("moves focus to the first segment when pressed", async () => {
    await drawn(dated({ defaultValue: SET }));
    await pressed(screen.getByRole("button", { name: "Clear date" }));
    await settled();
    await framed();

    expect(document.activeElement).toBe(segment("month, Appointment"));
  });

  it("calls the caller's onClick", async () => {
    const clicked = vi.fn<() => void>();

    await drawn(
      <Root defaultValue={SET}>
        <Control>
          <Segments aria-label="Visit" />
          <ClearTrigger onClick={clicked} />
        </Control>
      </Root>,
    );
    await pressed(screen.getByRole("button", { name: "Clear date" }));

    expect(clicked).toHaveBeenCalledOnce();
  });
});
