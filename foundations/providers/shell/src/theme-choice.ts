/**
 * Declares the setting a person's chosen theme is remembered under, and carries the choice down
 * the tree.
 */

import { createContext, useContext } from "react";

import { defineSetting, type SettingDefinition, type SettingStore } from "@stealthscale/settings";

/**
 * The setting's own name, which the provider builds its key from.
 */
export const THEME_SETTING = "theme";

/**
 * Describes what {@link useThemeChoice} answers.
 */
export interface ThemeChoiceContextValue {
  /**
   * Switches the document to one of the themes on offer.
   *
   * @remarks
   *   A name the application does not offer is refused by the setting and the theme stays as it
   *   was.
   */
  readonly setTheme: (theme: string) => void;

  /**
   * The theme the document is switched to, or undefined where the application offers none, which
   * draws the application's first.
   */
  readonly theme: string | undefined;

  /**
   * The themes the application offers, the first being the one drawn until a person chooses.
   */
  readonly themes: readonly string[];
}

/**
 * Carries the theme choice down the tree.
 */
export const ThemeChoiceContext = createContext<ThemeChoiceContextValue>({
  setTheme: () => {},
  theme: undefined,
  themes: [],
});

/**
 * Declares the setting the chosen theme is remembered under.
 *
 * @remarks
 *   The values are the themes the application offers, so a name remembered from a build that
 *   offered it and dropped since falls back to the first theme rather than switching the document
 *   to a theme the stylesheet no longer holds.
 * @param themes - The themes the application offers, the first being the fallback.
 * @param store - Where to keep the choice. The page's local storage where this is absent.
 * @returns The setting, for the provider and for anything reading it without React.
 */
export function themeSetting(
  themes: readonly string[],
  store?: SettingStore,
): SettingDefinition<string> {
  return defineSetting({ fallback: themes[0] ?? "", name: THEME_SETTING, store, values: themes });
}

/**
 * Reads the theme a person chose, the themes on offer, and the function that switches.
 */
export function useThemeChoice(): ThemeChoiceContextValue {
  return useContext(ThemeChoiceContext);
}
