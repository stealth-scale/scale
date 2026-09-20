/**
 * Reads the theme, the colour mode and the language written on the document root, so a frame is
 * loaded again when any of them changes.
 *
 * @remarks
 *   A framed document reads its theme, its mode and its language from the settings the shell
 *   keeps, which it shares with the page holding it, so what it needs is to load again once the
 *   page has changed one. The shell writes each of them onto the document root, and reading them
 *   there needs no provider the kit would otherwise have to peer on. The three are watched through
 *   a mutation observer and read as one string, which is what a frame is keyed by.
 */

import { useSyncExternalStore } from "react";

import { COLOR_MODE_ATTRIBUTE, THEME_ATTRIBUTE } from "@stealthscale/theme";

/**
 * The attributes watched, in the order they are read.
 */
const ATTRIBUTES = [THEME_ATTRIBUTE, COLOR_MODE_ATTRIBUTE, "lang"];

/**
 * Tells React when one of the attributes changes.
 */
function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);

  observer.observe(document.documentElement, { attributeFilter: ATTRIBUTES, attributes: true });

  return (): void => {
    observer.disconnect();
  };
}

/**
 * Reads the attributes as they stand, joined.
 */
function snapshot(): string {
  return ATTRIBUTES.map((name) => document.documentElement.getAttribute(name) ?? "").join("/");
}

/**
 * Reads the attributes as they stand on a server: none.
 */
function absent(): string {
  return "";
}

/**
 * Reads the theme, the colour mode and the language on the document root as one string.
 *
 * @returns The three, joined by slashes, empty where none is written.
 */
export function useRootAttributes(): string {
  return useSyncExternalStore(subscribe, snapshot, absent);
}
