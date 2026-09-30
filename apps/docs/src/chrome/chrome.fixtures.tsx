/**
 * Renders a control of the bar inside the shell and a toolbar, and drives it with pointer events.
 */

import { type ReactElement } from "react";

import { type RenderResult } from "@testing-library/react";
import { catalogues } from "virtual:i18n";
import { vi } from "vitest";

import { Toolbar } from "@stealthscale/component-screen";
import { Shell } from "@stealthscale/provider-shell";
import { memoryStore } from "@stealthscale/settings";
import { drawn, pressed } from "@stealthscale/testing-react";

import { THEMES } from "#themes.ts";

/**
 * Locales a control renders with unless a case passes others: English alone.
 */
const ENGLISH: readonly [string, ...string[]] = ["en"];

/**
 * Renders a control inside the shell and a toolbar, with settings in a memory store per case.
 *
 * @remarks
 *   A control of the bar is a toolbar item, and a toolbar item throws outside a toolbar.
 * @param control - The control under test.
 * @param locales - The locales the shell offers. Defaults to English alone.
 * @returns The render, after the control's machine has committed its first state.
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
 * Replaces the window's `matchMedia` with one that matches no query, as on a window narrower than
 * every breakpoint.
 *
 * @remarks
 *   The test settings restore the global after each case.
 */
export function narrowed(): void {
  vi.stubGlobal("matchMedia", (media: string) => ({
    addEventListener: vi.fn(),
    matches: false,
    media,
    removeEventListener: vi.fn(),
  }));
}

/**
 * Opens a switcher and presses one of its rows.
 *
 * @param result - The render that contains the switcher.
 * @param control - The accessible name of the switcher's control.
 * @param option - The accessible name of the row to press.
 */
export async function chosen(result: RenderResult, control: string, option: string): Promise<void> {
  await pressed(result.getByRole("button", { name: control }));
  await pressed(result.getByRole("menuitemradio", { name: option }));
}
