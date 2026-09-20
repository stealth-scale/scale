/**
 * Builds a record from a list of keys, typed by the list rather than as a string index, and
 * drops the keys of a record that hold nothing.
 *
 * @remarks
 *   `Object.fromEntries` types its result with a string index, and a string index is not
 *   assignable to a record that requires every key of a list. One assertion here, made where the
 *   keys are the list, saves one at every call.
 */

/**
 * Describes a record with every undefined value dropped, so each key it keeps holds a value.
 *
 * @typeParam Source - The record the keys come from.
 */
export type Compacted<Source extends object> = {
  [Key in keyof Source]?: Exclude<Source[Key], undefined>;
};

/**
 * Builds a record with one entry per key, each filled by the callback.
 *
 * @typeParam Key - The keys the record carries.
 * @typeParam Value - The value under each key.
 */
export function recordOf<Key extends string, Value>(
  keys: readonly Key[],
  fill: (key: Key) => Value,
): Record<Key, Value> {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- built from every key in the list, so it carries every key
  return Object.fromEntries(keys.map((key) => [key, fill(key)])) as Record<Key, Value>;
}

/**
 * Drops every key of a record whose value is undefined, so a spread of the result over a set of
 * defaults keeps each default the record left unstated.
 *
 * @typeParam Source - The record the keys come from.
 */
export function compact<Source extends object>(record: Source): Compacted<Source> {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- built from the record's own entries, less the ones that hold nothing
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => value !== undefined),
  ) as Compacted<Source>;
}
