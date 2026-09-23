/**
 * Renders the toggle between light and dark mode.
 */

import { type ReactElement } from "react";

import { IconButton } from "@stealthscale/component-actions";
import { Toolbar } from "@stealthscale/component-screen";
import { useColorMode } from "@stealthscale/provider-color-mode";
import { useTranslation } from "@stealthscale/provider-i18n";

import { Moon } from "#chrome/moon.tsx";
import { Sun } from "#chrome/sun.tsx";

/**
 * Renders the library's icon button as a toggle bound to the shell's color mode: pressed means
 * dark, and the icon shows the active mode.
 *
 * @remarks
 *   The button reads the resolved mode, not the stored choice, so while the mode follows the
 *   operating system the button shows the resolved mode, and a press stores an explicit choice. The
 *   control is a toolbar item, so render it inside `Toolbar.Root`.
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
      palette="neutral"
      size="sm"
      variant="ghost"
    >
      {dark ? <Moon /> : <Sun />}
    </Toolbar.Item>
  );
}
