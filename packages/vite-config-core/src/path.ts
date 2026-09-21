/**
 * Appends to an array nested in a configuration object without knowing that object's shape.
 *
 * @remarks
 *   A contribution names its target as a dotted path. This module is the only place a Vite key is
 *   reached by string rather than by property access.
 */

/**
 * A plain object the path walk steps through.
 */
type Held = Record<string, unknown>;

/**
 * Reports whether a value can be stepped into on the way to the target array.
 *
 * @remarks
 *   An array fails the check despite being an object, because a path step into one would index it
 *   by name rather than by number.
 */
function walkable(value: unknown): value is Held {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Returns a copy of an object with one item appended to the array at a dotted path.
 *
 * @remarks
 *   The path is a run of property names separated by dots, such as `test.setupFiles`, so a property
 *   whose own name contains a dot cannot be reached. Every level along the path is copied and every
 *   sibling carried over by reference. A missing level is created, and a non-array value at the end
 *   is replaced by an array holding the one item. Where a level is an array of objects, such as a
 *   `pack` declaring several bundles, the walk enters each object and the item reaches every
 *   bundle.
 */
export function appended<Of extends object>(held: Of, path: string, item: unknown): Of {
  const dot = path.indexOf(".");
  const step = dot < 0 ? path : path.slice(0, dot);
  const below: unknown = Reflect.get(held, step);

  const grown =
    dot < 0
      ? [...(Array.isArray(below) ? (below as readonly unknown[]) : []), item]
      : descended(below, path.slice(dot + 1), item);

  return { ...held, [step]: grown };
}

/**
 * Steps one level down the path, into the object there or into each object of an array.
 */
function descended(below: unknown, rest: string, item: unknown): unknown {
  if (Array.isArray(below)) {
    return (below as readonly unknown[]).map((each) =>
      walkable(each) ? appended(each, rest, item) : each,
    );
  }

  return appended(walkable(below) ? below : {}, rest, item);
}
