/**
 * Reports the axes of a recipe that no scene on its page draws.
 *
 * @remarks
 *   An axis a page never draws is capability nobody can see. It compiles, it types, it ships, and
 *   the one place a reader would find it shows it to nobody. Measured across the library on
 *   2026-09-21, eleven of two hundred and ten axes were in that state, one of them added two days
 *   earlier by the person writing this.
 *   A page states what it skips rather than leaving an axis unnamed, and states why, so the reason
 *   is read at the point somebody would otherwise file it as a gap.
 */

/**
 * Describes what a recipe states about its axes, which is all this reads of it.
 */
interface Axed {
  /**
   * The axes the recipe offers, keyed by name.
   */
  readonly variants?: Readonly<Record<string, unknown>> | undefined;
}

/**
 * Describes what a scene states about the axes it draws, which is all this reads of it.
 */
interface Draws {
  /**
   * The axes the scene draws, where it draws any.
   */
  readonly axes?: readonly string[] | undefined;
}

/**
 * Describes what a page states beside its scenes.
 */
export interface CoverageOptions {
  /**
   * The axes the page draws no scene for, each against the reason it draws none.
   *
   * @remarks
   *   A reason rather than a bare list. An axis nobody drew and an axis somebody decided not to
   *   draw look the same in a list of names, and only one of them is a gap.
   */
  readonly skip?: Readonly<Record<string, string>> | undefined;
}

/**
 * Returns the axes of a recipe that no scene draws and no reason excuses.
 *
 * @remarks
 *   An axis named by a scene counts as drawn however many values that scene turns. A scene showing
 *   two of a look's five values is a thin scene rather than a missing one, and the check that would
 *   catch it reads pixels rather than names.
 *   A skip naming an axis the recipe does not offer is reported too, because a reason left behind
 *   after an axis is renamed reads as a decision somebody made about the new one.
 * @param recipe - The recipe the page is written for.
 * @param scenes - The scenes the page draws.
 * @param options - The reasons the page states for the axes it leaves undrawn.
 * @returns A line per axis nobody draws and per reason that names no axis.
 */
export function uncovered(
  recipe: Axed,
  scenes: readonly Draws[],
  options: CoverageOptions = {},
): readonly string[] {
  const offered = Object.keys(recipe.variants ?? {});
  const drawn = new Set(scenes.flatMap((scene) => scene.axes ?? []));
  const skipped = options.skip ?? {};

  const undrawn = offered
    .filter((axis) => !drawn.has(axis) && skipped[axis] === undefined)
    .map((axis) => `${axis} is drawn by no scene and skipped for no reason`);

  const stale = Object.keys(skipped)
    .filter((axis) => !offered.includes(axis))
    .map((axis) => `${axis} is skipped, and the recipe offers no such axis`);

  return undrawn.concat(stale);
}
