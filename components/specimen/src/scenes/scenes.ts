/**
 * Builds one scene per axis a recipe offers, from one drawing of the component.
 *
 * @remarks
 *   Every axis gets a scene unless the page states a reason it gets none. That default is the
 *   point: an axis added to a recipe reaches its page without anybody remembering to write a
 *   scene, which is the failure this replaces. Measured on 2026-09-21, eleven of the library's two
 *   hundred and ten axes were drawn by nothing.
 *   The page hands over one drawing of the component and the generator turns each axis through it.
 *   The drawing cannot come from the recipe: a recipe names its axes and their values and knows
 *   nothing of the children a card holds or the rows a table needs.
 */

import { createElement, type ReactElement, type ReactNode } from "react";

import { valuesOf } from "#matrix/values.ts";
import { type Scene } from "#page.ts";
import { Drawn } from "#scenes/drawn.tsx";
import { type Snippet, written } from "#scenes/written.ts";

/**
 * The two answers a boolean axis takes, which a recipe states as the one key `true`.
 */
const EITHER = [false, true] as const;

/**
 * Marks the one key a recipe states a boolean axis under.
 */
const BOOLEAN = "true";

/**
 * Describes one axis of a page: how it is crossed, drawn and held.
 *
 * @typeParam Props - The props the component takes.
 */
export interface AxisScene<Props> {
  /**
   * A second axis to run across each row, for a pair that reads better crossed than apart.
   *
   * @remarks
   *   Crossing is editorial and cannot be read off a recipe. A size against a corner is a grid
   *   worth reading, and a size against a motion is a screen of cells that differ in nothing a
   *   still image holds.
   */
  readonly across?: string | undefined;

  /**
   * Which way the cells run. Across the room by default, on as many columns as it holds.
   *
   * @remarks
   *   A column is one cell per row, which is what an axis of two wide cells wants: drawn across,
   *   a pair of cards each half the room reads as a comparison of their widths rather than of the
   *   thing the axis turns.
   */
  readonly direction?: "column" | "row" | undefined;

  /**
   * A drawing for this axis alone, where the page's own drawing does not show it.
   *
   * @remarks
   *   A truncation needs words longer than its box and a blur needs a picture, neither of which
   *   the drawing that shows a look has any reason to hold.
   */
  readonly draw?: ((props: Props) => ReactNode) | undefined;

  /**
   * The component as a consumer writes it for this axis alone, where the page's own sample does
   * not stand for it.
   */
  readonly sample?: Snippet | undefined;

  /**
   * The props held fixed while this axis turns, for an axis invisible without them.
   *
   * @remarks
   *   An alert's edge is drawn in the palette's own colour, so a bar on a page that states no
   *   status is the neutral one and reads as no bar at all.
   */
  readonly with?: Props | undefined;
}

/**
 * Describes everything a page states to have its scenes built.
 *
 * @typeParam Props - The props the component takes.
 */
export interface ScenesOptions<Props> {
  /**
   * The axes that state something of their own, keyed by the axis. An axis named nowhere here
   * still gets a scene.
   */
  readonly axes?: Readonly<Record<string, AxisScene<Props>>> | undefined;

  /**
   * Draws the component for a value of whichever axis the scene turns.
   */
  readonly draw: (props: Props) => ReactNode;

  /**
   * The words a scene's title and sentence are looked up under, `card` for a card.
   */
  readonly namespace: string;

  /**
   * The order the scenes are drawn in, axis by axis. An axis left out follows the ones named, in
   * the order the recipe states them.
   *
   * @remarks
   *   A page reads as an argument rather than as a list: what the component looks like, then how
   *   large, then the rest. A recipe states its axes in the order a sorting rule put them, which
   *   is nobody's argument.
   */
  readonly order?: readonly string[] | undefined;

  /**
   * The component as a consumer writes it, which every scene shows as its source.
   *
   * @remarks
   *   Stated rather than read off the drawing. The drawing is a function returning a tree, and the
   *   line a reader copies is the component's own tag round its own children, which that tree may
   *   hold at any depth under a wrapper the page wrote for staging.
   */
  readonly sample?: Snippet | undefined;

  /**
   * The axes that get no scene, each against the reason.
   */
  readonly skip?: Readonly<Record<string, string>> | undefined;
}

/**
 * Describes the part of a recipe this reads: its axes, each holding its values.
 */
interface Axed {
  /**
   * The axes the recipe offers, keyed by name.
   */
  readonly variants?: Readonly<Record<string, unknown>> | undefined;
}

