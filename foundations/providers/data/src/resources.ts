/**
 * Finds and patches the records a query's data contains, through the query's resource selectors.
 */

import { isRecord } from "#record.ts";

/**
 * Identifies one record by its kind's qualified id and its own id.
 */
export interface ResourceRef {
  /**
   * Id of the record within its kind.
   */
  readonly id: string;

  /**
   * Qualified id of the resource kind: `time-off/request`.
   */
  readonly type: string;
}

/**
 * Describes where a query's data contains records of one kind.
 *
 * @remarks
 *   The value at `at` is one record or an array of records. An array on the way to it is walked
 *   element by element, so `pages.items` finds the items of every page. A record whose `id` member
 *   is neither a string nor a number is skipped.
 */
export interface ResourceSelector {
  /**
   * Dotted path of the records in the data. The data itself where left out.
   */
  readonly at?: string | undefined;

  /**
   * Member of each record that contains its id.
   */
  readonly id: string;

  /**
   * True where the records form a list that a created record of the kind may join.
   */
  readonly list?: true | undefined;

  /**
   * Qualified id of the resource kind.
   */
  readonly type: string;
}

/**
 * Describes one record a selector finds in a query's data.
 */
export interface FoundRecord {
  /**
   * The record's id, as a string.
   */
  readonly id: string;

  /**
   * The record.
   */
  readonly record: Readonly<Record<string, unknown>>;
}

/**
 * Describes how one record looks after a change.
 */
export interface RecordPatch extends ResourceRef {
  /**
   * Returns the record after the change, or undefined where the change removes it.
   */
  readonly apply: (
    record: Readonly<Record<string, unknown>>,
  ) => Record<string, unknown> | undefined;
}

/**
 * Returns the segments of a selector's dotted path.
 *
 * @param at - The path, or undefined for the data itself.
 * @returns The members to descend through, in order.
 */
function pathOf(at: string | undefined): readonly string[] {
  return at === undefined || at === "" ? [] : at.split(".");
}

/**
 * Returns a record's id as a string.
 *
 * @param record - A record the data contains.
 * @param member - Member that contains the id.
 * @returns The id, or undefined where the member is neither a string nor a number.
 */
function idOf(record: Readonly<Record<string, unknown>>, member: string): string | undefined {
  const value = record[member];

  return typeof value === "string" || typeof value === "number" ? String(value) : undefined;
}

/**
 * Returns the records at a path, walking every array on the way.
 *
 * @param value - The data, or the part of it the walk is at.
 * @param path - The members left to descend through.
 * @returns The records at the end of the path.
 */
function recordsIn(
  value: unknown,
  path: readonly string[],
): Array<Readonly<Record<string, unknown>>> {
  if (Array.isArray(value)) return value.flatMap((item: unknown) => recordsIn(item, path));

  if (!isRecord(value)) return [];

  const [head, ...rest] = path;

  return head === undefined ? [value] : recordsIn(value[head], rest);
}

/**
 * Returns each record a selector finds in a query's data, with its id.
 *
 * @remarks
 *   The walk follows the selector's path and every array on the way, as invalidation and patches
 *   read the data. A record whose id member is neither a string nor a number is left out.
 * @param data - The query's data.
 * @param selector - The path of the records and the member that contains each record's id.
 * @returns Every record found, in the order of the data.
 */
export function findRecords(
  data: unknown,
  selector: Pick<ResourceSelector, "at" | "id">,
): readonly FoundRecord[] {
  return recordsIn(data, pathOf(selector.at)).flatMap((record) => {
    const id = idOf(record, selector.id);

    return id === undefined ? [] : [{ id, record }];
  });
}

/**
 * Returns true where a query's data contains a record, through the selectors of the record's kind.
 *
 * @param data - The query's data.
 * @param selectors - The query's resource selectors.
 * @param ref - The kind and the id to look for.
 * @returns True where a selector of the record's kind finds a record with its id.
 */
export function containsRecord(
  data: unknown,
  selectors: readonly ResourceSelector[],
  ref: ResourceRef,
): boolean {
  return selectors.some(
    (selector) =>
      selector.type === ref.type && findRecords(data, selector).some(({ id }) => id === ref.id),
  );
}

/**
 * Returns the data with a patch applied to one record, walking every array on the way.
 *
 * @param value - The data, or the part of it the walk is at.
 * @param path - The members left to descend through.
 * @param member - Member that contains each record's id.
 * @param patch - The change, and the record it applies to.
 * @returns A copy of the value along the path, with the record patched.
 */
function patchedIn(
  value: unknown,
  path: readonly string[],
  member: string,
  patch: RecordPatch,
): unknown {
  if (Array.isArray(value)) {
    return value.flatMap((item: unknown) => {
      if (path.length > 0 || !isRecord(item) || idOf(item, member) !== patch.id) {
        return [patchedIn(item, path, member, patch)];
      }

      const after = patch.apply(item);

      return after === undefined ? [] : [after];
    });
  }

  if (!isRecord(value)) return value;

  const [head, ...rest] = path;

  if (head === undefined) {
    return idOf(value, member) === patch.id ? (patch.apply(value) ?? value) : value;
  }

  return head in value ? { ...value, [head]: patchedIn(value[head], rest, member, patch) } : value;
}

/**
 * Returns a query's data with a patch applied to every record it contains with the patch's id.
 *
 * @remarks
 *   A patch that removes a record drops it from a list. A record outside a list is left as it is,
 *   because the data keeps its shape until the refetch after the change replaces it.
 * @param data - The query's data, which the patch does not change.
 * @param selectors - The query's resource selectors.
 * @param patch - The change, and the record it applies to.
 * @returns The patched data, copied along the path of each selector of the patch's kind.
 */
export function patchRecords(
  data: unknown,
  selectors: readonly ResourceSelector[],
  patch: RecordPatch,
): unknown {
  let patched = data;

  for (const selector of selectors) {
    if (selector.type === patch.type) {
      patched = patchedIn(patched, pathOf(selector.at), selector.id, patch);
    }
  }

  return patched;
}
