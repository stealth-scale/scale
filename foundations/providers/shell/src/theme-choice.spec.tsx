import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { memoryStore, readSetting, settingKey, writeSetting } from "@stealthscale/settings";

import { Picked } from "#shell.fixtures.tsx";
import { THEME_SETTING, themeSetting, useThemeChoice } from "#theme-choice.ts";

describe("themeSetting", () => {
  it("names the setting after the theme", () => {
    expect(themeSetting(["forge"]).name).toBe(THEME_SETTING);
    expect(settingKey("docs", THEME_SETTING)).toBe("stealth.docs.theme");
  });

  it("falls back to the first theme offered", () => {
    const store = memoryStore();

    expect(readSetting("docs", themeSetting(["forge", "fathom"], store))).toBe("forge");
  });

  it("falls back to nothing where no theme is offered", () => {
    expect(readSetting("docs", themeSetting([], memoryStore()))).toBe("");
  });

  it("holds the setting to the themes offered", () => {
    const store = memoryStore();
    const setting = themeSetting(["forge", "fathom"], store);

    writeSetting("docs", setting, "fathom");
    expect(readSetting("docs", setting)).toBe("fathom");

    store.write(settingKey("docs", THEME_SETTING), "folio");
    expect(readSetting("docs", setting)).toBe("forge");
  });

  it("keeps the choice in the store it is given", () => {
    const store = memoryStore();

    expect(themeSetting(["forge"], store).store).toBe(store);
  });
});

describe("useThemeChoice", () => {
  it("answers no theme and no themes outside a shell", () => {
    render(<Picked />);

    expect(screen.getByText("none of nothing")).toBeTruthy();
  });

  it("switches nothing outside a shell", () => {
    render(<Picked />);
    screen.getByRole("button", { name: "folio" }).click();

    expect(screen.getByText("none of nothing")).toBeTruthy();
    expect(useThemeChoice).toBeTypeOf("function");
  });
});
