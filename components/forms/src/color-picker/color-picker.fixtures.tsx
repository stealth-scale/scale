/**
 * Builds the color pickers the part specifications render, and drives them.
 */

import { type ReactElement, type ReactNode } from "react";

import { act, fireEvent, screen } from "@testing-library/react";

import { pressed, settled } from "@stealthscale/testing-react";

import { AreaBackground } from "#color-picker/area-background.tsx";
import { AreaThumb } from "#color-picker/area-thumb.tsx";
import { Area } from "#color-picker/area.tsx";
import { ChannelInput } from "#color-picker/channel-input.tsx";
import { ChannelSliderLabel } from "#color-picker/channel-slider-label.tsx";
import { ChannelSliderThumb } from "#color-picker/channel-slider-thumb.tsx";
import { ChannelSliderTrack } from "#color-picker/channel-slider-track.tsx";
import { ChannelSliderValueText } from "#color-picker/channel-slider-value-text.tsx";
import { ChannelSlider } from "#color-picker/channel-slider.tsx";
import { Content } from "#color-picker/content.tsx";
import { Control } from "#color-picker/control.tsx";
import { Label } from "#color-picker/label.tsx";
import { Positioner } from "#color-picker/positioner.tsx";
import { Root, type RootProps } from "#color-picker/root.tsx";
import { SwatchGroup } from "#color-picker/swatch-group.tsx";
import { SwatchIndicator } from "#color-picker/swatch-indicator.tsx";
import { SwatchTrigger } from "#color-picker/swatch-trigger.tsx";
import { Swatch } from "#color-picker/swatch.tsx";
import { Trigger } from "#color-picker/trigger.tsx";
import { ValueSwatch } from "#color-picker/value-swatch.tsx";

/**
 * Describes how a composed color picker differs from the default one.
 */
export interface Composition {
  /**
   * Whether the picker renders its hex input in the control. Defaults to true.
   */
  readonly hex?: boolean | undefined;

  /**
   * Whether the picker renders `ColorPicker.Label`. Defaults to true.
   */
  readonly labelled?: boolean | undefined;

  /**
   * `aria-label` of the trigger, or nothing.
   */
  readonly named?: string | undefined;

  /**
   * Parts the panel renders in place of the area, the hue and alpha sliders and the swatches.
   */
  readonly panel?: ReactNode;
}

/**
 * Composition of the default color picker.
 */
const PLAIN: Composition = {};

/**
 * Renders the default panel: the area, a hue slider with its label and value text, an alpha
 * slider, and a group of a blue and a red swatch.
 *
 * @returns The parts of the panel.
 */
export function panel(): ReactElement {
  return (
    <>
      <Area>
        <AreaBackground />
        <AreaThumb />
      </Area>
      <ChannelSlider channel="hue">
        <ChannelSliderLabel>Hue</ChannelSliderLabel>
        <ChannelSliderValueText />
        <ChannelSliderTrack>
          <ChannelSliderThumb />
        </ChannelSliderTrack>
      </ChannelSlider>
      <ChannelSlider channel="alpha">
        <ChannelSliderTrack>
          <ChannelSliderThumb />
        </ChannelSliderTrack>
      </ChannelSlider>
      <SwatchGroup aria-label="Presets">
        <SwatchTrigger label="Blue" value="#2563EB">
          <Swatch />
          <SwatchIndicator>
            <svg aria-hidden="true" />
          </SwatchIndicator>
        </SwatchTrigger>
        <SwatchTrigger label="Red" value="#DC2626">
          <Swatch />
          <SwatchIndicator>
            <svg aria-hidden="true" />
          </SwatchIndicator>
        </SwatchTrigger>
      </SwatchGroup>
    </>
  );
}

/**
 * Renders a brand color picker at `#2563EB`, with the props the case sets on the root.
 *
 * @param props - The props of the root.
 * @param composition - Whether the label and the hex input render, the trigger's `aria-label`,
 *   and the parts of the panel.
 * @returns The color picker.
 */
export function picker(
  props: Partial<RootProps> = {},
  composition: Composition = PLAIN,
): ReactElement {
  const { hex = true, labelled = true, named } = composition;

  return (
    <Root defaultValue="#2563EB" {...props}>
      {labelled ? <Label>Brand color</Label> : null}
      <Control>
        {hex ? <ChannelInput channel="hex" /> : null}
        <Trigger aria-label={named}>
          <ValueSwatch />
        </Trigger>
      </Control>
      <Positioner>
        <Content>{composition.panel ?? panel()}</Content>
      </Positioner>
    </Root>
  );
}

/**
 * Waits one animation frame inside `act`, for the machine's deferred focus and positioning.
 *
 * @returns A promise that resolves after the frame.
 */
export async function framed(): Promise<void> {
  await act(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          resolve();
        });
      }),
  );
}

/**
 * Returns the trigger, found by its class.
 *
 * @returns The trigger element.
 */
export function trigger(): HTMLButtonElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- every case that reads it renders one
  return document.querySelector(".color-picker__trigger") as HTMLButtonElement;
}

/**
 * Presses the trigger and waits for the machine to open the panel and focus its first control.
 *
 * @returns A promise that resolves once the panel is open.
 */
export async function opened(): Promise<void> {
  await pressed(trigger());
  await settled();
  await framed();
}

/**
 * Presses a key on an element and waits for the machine.
 *
 * @param element - The element with focus.
 * @param key - The key's name.
 * @param shiftKey - Whether Shift is held.
 * @returns A promise that resolves once the machine has settled.
 */
export async function keyed(element: Element, key: string, shiftKey = false): Promise<void> {
  fireEvent.keyDown(element, { key, shiftKey });
  await settled();
  await framed();
}

/**
 * Returns the slider named by the words given.
 *
 * @param name - The slider's accessible name.
 * @returns The slider element.
 */
export function slider(name: string): HTMLElement {
  return screen.getByRole("slider", { name });
}

/**
 * Returns the hidden input inside a render.
 *
 * @param container - The render's container.
 * @returns The input element.
 */
export function hiddenOf(container: HTMLElement): HTMLInputElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- every case that reads it renders one
  return container.querySelector('input[aria-hidden="true"]') as HTMLInputElement;
}
