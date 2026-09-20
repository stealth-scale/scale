/**
 * Hands the chosen colour mode and the chosen theme to the theme provider, which owns both
 * document attributes.
 */

import { type ReactElement, type ReactNode, useMemo } from "react";

import { useColorMode } from "@stealthscale/provider-color-mode";
import { type SettingStore, useSetting } from "@stealthscale/settings";
import { ThemeProvider } from "@stealthscale/theme";

import { ThemeChoiceContext, type ThemeChoiceContextValue, themeSetting } from "#theme-choice.ts";

/**
 * No themes, for an application that offers none and draws its first.
 */
const NONE: readonly string[] = [];

/**
 * Describes what {@link Themed} is given.
 */
export interface ThemedProps {
  /**
   * The application the choice is remembered under.
   */
  readonly app: string;

  /**
   * The page drawn in the theme.
   */
  readonly children?: ReactNode | undefined;

  /**
   * Where to keep the choice. The page's local storage where this is absent.
   */
  readonly store?: SettingStore | undefined;

  /**
   * The themes the application offers, the first drawn until a person chooses. None where this is
   * absent, which draws the application's first and offers no switch.
   */
  readonly themes?: readonly string[] | undefined;
}

/**
 * Mounts the theme provider with the colour mode the provider above it settled on and the theme a
 * person chose.
 *
 * @remarks
 *   Both providers write `data-color-mode` on the document root, and the theme provider removes
 *   the attribute where it is given no mode. Reading the choice and passing it on makes the two
 *   write the same thing rather than undoing each other. A person following the machine is passed
 *   nothing, which is how both spell that. The theme is kept the way the colour mode is, as a
 *   setting under the application's name, so a switch survives a reload and reaches every open
 *   tab. The definition is memoised against the store and the list, because a reader is
 *   subscribed by the identity of the definition it was built from.
 * @param props - The application, the themes, the store and the page. `ThemedProps` documents
 *   every member.
 */
export function Themed({ app, children, store, themes = NONE }: ThemedProps): ReactElement {
  const { choice } = useColorMode();
  const setting = useMemo(() => themeSetting(themes, store), [store, themes]);
  const [chosen, setTheme] = useSetting(app, setting);
  const theme = themes.length === 0 ? undefined : chosen;
  const value = useMemo<ThemeChoiceContextValue>(
    () => ({ setTheme, theme, themes }),
    [setTheme, theme, themes],
  );

  return (
    <ThemeChoiceContext value={value}>
      <ThemeProvider {...(choice === "system" ? {} : { colorMode: choice })} theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeChoiceContext>
  );
}
