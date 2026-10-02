import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  chordOf,
  chosen,
  ESCAPE_KEY,
  openedPalette,
  PALETTE_KEYS,
  pressedKeys,
  requesting,
  type Run,
  typedInto,
} from "#commands/commands.fixtures.ts";

describe("CommandPalette", () => {
  it("opens on Mod+K", async () => {
    await openedPalette();

    expect(screen.getByRole("dialog", { name: "Command palette" })).toBeTruthy();
  });

  it("closes on Mod+K once open", async () => {
    await openedPalette();
    await pressedKeys(PALETTE_KEYS);

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes on Escape", async () => {
    await openedPalette();
    await pressedKeys(ESCAPE_KEY);

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("lists a command a key could run under its plugin's name", async () => {
    await openedPalette();

    const group = screen.getByRole("group", { name: "Time off" });

    expect(within(group).getByRole("option", { name: /Request time off/u })).toBeTruthy();
  });

  it("leaves out a command that takes arguments", async () => {
    await openedPalette();

    expect(screen.queryByRole("option", { name: /Approve request/u })).toBeNull();
  });

  it("leaves out a command that resolves with a result", async () => {
    await openedPalette();

    expect(screen.queryByRole("option", { name: /Pick a person/u })).toBeNull();
  });

  it("leaves out a command whose condition is false", async () => {
    await openedPalette(chordOf().product);

    expect(screen.queryByRole("option", { name: /Export the audit log/u })).toBeNull();
  });

  it("lists the main menu's pages under Go to", async () => {
    await openedPalette();

    const group = screen.getByRole("group", { name: "Go to" });

    expect(
      within(group)
        .getAllByRole("option")
        .map(({ textContent }) => textContent),
    ).toStrictEqual(["Invoices", "Time off", "Payroll runs"]);
  });

  it("runs a command the person chooses", async () => {
    const requested = vi.fn<Run>();

    await openedPalette(requesting(requested));
    await chosen(screen.getByRole("option", { name: /Request time off/u }));

    expect(requested).toHaveBeenCalledTimes(1);
  });

  it("closes once the person chooses", async () => {
    await openedPalette();
    await chosen(screen.getByRole("option", { name: /Request time off/u }));

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("navigates nowhere when the person chooses a command", async () => {
    const { router } = await openedPalette();

    await chosen(screen.getByRole("option", { name: /Request time off/u }));

    expect(router.state.location.pathname).toBe("/invoices");
  });

  it("navigates to a page the person chooses", async () => {
    const { router } = await openedPalette();

    await chosen(screen.getByRole("option", { name: "Payroll runs" }));

    expect(router.state.location.pathname).toBe("/payroll");
  });

  it("matches a command by the keywords its catalogue states", async () => {
    await openedPalette(chordOf().product);
    await typedInto(screen.getByRole("textbox", { name: "Search commands" }), "holiday");

    expect(screen.getAllByRole("option").map(({ textContent }) => textContent)).toStrictEqual([
      "Request time offCtrl+Shift+R",
    ]);
  });
});
