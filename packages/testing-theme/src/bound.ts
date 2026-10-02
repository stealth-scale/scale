/**
 * Checks a bound component against its recipe: every class the runtime writes on the element for
 * the defaults and for each value, and no class beside them.
 *
 * @remarks
 *   The check renders the component through a callback the specification supplies, once with
 *   nothing picked and once per value of every axis, and reads the recipe's classes off the
 *   element. The expected classes come from the recipe alone: the class of each value picked or
 *   defaulted that styles the element, and the class of each compound whose selection matches. A
 *   part of a slot recipe gets a value's class only where the value styles that part, which is
 *   what the runtime's pruning does.
 */

import { slotClass, variantClass } from "@stealthscale/pandacss-naming";

import { slotStyled } from "#reachable.ts";
import { type Declared } from "#recipe.ts";
import { classesOf, recipeElement, slotElement } from "#rendered.ts";

/**
 * Renders the component with the props a caller would write, and returns what it rendered into.
 *
 * @typeParam Props - The component's props, which the check fills from the recipe's axes.
 */
export type Draw<Props extends object> = (props: Props) => ParentNode;

/**
 * Renders the component and settles it, for one whose state machine commits after it mounts.
 *
 * @typeParam Props - The component's props, which the check fills from the recipe's axes.
 */
export type DrawAsync<Props extends object> = (props: Props) => PromiseLike<ParentNode>;

/**
 * Describes what a bound check takes beside the recipe.
 */
export interface BoundChecks {
  /**
   * The values the binding fixes through its default props, which the element has where nothing
   * is picked.
   */
  defaults?: Readonly<Record<string, string>> | undefined;

  /**
   * The slot the element renders, for a part of a slot recipe.
   */
  slot?: string | undefined;

  /**
   * Finds the element to read, where `data-recipe` and the slot class do not identify it.
   */
  subject?: ((container: ParentNode) => Element) | undefined;
}

/**
 * Lists the keys of a compound that are not axes.
 */
const UNMATCHED = new Set(["className", "classNames", "css", "name"]);

/**
 * Returns true when the value is a plain object.
 */
function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Converts a boolean axis's value to the boolean a caller writes, and leaves any other as is.
 */
function propOf(value: string): boolean | string {
  if (value === "true") return true;
  if (value === "false") return false;

  return value;
}

/**
 * Returns true when every axis the compound selects on has the value the selection picked.
 */
function matched(
  compound: Readonly<Record<string, unknown>>,
  selection: Readonly<Record<string, string>>,
): boolean {
  return Object.entries(compound)
    .filter(([axis]) => !UNMATCHED.has(axis))
    .every(([axis, selected]) => {
      const chosen: readonly unknown[] = Array.isArray(selected) ? selected : [selected];

      return chosen.some((value) => String(value) === selection[axis]);
    });
}

/**
 * Picks a value for each axis the recipe offers: the one picked, or else the default.
 */
function selectionOf(
  recipe: Declared,
  picked: Readonly<Record<string, string>>,
): Readonly<Record<string, string>> {
  const defaults = isRecord(recipe.defaultVariants) ? recipe.defaultVariants : {};
  const selection: Record<string, string> = {};

  for (const [axis, values] of Object.entries(recipe.variants ?? {})) {
    const value = picked[axis] ?? (axis in defaults ? String(defaults[axis]) : undefined);

    if (value !== undefined && isRecord(values) && value in values) selection[axis] = value;
  }

  return selection;
}

/**
 * Returns true when the value's styles apply to the slot, and always where there is no slot.
 */
function stylesSlot(
  recipe: Declared,
  axis: string,
  value: string,
  slot: string | undefined,
): boolean {
  if (slot === undefined) return true;

  const values = recipe.variants?.[axis];

  return isRecord(values) && slotStyled(values[value], slot);
}

/**
 * Lists the class of each compound the selection matches and whose styles apply to the slot.
 */
function compoundClasses(
  recipe: Declared,
  slot: string | undefined,
  selection: Readonly<Record<string, string>>,
): readonly string[] {
  return (recipe.compoundVariants ?? []).flatMap((compound) => {
    if (!isRecord(compound) || !matched(compound, selection)) return [];
    if (slot !== undefined && !slotStyled(compound["css"], slot)) return [];

    const className = compound["className"];

    return typeof className === "string" ? [className] : [];
  });
}

/**
 * Lists the recipe's classes that the element should have for what was picked, with the defaults
 * filled in.
 */
function expectedClasses(
  recipe: Declared,
  owner: string,
  slot: string | undefined,
  picked: Readonly<Record<string, string>>,
): readonly string[] {
  const selection = selectionOf(recipe, picked);
  const variants = Object.entries(selection)
    .filter(([axis, value]) => stylesSlot(recipe, axis, value, slot))
    .map(([axis, value]) => variantClass(owner, axis, value));

  return [owner, ...variants, ...compoundClasses(recipe, slot, selection)]
    .filter((each) => each !== "")
    .toSorted();
}

/**
 * Returns true when a `staticCss` entry emits the value: the whole recipe, the whole axis, or the
 * value by name.
 */
function emits(entry: unknown, axis: string, value: string): boolean {
  if (entry === "*") return true;
  if (!isRecord(entry)) return false;

  const listed = entry[axis];

  return listed === "*" || (Array.isArray(listed) && listed.includes(value));
}

