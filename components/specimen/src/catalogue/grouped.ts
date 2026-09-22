/**
 * Sorts the declarations a rail lists into the sections and groups it draws.
 *
 * @remarks
 *   Two levels of heading and no deeper. A rail draws a section as a heading over a list and a
 *   group as a branch that opens, which is two treatments and the two a reader can tell apart. A
 *   third would need a third, and a sidebar nobody can navigate is worse than a flat one.
 *   Each level is read off the entry the declaration carries rather than off its identifier. A
 *   route identifier is the page's address with its slashes turned into dots, so there is nothing
 *   left in it to read a heading from; the route builder reads the address while it still has it.
 */

import { type RouteDeclaration } from "@stealthscale/provider-router";

import { type Entry, entryOf } from "#catalogue/entry.ts";

/**
 * One page of a rail, against the route it opens.
 */
export interface Listed {
  /**
   * The entry the declaration carried.
   */
  readonly entry: Entry;

  /**
   * The identifier the link resolves through.
   */
  readonly id: string;
}

/**
 * One branch of a rail, and the pages under it.
 */
export interface Group {
  /**
   * The heading, or empty where the pages under it named none. The rail words an empty one, because
   * a heading nobody wrote is the rail's to name and not this module's.
   */
  readonly name: string;

  /**
   * The pages, sorted by the words the rail writes.
   */
  readonly pages: readonly Listed[];
}

/**
 * One heading of a rail, and the groups under it.
 */
export interface Section {
  /**
   * The groups, sorted by heading.
   */
  readonly groups: readonly Group[];

  /**
   * The heading, or empty where the pages under it belong to no section.
   */
  readonly name: string;
}

/**
 * Compares two headings, putting an empty one last.
 *
 * @remarks
 *   Two headings are never equal, because each is a key of the map they were collected into.
 */
function before(one: string, next: string): number {
  if (one === "") return 1;
  if (next === "") return -1;

  return one.localeCompare(next);
}

/**
 * Collects the pages under one key, keeping the order they arrived in.
 */
function collected(held: Map<string, Listed[]>, key: string, page: Listed): void {
  held.set(key, [...(held.get(key) ?? []), page]);
}

/**
 * Returns the declarations a rail lists, under one heading per section and one per group.
 *
 * @remarks
 *   A declaration carrying no entry is left out, because a route in no rail is ordinary. Every
 *   level sorts by name rather than by the order the declarations arrived, so a page added by an
 *   application lands where a reader would look for it rather than at the end.
 * @param declarations - Every route compiled into the catalogue, whatever declared them.
 * @returns One section per heading, each holding its groups, each holding its pages.
 */
export function grouped(declarations: readonly RouteDeclaration[]): readonly Section[] {
  const held = new Map<string, Map<string, Listed[]>>();

  for (const declaration of declarations) {
    const entry = entryOf(declaration);

    if (entry === undefined) continue;

    const section = entry.section ?? "";
    const groups = held.get(section) ?? new Map<string, Listed[]>();

    collected(groups, entry.group ?? "", { entry, id: declaration.id });
    held.set(section, groups);
  }

  return [...held]
    .map(([name, groups]) => ({
      groups: [...groups]
        .map(([group, pages]) => ({
          name: group,
          pages: pages.toSorted((one, next) => one.entry.label.localeCompare(next.entry.label)),
        }))
        .toSorted((one, next) => before(one.name, next.name)),
      name,
    }))
    .toSorted((one, next) => before(one.name, next.name));
}
