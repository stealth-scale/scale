/**
 * Binds the library's `Button` to the carousel's trigger slots, and chooses the triggers' default
 * look.
 *
 * @remarks
 *   A trigger under the slides takes the `ghost` look, so the row reads as one group of quiet
 *   controls. A trigger over the slides takes the `surface` look, whose `bg.panel` fill and edge
 *   read over any photograph.
 */

import { type JSX } from "react";

import { Button, type ButtonProps } from "@stealthscale/component-actions";
import { type Look } from "@stealthscale/theme/authoring";

import { withContext } from "#carousel/context.ts";
import { type CarouselMachine } from "#carousel/machine.ts";

/**
 * Renders the previous trigger as the library's `Button` with the carousel's class.
 */
export const PrevButton: (props: ButtonProps) => JSX.Element = withContext(Button, "prevTrigger");

/**
 * Renders the next trigger as the library's `Button` with the carousel's class.
 */
export const NextButton: (props: ButtonProps) => JSX.Element = withContext(Button, "nextTrigger");

/**
 * Renders the rotation control as the library's `Button` with the carousel's class.
 */
export const AutoplayButton: (props: ButtonProps) => JSX.Element = withContext(
  Button,
  "autoplayTrigger",
);

/**
 * Returns the look a trigger takes unless the caller sets another.
 *
 * @param controls - Where the controls go.
 * @returns `surface` over the slides, else `ghost`.
 */
export function lookOf(controls: CarouselMachine["controls"]): Look {
  return controls === "overlay" ? "surface" : "ghost";
}
