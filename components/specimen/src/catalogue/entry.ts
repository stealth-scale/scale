/**
 * Reads the rail entry a declaration carries.
 */

import { type RouteDeclaration } from "@stealthscale/provider-router";

/**
 * Describes what a declaration carries for the rail and the index to list it by.
 *
 * @remarks
 *   Published, because the rail lists whatever an application compiled beside the specimen pages. A
 *   theming page or a prose page states one of these and appears in the same rail, under its own
 *   heading, without the catalogue knowing what it draws.
 */
export interface Entry {
  /**
   * The sentence the index opens the page's card with. Empty where it is absent.
   */
  readonly about?: string | undefined;

  /**
   * The heading the rail lists it under. Listed under no heading of its own where it is absent.
   */
  readonly group?: string | undefined;

  /**
   * The words the rail writes.
   */
  readonly label: string;
}

/**
 * Reads one optional string off an entry, or undefined where it holds anything else.
 */
function stringAt(entry: object, name: string): string | undefined {
  const held: unknown = Reflect.get(entry, name);

  return typeof held === "string" ? held : undefined;
}

/**
 * Reads the rail entry a declaration carries, or nothing where it is listed nowhere.
 *
 * @remarks
 *   The compiler writes `navigation` onto the route without reading it, so what it holds is the
 *   catalogue's to check rather than to trust. A declaration an application wrote could carry
 *   anything under that name, and a route in no rail is ordinary.
 * @param declaration - The declaration to read.
 * @returns The entry, or nothing where the declaration carries none.
 */
export function entryOf(declaration: RouteDeclaration): Entry | undefined {
  const entry: unknown = declaration.navigation;

  if (typeof entry !== "object" || entry === null) return undefined;

  const label = stringAt(entry, "label");

  if (label === undefined) return undefined;

  const about = stringAt(entry, "about");
  const group = stringAt(entry, "group");

  return {
    ...(about === undefined ? {} : { about }),
    ...(group === undefined ? {} : { group }),
    label,
  };
}
