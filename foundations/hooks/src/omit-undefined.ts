/**
 * Removes the entries of an object whose value is `undefined`, and types the result to match.
 */

/**
 * Maps each property of an object type to an optional property that excludes `undefined`.
 *
 * @typeParam Options - The object type the entries come from.
 */
export type OmitUndefined<Options> = {
  [Name in keyof Options]?: Exclude<Options[Name], undefined>;
};

/**
 * Returns a copy of an object without the entries whose value is `undefined`.
 *
 * @remarks
 *   Under `exactOptionalPropertyTypes`, Zag's `useMachine` rejects `undefined` for every setting
 *   the machine defaults, while the machine's own `Partial<Props>` allows it. Passing split props
 *   through this function gives them the type `useMachine` accepts. The runtime value does not
 *   change, because `useMachine` already strips `undefined` entries with `compact` from
 *   `@zag-js/utils` before it merges the defaults.
 */
export function omitUndefined<Options extends object>(options: Options): OmitUndefined<Options> {
  const defined = Object.entries(options).filter(([, value]) => value !== undefined);

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- fromEntries returns a string index type, and every entry it receives is an entry of options with a defined value
  return Object.fromEntries(defined) as OmitUndefined<Options>;
}
