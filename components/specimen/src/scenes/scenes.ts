/**
 * Generates one catalogue scene per recipe axis from a single draw function.
 *
 * @remarks
 *   Every axis gets a scene unless the page lists it in `skip` with a reason, so a new axis appears
 *   in the catalogue without a specimen edit. On 2026-09-21, 11 of the library's 210 axes had no
 *   scene. The page supplies the draw function, because a recipe declares axes and values but not
 *   the children a component needs.
 */

import { createElement, type ReactElement, type ReactNode } from "react";

import { valuesOf } from "#matrix/values.ts";
import { type Scene } from "#page.ts";
import { Drawn } from "#scenes/drawn.tsx";
import { sampled, type Snippet, written } from "#scenes/written.ts";

/**
 * Values of a boolean axis. A recipe declares a boolean axis as the single key `true`.
 */
const EITHER = [false, true] as const;

/**
 * Key a recipe declares a boolean axis under.
 */
const BOOLEAN = "true";

/**
 * Settings the source of a scene is written from.
 */
interface Sourced {
  /**
   * Example module whose source is written with the props of the first cell. Takes precedence
   * over `sample`.
   *
   * @remarks
   *   The example component takes one parameter named `props` and spreads it on every element it
   *   styles. See `propped` for the rewrite.
   */
  readonly example?: object | undefined;

  /**
   * Snippet the source is written from when there is no example.
   */
  readonly sample?: Snippet | undefined;
}

/**
 * Per-axis settings of a generated scene.
 *
 * @typeParam Props - Props of the component.
 */
export interface AxisScene<Props> extends Sourced {
  /**
   * Second axis rendered across each row.
   *
   * @remarks
   *   Crossing is an editorial choice the recipe cannot express. Size against radius is a useful
   *   grid. Size against motion produces cells that look identical in a still image.
   */
  readonly across?: string | undefined;

  /**
   * Cell flow. Defaults to `row`, with as many columns as fit.
   *
   * @remarks
   *   `column` puts one cell in each row. Two wide cells side by side invite a comparison of their
   *   widths instead of the axis values.
   */
  readonly direction?: "column" | "row" | undefined;

  /**
   * Draw function for this axis, for an axis the page's draw function does not show.
   *
   * @remarks
   *   Truncation needs text wider than its container and a blur needs an image. The default
   *   drawing of a page has no reason to include either.
   */
  readonly draw?: ((props: Props) => ReactNode) | undefined;

  /**
   * Whether the cells fill the window. Defaults to the page setting.
   */
  readonly viewport?: boolean | undefined;

  /**
   * Props fixed on every cell, for an axis that is invisible without them.
   *
   * @remarks
   *   An alert renders its edge in the palette colour, so without a status the edge renders
   *   neutral and is indistinguishable from no edge.
   */
  readonly with?: Props | undefined;
}

/**
 * Settings `scenesOf` generates the scenes of a page from.
 *
 * @typeParam Props - Props of the component.
 */
export interface ScenesOptions<Props> extends Sourced {
  /**
   * Per-axis settings, keyed by axis. An axis without settings still gets a scene.
   */
  readonly axes?: Readonly<Record<string, AxisScene<Props>>> | undefined;

  /**
   * Draw function for a cell, called with the props of the cell.
   */
  readonly draw: (props: Props) => ReactNode;

  /**
   * Translation key prefix of the scene titles and introductions, such as `card`.
   */
  readonly namespace: string;

  /**
   * Axis order of the scenes. Unlisted axes follow in recipe order.
   *
   * @remarks
   *   A page leads with appearance and then size. A recipe lists its axes in sorted order, which
   *   does not follow how a reader learns the component.
   */
  readonly order?: readonly string[] | undefined;

  /**
   * Axes that get no scene, each mapped to the reason.
   */
  readonly skip?: Readonly<Record<string, string>> | undefined;

  /**
   * Whether every scene fills the window.
   *
   * @remarks
   *   An application shell is as tall as its window, so padding would push it past the bottom of
   *   the window. An axis can set the flag for itself instead.
   */
  readonly viewport?: boolean | undefined;
}

/**
 * Recipe fields the generator reads.
 */
interface Axed {
  /**
   * Axes keyed by name.
   */
  readonly variants?: Readonly<Record<string, unknown>> | undefined;
}

/**
 * Returns the values of an axis, with a boolean axis expanded to false and true.
 */
function turning(recipe: Axed, axis: string): readonly unknown[] {
  const values = valuesOf(recipe, axis);

  return values.length === 1 && values[0] === BOOLEAN ? EITHER : values;
}

/**
 * Returns the props of one cell: the fixed props, the axis value and the crossing axis value.
 *
 * @remarks
 *   The props are built from recipe names, so the object needs a type assertion to become the
 *   component's props. The assertion is made here once instead of in each of the three callers.
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
 * Returns the props of the first cell of a scene.
 *
 * @remarks
 *   The props are the fixed props, the first value of the axis and the first value of the crossing
 *   axis. The source is written for the first cell, because a reader sees it first and compares
 *   the source against it.
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
 * Writes a source from an example if the settings have one, otherwise from a snippet.
 */
function sourced(
  settings: Sourced | undefined,
  props: Readonly<Record<string, unknown>>,
): string | undefined {
  return sampled(settings?.example, props) ?? written(settings?.sample, props);
}

/**
 * Returns the scene of one axis.
 *
 * @remarks
 *   Axis settings take precedence over page settings. Unset members are omitted instead of set to
 *   undefined, because a consumer checks whether a member is present.
 */
function sceneOf<Props>(
  recipe: Axed,
  options: ScenesOptions<Props>,
  axis: string,
  draw: () => ReactElement,
): Scene {
  const stated = options.axes?.[axis];
  const across = stated?.across;
  const first = firstOf(recipe, axis, stated);
  const source = sourced(stated, first) ?? sourced(options, first);
  const viewport = stated?.viewport ?? options.viewport;
  const scene: Scene = {
    about: `${options.namespace}.${axis}.about`,
    axes: across === undefined ? [axis] : [axis, across],
    draw,
    title: `${options.namespace}.${axis}.title`,
  };

  if (source !== undefined) scene.source = source;
  if (viewport !== undefined) scene.viewport = viewport;

  return scene;
}

/**
 * Returns the axes in the page's order, followed by the other axes in recipe order.
 */
function ordered(offered: readonly string[], order: readonly string[]): readonly string[] {
  const named = order.filter((axis) => offered.includes(axis));

  return named.concat(offered.filter((axis) => !named.includes(axis)));
}

/**
 * Returns one scene per recipe axis, without the skipped axes.
 *
 * @remarks
 *   Each scene declares its axes, so the coverage check reads the rendered axes instead of parsing
 *   source text. Titles and introductions are keyed `<namespace>.<axis>.title` and `.about`, so a
 *   new axis fails on a missing key until its description is written. An axis that another scene
 *   crosses gets no scene of its own unless the page sets something for it. The crossed scene
 *   already renders each of its values against each value of the crossing axis. The button page
 *   sets its looks both ways, because six axes cross them and the looks are still the scene most
 *   readers open the page for.
 * @param recipe - Recipe of the page.
 * @param options - Draw function, translation prefix and per-axis settings.
 * @returns One scene per axis, in the page's order.
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
     * Renders the scene of this axis as a named component, so the React tree shows a name.
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

    return sceneOf(recipe, options, axis, Turned);
  });
}
