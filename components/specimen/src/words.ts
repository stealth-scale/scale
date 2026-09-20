/**
 * Reads the words a specimen draws: one namespace, `specimen`, that the catalogue's own chrome
 * and every package's scenes read from, each under a prefix of its own.
 *
 * @remarks
 *   One namespace, so a translator finds every word of the catalogue in one place and a reader
 *   fetches a language once. A package keeps its words beside its code as
 *   `locales/<language>/specimen/<page>.json`, and the catalogue plugin places that file's words
 *   under `<page>` in the namespace. A specimen imports this rather than the i18n foundation, so a
 *   component package declares no dependency on it.
 */

import {
  type KeyPrefix,
  useTranslation,
  type UseTranslationResponse,
} from "@stealthscale/provider-i18n";

/**
 * The namespace every word of the catalogue is in.
 */
export const NAMESPACE = "specimen";

/**
 * The namespace's name, as a type.
 */
export type Namespace = typeof NAMESPACE;

/**
 * Where in the namespace one page's or one scene's words are: `button`, `button.looks`.
 */
export type Prefix = Exclude<KeyPrefix<Namespace>, undefined>;

/**
 * Reads the catalogue's words under one prefix, so a page names where its words are once and
 * reads each by the rest of its key.
 *
 * @remarks
 *   A hook rather than a reading, so a language switched under a running page reaches every scene
 *   that called it.
 * @param prefix - Where the words are: `button`.
 * @returns `t` bound to the prefix, with the instance and whether the words are ready.
 */
export function useWords<Under extends Prefix>(
  prefix: Under,
): UseTranslationResponse<Namespace, Under> {
  return useTranslation(NAMESPACE, { keyPrefix: prefix });
}
