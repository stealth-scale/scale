/**
 * Draws the switches at the end of the bar: the language, the width, the theme and the mode.
 */

import { type ReactElement } from "react";

import { ColorModeToggle } from "#chrome/color-mode-toggle.tsx";
import { LocaleSwitcher } from "#chrome/locale-switcher.tsx";
import { ThemeSwitcher } from "#chrome/theme-switcher.tsx";
import { WidthSwitcher } from "#chrome/width-switcher.tsx";

/**
 * Draws the four switches in order, from what changes the words to what changes the paint.
 *
 * @remarks
 *   Each is an item of the bar's row, so draw this inside `Toolbar.Root`.
 */
export function Switches(): ReactElement {
  return (
    <>
      <LocaleSwitcher />
      <WidthSwitcher />
      <ThemeSwitcher />
      <ColorModeToggle />
    </>
  );
}
