/**
 * Renders the toggle between light and dark mode.
 */

import { type ReactElement } from "react";

import { ColorModeToggle as Toggle } from "@stealthscale/component-actions";
import { Toolbar } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";

import { Moon } from "#chrome/moon.tsx";
import { Sun } from "#chrome/sun.tsx";

/**
 * Renders the library's color mode toggle as a small toolbar item with the bar's own glyphs.
 *
 * @remarks
 *   The toggle reads the resolved mode, not the stored choice, so while the mode follows the
 *   operating system it shows the resolved mode, and a press stores an explicit choice. The control
 *   is a toolbar item, so render it inside `Toolbar.Root`.
 */
export function ColorModeToggle(): ReactElement {
  const { t } = useTranslation("docs");

  return (
    <Toolbar.Item
      as={Toggle}
      dark={<Moon />}
      label={t("chrome.darkMode")}
      light={<Sun />}
      size="sm"
    />
  );
}
