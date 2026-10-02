/**
 * Checks the identifiers a contract declares: the plugin id and the names of its declarations.
 *
 * @remarks
 *   A qualified id joins the two with a slash, `time-off/request.approve`. It is the one spelling
 *   of a name in the contract, the session, a service's check, the flag service and the
 *   catalogues.
 */

import { type QualifiedId } from "#reference.ts";

/**
 * Matches a plugin id: lowercase words of letters and digits joined by hyphens, starting with a
 * letter.
 */
const PLUGIN_ID = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/u;

/**
 * The fewest characters a plugin id has.
 */
const SHORTEST = 2;

/**
 * The most characters a plugin id has.
 */
const LONGEST = 32;

/**
 * Matches a name: a lowercase letter, then segments of letters and digits joined by a dot or a
 * hyphen.
 */
const NAME = /^[a-z][A-Za-z0-9]*(?:[.-][A-Za-z0-9]+)*$/u;

/**
 * The plugin id of the host's own contract, which no other contract may declare under.
 */
export const HOST = "host";

/**
 * Returns true for a plugin id: 2 to 32 characters of lowercase words joined by hyphens.
 *
 * @param id - The text to check.
 */
export function isPluginId(id: string): boolean {
  return id.length >= SHORTEST && id.length <= LONGEST && PLUGIN_ID.test(id);
}

/**
 * Returns true for a name a contract declares, such as `overview`, `request.approve` or
 * `item-sidebar`.
 *
 * @param name - The text to check.
 */
export function isName(name: string): boolean {
  return NAME.test(name);
}

/**
 * Returns the qualified id of a name: the plugin id and the name, joined by a slash.
 *
 * @param pluginId - The plugin that declares the name.
 * @param name - The name, as the contract lists it.
 */
export function qualify<P extends string, N extends string>(
  pluginId: P,
  name: N,
): QualifiedId<P, N> {
  return `${pluginId}/${name}`;
}

/**
 * Returns the plugin id a qualified id starts with, or the whole text where it has no slash.
 *
 * @param id - A qualified id, `time-off/request.approve`.
 */
export function pluginOf(id: string): string {
  const slash = id.indexOf("/");

  return slash === -1 ? id : id.slice(0, slash);
}
