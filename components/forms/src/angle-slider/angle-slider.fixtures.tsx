/**
 * Builds the angle sliders the part specifications render, and drives them.
 */

import { type ReactElement } from "react";

import { act, fireEvent, screen } from "@testing-library/react";

import { settled } from "@stealthscale/testing-react";

import { Control } from "#angle-slider/control.tsx";
import { Label } from "#angle-slider/label.tsx";
import { MarkerGroup } from "#angle-slider/marker-group.tsx";
import { Marker } from "#angle-slider/marker.tsx";
import { Range } from "#angle-slider/range.ts";
import { Root, type RootProps } from "#angle-slider/root.tsx";
import { Thumb, type ThumbProps } from "#angle-slider/thumb.tsx";
import { Track } from "#angle-slider/track.ts";
import { ValueText } from "#angle-slider/value-text.tsx";

/**
 * Describes how a composed angle slider differs from the default one.
 */
export interface Composition {
  /**
   * Whether the dial renders `AngleSlider.Label`. Defaults to true.
   */
  readonly labelled?: boolean | undefined;

  /**
   * Props of the thumb.
   */
  readonly thumb?: ThumbProps | undefined;
}

/**
 * Composition of the default angle slider.
 */
const PLAIN: Composition = {};

/**
 * Renders a rotation dial at 45° with its label, ring, markers at the quarters, thumb and value
 * text, with the props the case sets on the root.
 *
 * @param props - The props of the root.
 * @param composition - Whether the label renders, and the thumb's props.
 * @returns The angle slider.
 */
export function composed(props: RootProps = {}, composition: Composition = PLAIN): ReactElement {
  const { labelled = true, thumb: knob = {} } = composition;

  return (
    <Root defaultValue={45} {...props}>
      {labelled ? <Label>Rotation</Label> : null}
      <Control>
        <Track>
          <Range />
        </Track>
        <MarkerGroup>
          <Marker value={0} />
          <Marker value={90} />
          <Marker value={180} />
          <Marker value={270} />
        </MarkerGroup>
        <Thumb {...knob} />
        <ValueText />
      </Control>
    </Root>
  );
}

/**
 * Returns the thumb by its accessible name.
 *
 * @param name - The thumb's accessible name, `Rotation` by default.
 * @returns The element in the `slider` role.
 */
export function thumb(name: RegExp | string = "Rotation"): HTMLElement {
  return screen.getByRole("slider", { name });
}

/**
 * Focuses a thumb and waits for the machine to enter its focused state.
 *
 * @param element - The thumb.
 * @returns A promise that resolves once the machine has settled.
 */
export async function focused(element: HTMLElement): Promise<void> {
  act(() => {
    element.focus();
  });
  await settled();
}

/**
 * Presses a key on a thumb and waits for the machine to answer.
 *
 * @param element - The thumb.
 * @param key - The key, as `KeyboardEvent.key` names it.
 * @param shiftKey - Whether Shift is held.
 * @returns A promise that resolves once the machine has settled.
 */
export async function keyed(element: HTMLElement, key: string, shiftKey = false): Promise<void> {
  fireEvent.keyDown(element, { key, shiftKey });
  await settled();
}
