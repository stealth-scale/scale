import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  COLOR_MODE_SETTING,
  type ColorModeChoice,
  ColorModeProvider,
} from "@stealthscale/provider-color-mode";
import { memoryStore, settingKey, type SettingStore } from "@stealthscale/settings";

import { Picked, Switched } from "#shell.fixtures.tsx";
import { THEME_SETTING } from "#theme-choice.ts";
import { Themed } from "#themed.tsx";

/**
 * Mounts the theme reader under a colour mode a person already chose.
 *
 * @param choice - The choice the store holds.
 * @param themes - The themes on offer.
 * @param store - The store, fresh where none is given.
 */
function mounted(
  choice: ColorModeChoice,
  themes?: readonly string[],
  store: SettingStore = memoryStore(),
): void {
  store.write(settingKey("probe", COLOR_MODE_SETTING), choice);

  render(
    <ColorModeProvider app="probe" store={store}>
      <Themed app="probe" store={store} themes={themes}>
        <Switched />
        <Picked />
      </Themed>
    </ColorModeProvider>,
  );
}

describe("Themed", () => {
  it("passes a chosen mode to the theme provider", () => {
    mounted("dark", ["forge"]);

    expect(screen.getByText("forge/dark")).toBeTruthy();
  });

  it("passes no mode while a person follows the machine", () => {
    mounted("system", ["forge"]);

    expect(screen.getByText("forge/none")).toBeTruthy();
  });

  it("removes the colour mode attribute while a person follows the machine", () => {
    mounted("system", ["forge"]);

    expect(document.documentElement.dataset["colorMode"]).toBeUndefined();
  });

  it("writes a chosen mode onto the document root", () => {
    mounted("dark", ["forge"]);

    expect(document.documentElement.dataset["colorMode"]).toBe("dark");
  });

  it("switches the document to no theme when it is offered none", () => {
    mounted("system");

    expect(screen.getByText("none/none")).toBeTruthy();
    expect(screen.getByText("none of nothing")).toBeTruthy();
  });

  it("draws the first theme until a person chooses", () => {
    mounted("system", ["forge", "fathom"]);

    expect(screen.getByText("forge/none")).toBeTruthy();
    expect(screen.getByText("forge of forge,fathom")).toBeTruthy();
  });

  it("draws the theme a person chose on an earlier visit", () => {
    const store = memoryStore();

    store.write(settingKey("probe", THEME_SETTING), "fathom");
    mounted("system", ["forge", "fathom"], store);

    expect(screen.getByText("fathom/none")).toBeTruthy();
  });

  it("falls back to the first theme where the remembered one is no longer offered", () => {
    const store = memoryStore();

    store.write(settingKey("probe", THEME_SETTING), "folio");
    mounted("system", ["forge", "fathom"], store);

    expect(screen.getByText("forge/none")).toBeTruthy();
  });

  it("switches the document when a person picks a theme", () => {
    const store = memoryStore();

    mounted("system", ["forge", "fathom"], store);
    act(() => {
      screen.getByRole("button", { name: "fathom" }).click();
    });

    expect(screen.getByText("fathom/none")).toBeTruthy();
    expect(store.read(settingKey("probe", THEME_SETTING))).toBe("fathom");
  });

  it("keeps the theme where a person picks one that is not offered", () => {
    mounted("system", ["forge", "fathom"]);
    act(() => {
      screen.getByRole("button", { name: "folio" }).click();
    });

    expect(screen.getByText("forge/none")).toBeTruthy();
  });
});
