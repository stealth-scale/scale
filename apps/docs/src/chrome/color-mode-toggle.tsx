/**
 * Draws the switch between light and dark.
 */

import { type ReactElement } from "react";

import { IconButton } from "@stealthscale/component-actions";
import { Toolbar } from "@stealthscale/component-screen";
import { useColorMode } from "@stealthscale/provider-color-mode";
import { useTranslation } from "@stealthscale/provider-i18n";

import { Moon } from "#chrome/moon.tsx";
import { Sun } from "#chrome/sun.tsx";

/**
 * Draws the library's icon button as a toggle bound to the shell's colour mode: pressed is dark,
 * and the glyph says which mode is in force.
 *
 * @remarks
 *   The button reads the mode the page is drawn in rather than the choice a person made, so while
 *   the mode follows the machine it shows what the machine resolved to, and pressing it takes over.
 *   The control is an item of the bar's row, so draw it inside `Toolbar.Root`.
 */
export function ColorModeToggle(): ReactElement {
  const { t } = useTranslation("docs");
  const { colorMode, setColorMode } = useColorMode();
  const dark = colorMode === "dark";

  return (
    <Toolbar.Item
      aria-label={t("chrome.darkMode")}
      aria-pressed={dark}
      as={IconButton}
      onClick={() => {
        setColorMode(dark ? "light" : "dark");
      }}
      size="sm"
      status="neutral"
      variant="ghost"
    >
      {dark ? <Moon /> : <Sun />}
    </Toolbar.Item>
  );
}
