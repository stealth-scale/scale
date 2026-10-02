/**
 * Builds the signature pads the part specifications render, and draws strokes in them the way a
 * pointer does.
 */

import { type ReactElement } from "react";

import { fireEvent } from "@testing-library/react";

import { settled } from "@stealthscale/testing-react";

import { ClearTrigger, type ClearTriggerProps } from "#signature-pad/clear-trigger.tsx";
import { Control } from "#signature-pad/control.tsx";
import { Guide } from "#signature-pad/guide.tsx";
import { Label } from "#signature-pad/label.tsx";
import { Root, type RootProps } from "#signature-pad/root.tsx";
import { Segment } from "#signature-pad/segment.tsx";

/**
 * Describes the parts a case changes: whether the label renders, and the clear trigger's props.
 */
export interface Parts {
  /**
   * Whether the label renders. Defaults to true.
   */
  readonly labelled?: boolean | undefined;

  /**
   * Props of the clear trigger.
   */
  readonly trigger?: ClearTriggerProps | undefined;
}

/**
 * Parts when the case changes none.
 */
const PLAIN: Parts = {};

/**
 * Points of the stroke a case draws when it states none, in the control's pixels.
 */
export const LINE: ReadonlyArray<readonly [number, number]> = [
  [20, 60],
  [40, 50],
  [60, 64],
  [80, 48],
  [100, 62],
  [120, 52],
];

/**
 * Renders a signature pad named `Signature` with its strokes, guide and clear trigger, with the
 * props the case sets on the root and the parts it changes.
 *
 * @param props - The props of the root.
 * @param parts - Whether the label renders, and the props of the clear trigger.
 * @returns The signature pad.
 */
export function composed(props: RootProps = {}, parts: Parts = PLAIN): ReactElement {
  return (
    <Root {...props}>
      {parts.labelled === false ? null : <Label>Signature</Label>}
      <Control>
        <Segment />
        <Guide />
        <ClearTrigger {...parts.trigger}>
          <span data-glyph="eraser" />
        </ClearTrigger>
      </Control>
    </Root>
  );
}

/**
 * Returns the hidden input a form reads.
 *
 * @param container - The element the case rendered into.
 * @returns The input.
 */
export function hiddenInput(container: HTMLElement): HTMLInputElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the root renders the input
  return container.querySelector("input") as HTMLInputElement;
}

/**
 * Returns the paths the segment renders.
 *
 * @param container - The element the case rendered into.
 * @returns The `path` elements.
 */
export function paths(container: HTMLElement): SVGPathElement[] {
  return [...container.querySelectorAll("path")];
}

/**
 * Draws one stroke in a control with a pressed mouse button: down on the first point, a move to
 * each later point, and up on the last.
 *
 * @param control - The control to draw in.
 * @param points - The points of the stroke, in client pixels. Defaults to a wavy line.
 * @returns A promise that resolves once the machine has taken the stroke.
 */
export async function stroked(
  control: HTMLElement,
  points: ReadonlyArray<readonly [number, number]> = LINE,
): Promise<void> {
  const [[startX, startY] = [0, 0], ...rest] = points;
  const pressed = { button: 0, buttons: 1, pointerId: 1, pointerType: "mouse" };

  fireEvent.pointerDown(control, { ...pressed, clientX: startX, clientY: startY });
  await settled();

  for (const [clientX, clientY] of rest) {
    fireEvent.pointerMove(control.ownerDocument, { ...pressed, clientX, clientY });
  }

  fireEvent.pointerUp(control.ownerDocument, { ...pressed, buttons: 0 });
  await settled();
}
