/**
 * Draws a board: samples a specimen writes and arranges itself, on the library's grid.
 */

import {
  Children,
  type ComponentProps,
  createElement,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

import { Grid } from "@stealthscale/component-layout";

import { useFramed } from "#framed/context.ts";
import { type Choice, useReportedChoices } from "#framed/report.ts";
import { type Display, DisplayProvider } from "#sample/display.ts";

/**
 * The gap a board leaves between its samples until a caller says otherwise.
 *
 * @remarks
 *   The widest gap the scale offers, which is what a matrix leaves between its cells. Two drawings
 *   of one component read as two only when the room between them is wider than the room inside
 *   either, and a specimen shows components that carry insets of their own.
 */
const GAP = "2xl";

/**
 * The columns a board draws until a caller says otherwise: as many of the smallest measure as the
 * room holds, the empty ones dropped so the samples share the whole row.
 *
 * @remarks
 *   Equal columns are what make a page of drawings read as a set. Components differ in width by
 *   their nature, and cells that each take their own width put the captions at uneven intervals
 *   and leave a ragged edge down the page.
 *   Fitted rather than filled. A filled row keeps the columns nobody wrote a sample for, so two
 *   samples on a wide card each took a quarter of it and anything wider than a quarter was cut off
 *   at the column's edge. Fitting drops the empty columns, so two samples take half the card each
 *   and one takes all of it. The cost is that a scene of two samples no longer lines up with a
 *   scene of four on the same page, which is the lesser of the two: a reader compares the samples
 *   of one scene far more often than the scenes of one page.
 */
const COLUMNS = "fit-xs";

/**
 * Describes what a board takes: everything the library's grid takes, and the look it sets for
 * every sample on it.
 */
export interface BoardProps extends ComponentProps<typeof Grid.Root>, Display {}

/**
 * Reads a word a sample was given, or nothing where it was given none or something else.
 */
function worded(props: unknown, name: string): string | undefined {
  const value: unknown =
    typeof props === "object" && props !== null ? Reflect.get(props, name) : undefined;

  return typeof value === "string" ? value : undefined;
}

/**
 * Lists each sample the way its caption reads: the knob and the value, the value alone, or its
 * position where it carries no caption, as the choice a picker over the board offers.
 */
function offered(children: ReactNode): Choice {
  const names = Children.toArray(children).map((child, position) => {
    const props = isValidElement(child) ? child.props : undefined;
    const of = worded(props, "of");
    const knob = worded(props, "knob");

    if (of === undefined) return String(position + 1);

    return knob === undefined ? of : `${knob} = ${of}`;
  });

  return { names, part: "sample" };
}

/**
 * Lays out the samples a specimen writes, and states how each of them is drawn.
 *
 * @remarks
 *   A board is the library's grid and nothing more, so the columns, the gap, the alignment and the
 *   flow are the grid's own axes and a specimen laid out on one is also a specimen of the grid.
 *   What a board adds is the look: it is stated once here and every sample below takes it, so a
 *   page of boxed drawings is one prop rather than one per cell.
 *   Use it where a matrix cannot say what a page should look like: where the drawings are not one
 *   per value of an axis, where two of them belong side by side and a third below, or where one of
 *   them needs the whole width.
 *   In a framed document the board draws the one sample the frame was asked for and nothing round
 *   it, and tells the page holding the frame which samples it offers, each named by the caption
 *   its sample carries or by its position where it carries none, so the page draws a picker over
 *   them.
 * @param props - The grid's axes, the look of every sample, and the samples.
 * @returns The samples, arranged.
 */
export function Board({
  children,
  columns = COLUMNS,
  gap = GAP,
  place,
  variant,
  ...grid
}: BoardProps): ReactElement {
  const pick = useFramed();

  useReportedChoices(pick === undefined ? undefined : [offered(children)]);

  // A fragment built by hand, because the sample is whatever the specimen wrote and a board in a
  // frame adds no element of its own round it.
  if (pick !== undefined) {
    return createElement(Fragment, null, Children.toArray(children)[pick.sample ?? 0] ?? null);
  }

  return (
    <Grid.Root align="flex-start" columns={columns} gap={gap} {...grid}>
      <DisplayProvider value={{ place, variant }}>{children}</DisplayProvider>
    </Grid.Root>
  );
}