/**
 * Returns the values an axis turns, reading a boolean axis as the two answers it takes.
 */
function turning(recipe: Axed, axis: string): readonly unknown[] {
  const values = valuesOf(recipe, axis);

  return values.length === 1 && values[0] === BOOLEAN ? EITHER : values;
}

/**
 * Writes the props one cell is drawn from: what the axis states, the value it turns to, and the
 * value of whatever crosses it.
 *
 * @remarks
 *   The props are built from names the recipe holds rather than written out, so the object cannot
 *   be typed as the component's own props without asserting it. The assertion is here, at the one
 *   place a name becomes a prop, rather than at each of the three callers.
 */
function propsOf<Props>(
  turned: Readonly<Record<string, unknown>>,
  fixed: Props | undefined,
): Props {
  const built = { ...fixed, ...turned };

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- an axis of a recipe is a prop of the component the recipe draws
  return built as Props;
}

/**
 * Writes the props the first cell of a scene is drawn with: what the scene holds fixed, the axis
 * it turns at its first value, and the axis crossing it at its own first.
 *
 * @remarks
 *   The first cell rather than a cell of the page's choosing, because it is the one a reader's eye
 *   lands on and the one the snippet is read against.
 */
function firstOf<Props>(
  recipe: Axed,
  axis: string,
  stated: AxisScene<Props> | undefined,
): Readonly<Record<string, unknown>> {
  const across = stated?.across;

  return {
    ...stated?.with,
    [axis]: turning(recipe, axis)[0],
    ...(across === undefined ? {} : { [across]: turning(recipe, across)[0] }),
  };
}

/**
 * Puts the axes in the order the page states, and the rest after them as the recipe states them.
 */
function ordered(offered: readonly string[], order: readonly string[]): readonly string[] {
  const named = order.filter((axis) => offered.includes(axis));

  return named.concat(offered.filter((axis) => !named.includes(axis)));
}

/**
 * Returns one scene per axis the recipe offers, less the ones the page states a reason to skip.
 *
 * @remarks
 *   A scene states the axis it draws, so the coverage check reads what a page shows rather than
 *   guessing it from the file's text.
 *   The words are looked up by convention, `<namespace>.<axis>.title` and `.about`, so a new axis
 *   fails on a missing key until somebody writes the sentence that says what it is for. That is
 *   the point rather than the cost: describing an axis is the price of adding one.
 *   An axis another scene crosses gets no scene of its own, unless the page states something for
 *   it. It is already drawn once per value against every value of the axis crossing it, so a
 *   second scene turning it alone draws the same cells in one row. A page that states the axis
 *   wants it both ways: the button's looks are crossed by six other axes and are still the one
 *   scene a reader opens that page for.
 * @param recipe - The recipe the page is written for.
 * @param options - The drawing, the words, and whatever each axis states.
 * @returns One scene per axis, in the order the page states.
 */
export function scenesOf<Props extends object>(
  recipe: Axed,
  options: ScenesOptions<Props>,
): readonly Scene[] {
  const skipped = options.skip ?? {};
  const named = options.axes ?? {};
  const crossed = new Set(
    Object.values(named)
      .flatMap((stated) => (stated.across === undefined ? [] : [stated.across]))
      .filter((axis) => named[axis] === undefined),
  );
  const offered = Object.keys(recipe.variants ?? {}).filter(
    (axis) => skipped[axis] === undefined && !crossed.has(axis),
  );

  return ordered(offered, options.order ?? []).map((axis) => {
    const stated = named[axis];
    const across = stated?.across;
    const draw = stated?.draw ?? options.draw;

    /**
     * Draws this axis, declared as a named component so the catalogue reads a name rather than an
     * anonymous function in its tree.
     */
    function Turned(): ReactElement {
      return createElement(Drawn, {
        ...(across === undefined ? {} : { across: { knob: across, of: turning(recipe, across) } }),
        ...(stated?.direction === undefined ? {} : { direction: stated.direction }),
        cell: (value: unknown, other: unknown) =>
          draw(
            propsOf(
              { [axis]: value, ...(across === undefined ? {} : { [across]: other }) },
              stated?.with,
            ),
          ),
        knob: axis,
        of: turning(recipe, axis),
      });
    }

    const source = written(stated?.sample ?? options.sample, firstOf(recipe, axis, stated));
    const scene: Scene = {
      about: `${options.namespace}.${axis}.about`,
      axes: across === undefined ? [axis] : [axis, across],
      draw: Turned,
      title: `${options.namespace}.${axis}.title`,
    };

    if (source !== undefined) scene.source = source;

    return scene;
  });
}