/**
 * Reports each value the binding fixes that no `staticCss` entry emits.
 *
 * @remarks
 *   The compiler extracts a recipe's rules from the JSX literals that write its values. A value a
 *   binding fixes through a default prop is written by no literal, so its class is on the element
 *   with no rule behind it unless the recipe lists it under `staticCss`.
 */
function unemitted(
  recipe: Declared,
  defaults: Readonly<Record<string, string>>,
): readonly string[] {
  return Object.entries(defaults)
    .filter(([axis, value]) => !(recipe.staticCss ?? []).some((entry) => emits(entry, axis, value)))
    .map(
      ([axis, value]) =>
        `${recipe.className} fixes ${axis} ${value} through a default prop, which staticCss does not list`,
    );
}

/**
 * Reads the recipe's classes off the element: the owner class, and every class that starts with it.
 */
function actualClasses(element: Element, owner: string): readonly string[] {
  return classesOf(element).filter((each) => each === owner || each.startsWith(`${owner}--`));
}

/**
 * Reports each class the element lacks and each class it has that the recipe does not write, for
 * one render.
 */
function differences(
  owner: string,
  actual: readonly string[],
  expected: readonly string[],
  when: string,
): readonly string[] {
  return [
    ...expected
      .filter((each) => !actual.includes(each))
      .map((each) => `${owner} lacks ${each} ${when}`),
    ...actual
      .filter((each) => !expected.includes(each))
      .map((each) => `${owner} has ${each} ${when}, which the recipe does not write`),
  ];
}

/**
 * Lists every render the check makes: nothing picked, then each value of each axis.
 */
function renders(
  recipe: Declared,
): ReadonlyArray<readonly [picked: Readonly<Record<string, string>>, when: string]> {
  const bare = [[{}, "when nothing is picked"] as const];
  const values = Object.entries(recipe.variants ?? {}).flatMap(([axis, offered]) =>
    isRecord(offered)
      ? Object.keys(offered).map(
          (value) => [{ [axis]: value }, `when ${axis} is ${value}`] as const,
        )
      : [],
  );

  return [...bare, ...values];
}

/**
 * Describes what one run of the check needs: the renders it makes, and how it reads each one.
 *
 * @typeParam Props - The component's props, which the check fills from the recipe's axes.
 */
interface Planned<Props extends object> {
  /**
   * One entry per render: the props to render with, and how to read what came back.
   */
  readonly cases: ReadonlyArray<readonly [props: Props, read: (drawn: ParentNode) => string[]]>;

  /**
   * The violations the recipe has before anything renders.
   */
  readonly stated: readonly string[];
}

/**
 * Plans every render the check makes and how each one is read, which is everything the two checks
 * share.
 *
 * @remarks
 *   The sync check and the awaiting one differ only in how they get a container out of the
 *   callback, so the recipe is read once here and both walk the result.
 * @typeParam Props - The component's props, which the check fills from the recipe's axes.
 */
function planned<Props extends object>(recipe: Declared, options: BoundChecks): Planned<Props> {
  const { slot } = options;
  const owner = slot === undefined ? recipe.className : slotClass(recipe.className, slot);
  const find =
    options.subject ??
    ((container: ParentNode): Element =>
      slot === undefined
        ? recipeElement(container, recipe.className)
        : slotElement(container, recipe.className, slot));

  const fixed = options.defaults ?? {};

  return {
    cases: renders(recipe).map(([picked, when]) => {
      const entries = Object.entries(picked).map(([axis, value]) => [axis, propOf(value)] as const);
      // eslint-disable-next-line typescript/no-unsafe-type-assertion -- each key is an axis the recipe offers and each value one the axis takes, which is what Props names
      const props = Object.fromEntries(entries) as Props;

      /**
       * Reads the classes off what one render produced and reports what differs from the recipe.
       */
      const read = (drawn: ParentNode): string[] => [
        ...differences(
          owner,
          actualClasses(find(drawn), owner),
          expectedClasses(recipe, owner, slot, { ...fixed, ...picked }),
          when,
        ),
      ];

      return [props, read] as const;
    }),
    stated: unemitted(recipe, fixed),
  };
}

/**
 * Reports every class a bound component lacks or has against its recipe, over one render per
 * value of every axis and one with nothing picked.
 *
 * @returns Each difference as a sentence naming the class and the render, or an empty array for
 *   a component that writes the classes its recipe states.
 */
export function boundViolations<Props extends object>(
  recipe: Declared,
  draw: Draw<Props>,
  options: BoundChecks = {},
): readonly string[] {
  const { cases, stated } = planned<Props>(recipe, options);

  return [...stated, ...cases.flatMap(([props, read]) => read(draw(props)))];
}

/**
 * Reports the same differences for a component whose state machine commits after it mounts.
 *
 * @remarks
 *   Such a component schedules its first update on a microtask, so a render that is not awaited
 *   commits outside the test's act scope and React reports an update it did not see. The renders
 *   run one after another rather than together, because each one mounts into the document and two
 *   act scopes open at once report the same thing.
 * @returns Each difference as a sentence naming the class and the render, or an empty array for
 *   a component that writes the classes its recipe states.
 */
export async function boundMachineViolations<Props extends object>(
  recipe: Declared,
  draw: DrawAsync<Props>,
  options: BoundChecks = {},
): Promise<readonly string[]> {
  const { cases, stated } = planned<Props>(recipe, options);
  const differing: string[] = [];

  for (const [props, read] of cases) {
    // eslint-disable-next-line no-await-in-loop -- each render mounts into the document, so one settles before the next opens its act scope
    differing.push(...read(await draw(props)));
  }

  return [...stated, ...differing];
}
