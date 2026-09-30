/**
 * Builds the sliders the part specifications render, and drives them.
 */

import { type ReactElement } from "react";

import { act, fireEvent, screen } from "@testing-library/react";

import { settled } from "@stealthscale/testing-react";

import { Control } from "#slider/control.tsx";
import { DraggingIndicator } from "#slider/dragging-indicator.tsx";
import { Label } from "#slider/label.tsx";
import { MarkerGroup } from "#slider/marker-group.tsx";
import { Marker } from "#slider/marker.tsx";
import { Range } from "#slider/range.tsx";
import { Root, type RootProps } from "#slider/root.tsx";
import { Thumb } from "#slider/thumb.tsx";
import { Track } from "#slider/track.tsx";
import { ValueText } from "#slider/value-text.tsx";

/**
 * Describes how a composed slider differs from the default one.
 */
export interface Composition {
  /**
   * Whether the slider renders `Slider.Label`. Defaults to true.
   */
  readonly labelled?: boolean | undefined;
}

/**
 * Composition of the default slider.
 */
const PLAIN: Composition = {};

/**
 * Renders a volume slider at 40 with its label, value text, markers and dragging indicator, with
 * the props the case sets on the root.
 *
 * @param props - The props of the root.
 * @param composition - Whether the label renders.
 * @returns The slider.
 */
export function composed(props: RootProps = {}, composition: Composition = PLAIN): ReactElement {
  const { labelled = true } = composition;

  return (
    <Root defaultValue={[40]} {...props}>
      {labelled ? <Label>Volume</Label> : null}
      <ValueText />
      <Control>
        <Track>
          <Range />
        </Track>
        <Thumb>
          <DraggingIndicator />
        </Thumb>
        <MarkerGroup>
          <Marker value={0}>Quiet</Marker>
          <Marker value={50}>Half</Marker>
          <Marker value={100} />
        </MarkerGroup>
      </Control>
    </Root>
  );
}

/**
 * Renders a price range from 20 to 80 with a named thumb at either end, with the props the case
 * sets on the root.
 *
 * @param props - The props of the root.
 * @param composition - Whether the label renders.
 * @returns The slider.
 */
export function ranged(props: RootProps = {}, composition: Composition = PLAIN): ReactElement {
  const { labelled = true } = composition;

  return (
    <Root defaultValue={[20, 80]} {...props}>
      {labelled ? <Label>Price</Label> : null}
      <ValueText />
      <Control>
        <Track>
          <Range />
        </Track>
        <Thumb index={0} label="Minimum" />
        <Thumb index={1} label="Maximum" />
      </Control>
    </Root>
  );
}

/**
 * Returns the thumb by its accessible name.
 *
 * @param name - The thumb's accessible name, `Volume` by default.
 * @returns The element in the `slider` role.
 */
export function thumb(name: RegExp | string = "Volume"): HTMLElement {
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
 * @returns A promise that resolves once the machine has settled.
 */
export async function keyed(element: HTMLElement, key: string): Promise<void> {
  fireEvent.keyDown(element, { key });
  await settled();
}
