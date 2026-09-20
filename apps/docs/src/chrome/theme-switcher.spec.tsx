import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";

import { chosen, shelled } from "#chrome/chrome.fixtures.tsx";
import { ThemeSwitcher } from "#chrome/theme-switcher.tsx";
import { THEMES } from "#themes.ts";

/**
 * The theme a page wears first, and the one the specifications switch to.
 */
const [FIRST = "", SECOND = ""] = THEMES;

/**
 * Reads the theme a control's swatch stands for.
 */
function swatchOf(control: HTMLElement): string | undefined {
  return control.querySelector<HTMLElement>("[data-theme]")?.dataset["theme"];
}

describe("ThemeSwitcher", () => {
  it("names the theme in force after what it switches", async () => {
    const result = await shelled(<ThemeSwitcher />);

    expect(result.getByRole("button", { name: `Theme ${FIRST}` })).toBeDefined();
  });

  it("marks the control with a swatch of the theme in force", async () => {
    const result = await shelled(<ThemeSwitcher />);

    expect(swatchOf(result.getByRole("button", { name: `Theme ${FIRST}` }))).toBe(FIRST);
  });

  it("marks every row with a swatch of its own theme", async () => {
    const result = await shelled(<ThemeSwitcher />);

    await pressed(result.getByRole("button", { name: `Theme ${FIRST}` }));

    expect(swatchOf(result.getByRole("menuitemradio", { name: SECOND }))).toBe(SECOND);
  });

  it("lists every theme the shell offers once opened", async () => {
    const result = await shelled(<ThemeSwitcher />);

    await chosen(result, `Theme ${FIRST}`, SECOND);

    expect(result.getByRole("button", { name: `Theme ${SECOND}` })).toBeDefined();
  });
});
