/**
 * Renders a control of the bar with the shell and the row it reads in scope, and drives it the way
 * a pointer does.
 */

import { type ReactElement } from "react";

import { type RenderResult } from "@testing-library/react";
import { catalogues } from "virtual:i18n";

import { Toolbar } from "@stealthscale/component-screen";
import { Shell } from "@stealthscale/provider-shell";
import { memoryStore } from "@stealthscale/settings";
import { drawn, pressed } from "@stealthscale/testing-react";

import { THEMES } from "#themes.ts";

/**
 * The locales a control is drawn with unless a case names others: English alone.
 */
const ENGLISH: readonly [string, ...string[]] = ["en"];

/**
 * Draws a control inside the shell and the bar's row, with settings kept in memory so two cases
 * share nothing.
 *
 * @remarks
 *   The row is there because a control of the bar is an item of it and throws outside one.
 * @param control - The control under test.
 * @param locales - The locales the shell offers, English alone where a case names none.
 * @returns The render, once the control's machine has committed.
 */
export function shelled(
  control: ReactElement,
  locales: readonly [string, ...string[]] = ENGLISH,
): Promise<RenderResult> {
  return drawn(
    <Shell
      app="docs"
      catalogues={catalogues}
      locales={locales}
      store={memoryStore()}
      themes={THEMES}
    >
      <Toolbar.Root aria-label="Catalogue">{control}</Toolbar.Root>
    </Shell>,
  );
}

/**
 * Opens a switcher and chooses one of its rows.
 *
 * @param result - The render holding the switcher.
 * @param control - The accessible name of the switcher's control.
 * @param option - The words of the row to choose.
 * @returns Nothing. The caller reads the screen.
 */
export async function chosen(result: RenderResult, control: string, option: string): Promise<void> {
  await pressed(result.getByRole("button", { name: control }));
  await pressed(result.getByRole("menuitemradio", { name: option }));
}
