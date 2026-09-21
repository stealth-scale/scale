/**
 * Removes the settings a caller never passed, leaving a machine to apply its own defaults.
 *
 * @remarks
 *   A machine's splitter returns every key it knows about, and each key the caller skipped arrives
 *   carrying `undefined`. A machine that defaults a setting refuses `undefined` for it, and which
 *   settings carry defaults differs from one machine to the next. Dropping the unset entries here
 *   avoids restating that list in every component that hosts a machine.
 */

/**
 * Maps each setting to the same type with `undefined` excluded from it.
 *
 * @typeParam Options - The settings the caller passed.
 */
type Stated<Options> = { [Name in keyof Options]?: Exclude<Options[Name], undefined> };

/**
 * Filters out every entry whose value is `undefined`.
 *
 * @typeParam Options - The settings the caller passed.
 * @param options - The settings the machine's splitter pulled out of the root's props.
 * @returns A new object holding the remaining entries.
 */
export function stated<Options extends object>(options: Options): Stated<Options> {
  const set = Object.entries(options).filter(([, value]) => value !== undefined);

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- every entry kept is one the caller passed, so what comes back is what went in less the unset ones, which is what the type says
  return Object.fromEntries(set) as Stated<Options>;
}
