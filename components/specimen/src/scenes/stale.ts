/**
 * Reports a scene whose stated source names a value its recipe no longer offers.
 *
 * @remarks
 *   A built scene takes its source from the same values it draws with, so the two cannot drift. A
 *   scene that states its own source states the props by hand, and a look renamed in the recipe
 *   leaves that hand-written line naming something nothing draws. Nothing else catches it: the
 *   source is a string, so the compiler reads it as prose and the page still renders.
 *   Only an attribute naming an axis of the recipe is read. A snippet sets props that are no axis
 *   at all, `aria-pressed` and `disabled` among them, and those are the element's rather than the
 *   recipe's.
 */

/**
 * Matches one attribute written as a word, `variant="solid"`, and names the two parts.
 */
const ATTRIBUTE = /(\w[\w-]*)="([^"]*)"/gu;

/**
 * Describes what a recipe states about its axes, which is all this reads of one.
 */
interface Axed {
  /**
   * The axes the recipe offers, each holding its values keyed by name.
   */
  readonly variants?: Readonly<Record<string, Readonly<Record<string, unknown>>>> | undefined;
}

/**
 * Describes what a scene states about its source, which is all this reads of one.
 */
interface Stated {
  /**
   * The source the scene shows, where it states one.
   */
  readonly source?: string | undefined;

  /**
   * The name the scene is headed with, which names it in what this reports.
   */
  readonly title: string;
}

/**
 * Reports every value a scene's source names that its axis does not offer.
 *
 * @param recipe - The recipe the page is written for.
 * @param scenes - The scenes the page draws.
 * @returns A line per value nobody offers, and an empty array for a page whose sources are current.
 */
export function stale(recipe: Axed, scenes: readonly Stated[]): readonly string[] {
  const axes = recipe.variants ?? {};

  return scenes.flatMap((scene) =>
    [...(scene.source ?? "").matchAll(ATTRIBUTE)].flatMap(([, axis, value]) => {
      const offered = axis === undefined ? undefined : axes[axis];

      return offered === undefined || value === undefined || value in offered
        ? []
        : [`${scene.title} writes ${axis}="${value}", which the axis does not offer`];
    }),
  );
}
