/**
 * Drops the settings a caller left unset, so a machine reads only what was stated.
 *
 * @remarks
 *   A machine takes the settings it defaults without `undefined`, and its own splitter hands every
 *   setting over carrying it. Passing that straight through offers a machine a value it refuses,
 *   and the list of which settings default is the machine's own and different for each one. Rather
 *   than restate that list per component, this drops every setting nobody set, which leaves the
 *   machine to apply its own defaults.
 */

/**
 * Describes the same settings, less the `undefined` an unset one carries.
 *
 * @typeParam Options - The settings a caller handed over.
 */
type Stated<Options> = { [Name in keyof Options]?: Exclude<Options[Name], undefined> };

/**
 * Returns the settings a caller actually stated.
 *
 * @typeParam Options - The settings a caller handed over.
 * @param options - Everything the machine's own splitter took out of the root's props.
 * @returns The same settings, less the ones nobody set.
 */
export function stated<Options extends object>(options: Options): Stated<Options> {
  const set = Object.entries(options).filter(([, value]) => value !== undefined);

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- every entry kept is one the caller passed, so what comes back is what went in less the unset ones, which is what the type says
  return Object.fromEntries(set) as Stated<Options>;
}
