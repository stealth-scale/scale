/**
 * Merges one set of stated values over another, key by key and all the way down.
 *
 * @remarks
 *   A theme built on another states what differs, so its switchable values are merged over the
 *   values beneath rather than replacing them. The compiler merges presets that way itself, and a
 *   theme's switchable half is a plain object the compiler never composes, so it is merged here.
 */

/**
 * Describes a value whose keys are merged rather than replaced.
 */
type Mergeable = Readonly<Record<string, unknown>>;

/**
 * Reports whether a value is a plain object.
 *
 * @remarks
 *   A `Date`, a `Map` or a `RegExp` is an object with no enumerable keys of its own, and merging
 *   one key by key would yield an empty object in its place. Only an object whose prototype is
 *   `Object.prototype` or null is merged.
 */
export function isPlainObject(value: unknown): value is Mergeable {
  if (typeof value !== "object" || value === null) return false;

  const prototype: unknown = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
}

/**
 * Merges an override over a base value.
 *
 * @remarks
 *   Plain objects merge. Everything else replaces, an array included, because a list a theme
 *   restates is the list it wants. A key stated as `undefined` states nothing, so a theme spreading
 *   an optional value keeps what it builds on.
 * @typeParam Value - The shape being merged.
 * @returns A new value carrying both, with the override winning wherever the two meet.
 */
export function deepMerge<Value>(base: Value, override: Value): Value {
  if (!isPlainObject(base) || !isPlainObject(override)) return override;

  const merged: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;

    merged[key] = key in base ? deepMerge(base[key], value) : value;
  }

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- built from the keys of the two arguments, so it carries their shape
  return merged as Value;
}
