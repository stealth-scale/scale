/**
 * The readers a shell specification mounts, one per provider the shell composes.
 */

import { type ReactElement } from "react";

import { useColorMode } from "@stealthscale/provider-color-mode";
import { useRootNode } from "@stealthscale/provider-environment";
import { useDefaultHotkeysOptions } from "@stealthscale/provider-hotkeys";
import { useTranslation } from "@stealthscale/provider-i18n";
import { useLocale } from "@stealthscale/provider-locale";
import { useViewport } from "@stealthscale/provider-viewport";
import { useTheme } from "@stealthscale/theme";

import { useThemeChoice } from "#theme-choice.ts";

/**
 * Reads one string of the menu.
 *
 * @returns A paragraph with the string.
 */
export function Worded(): ReactElement {
  return <p>{useTranslation("menu").t("commands")}</p>;
}

/**
 * Reads the theme and the colour mode the document was switched to.
 *
 * @returns A paragraph with both.
 */
export function Switched(): ReactElement {
  const { colorMode, theme } = useTheme();

  return <p>{`${theme ?? "none"}/${colorMode ?? "none"}`}</p>;
}

/**
 * Reads the choice a person made about the colour mode.
 *
 * @returns A paragraph with the choice.
 */
export function Chosen(): ReactElement {
  return <p>{useColorMode().choice}</p>;
}

/**
 * Reads the theme a person chose beside the themes on offer, and offers a button per theme and one
 * for a theme nobody offers.
 *
 * @returns A paragraph with the choice, and the buttons.
 */
export function Picked(): ReactElement {
  const { setTheme, theme, themes } = useThemeChoice();

  return (
    <div>
      <p>{`${theme ?? "none"} of ${themes.length === 0 ? "nothing" : themes.join(",")}`}</p>
      {[...themes, "folio"].map((name) => (
        <button
          key={name}
          onClick={() => {
            setTheme(name);
          }}
          type="button"
        >
          {name}
        </button>
      ))}
    </div>
  );
}

/**
 * Reads the locale and the direction that follows from it.
 *
 * @returns A paragraph with both.
 */
export function Written(): ReactElement {
  const { direction, locale } = useLocale();

  return <p>{`${locale}/${direction}`}</p>;
}

/**
 * Reports whether the node in scope is the page's own document.
 *
 * @returns A paragraph saying which.
 */
export function Rooted(): ReactElement {
  return <p>{useRootNode()() === globalThis.document ? "page" : "elsewhere"}</p>;
}

/**
 * Reads one of the defaults every shortcut starts from.
 *
 * @returns A paragraph with it.
 */
export function ShortcutDefaults(): ReactElement {
  const { hotkey } = useDefaultHotkeysOptions();

  return <p>{`ignoreInputs:${String(hotkey?.ignoreInputs)}`}</p>;
}

/**
 * Lists the widths the page can be read at.
 *
 * @returns A paragraph naming each one.
 */
export function Sized(): ReactElement {
  return (
    <p>
      {useViewport()
        .sizes.map(({ name }) => name)
        .join(",")}
    </p>
  );
}
