/**
 * Renders the switches at the end of the bar: the language, the width, the theme and the mode.
 */

import { type ReactElement } from "react";

import { useBreakpoint, useViewport } from "@stealthscale/provider-viewport";

import { ColorModeToggle } from "#chrome/color-mode-toggle.tsx";
import { LocaleSwitcher } from "#chrome/locale-switcher.tsx";
import { ThemeSwitcher } from "#chrome/theme-switcher.tsx";
import { WidthSwitcher } from "#chrome/width-switcher.tsx";

/**
 * Renders the four switches in order: the language, the width, the theme and the mode.
 *
 * @remarks
 *   The width switcher renders on a window at least as wide as the `md` breakpoint, and on any
 *   window while a width is picked, so a reader can always return to the window's width. Below
 *   `md` the bar has no room for it at 420px. The window is read on the first render, so the
 *   switcher does not appear a frame after the bar. Each switch is an item of the bar's row, so
 *   render this inside `Toolbar.Root`.
 */
export function Switches(): ReactElement {
  const { width } = useViewport();
  const wide = useBreakpoint({ breakpoints: ["md"], ssr: false }) === "md";

  return (
    <>
      <LocaleSwitcher />
      {wide || width !== undefined ? <WidthSwitcher /> : null}
      <ThemeSwitcher />
      <ColorModeToggle />
    </>
  );
}
