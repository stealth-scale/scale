/**
 * Catalogue page for the slider.
 *
 * @remarks
 *   `scenesOf` generates the looks, sizes and palettes scenes from the recipe over a volume.
 *   Hand-written scenes show the states, a price range, storage tiers on marks, seats in a field
 *   with a derived total, a balance from the centre, a vertical equalizer, an opacity with its
 *   value while dragging, and a volume right to left. Every drawing is in a room of a phone's
 *   width. The page imports the parts' barrel as a type, so the props reader finds the parts. The
 *   words are keys under `slider` in `locales/en/specimen/slider.json`.
 */

import { type ReactElement, type ReactNode, useEffect, useState } from "react";

import { Matrix, Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#slider/examples/index.ts";
import type * as Slider from "#slider/index.ts";
import { recipe } from "#slider/recipe.ts";

/**
 * States of the states scene, in reading order.
 */
const STATES = ["disabled", "readOnly", "invalid"] as const;

/**
 * Maps each state to the root props that put the slider in it.
 */
const STATED: Readonly<Record<(typeof STATES)[number], Slider.RootProps>> = {
  disabled: { disabled: true },
  invalid: { invalid: true },
  readOnly: { readOnly: true },
};

/**
 * Renders its children and shows every dragging indicator inside them.
 *
 * @remarks
 *   The machine shows the indicator only while a pointer drags its thumb. Showing it is staging,
 *   so it never appears in an example.
 */
function Dragged({ children }: { readonly children: ReactNode }): ReactElement {
  const [box, setBox] = useState<HTMLDivElement | null>(null);

  useEffect((): (() => void) | undefined => {
    const bubbles = [...(box?.querySelectorAll<HTMLElement>(".slider__dragging-indicator") ?? [])];

    for (const bubble of bubbles) bubble.hidden = false;

    return () => {
      for (const bubble of bubbles) bubble.hidden = true;
    };
  }, [box]);

  return <div ref={setBox}>{children}</div>;
}

/**
 * Hand-written scene for a disabled, a read-only and an invalid slider.
 */
export const states: Scene = {
  about: "slider.states.about",
  draw: () => (
    <Matrix direction="column" knob="state" of={STATES}>
      {(state) => (
        <Room size="sm">
          <examples.volume.Volume {...STATED[state]} />
        </Room>
      )}
    </Matrix>
  ),
  example: examples.volume,
  props: { invalid: true },
  title: "slider.states.title",
};

/**
 * Hand-written scene for an opacity with its value above the thumb.
 */
export const dragging: Scene = {
  about: "slider.dragging.about",
  draw: () => (
    <Room size="sm">
      <Dragged>
        <examples.opacity.Opacity />
      </Dragged>
    </Room>
  ),
  example: examples.opacity,
  title: "slider.dragging.title",
};

/**
 * Hand-written scene for a volume in a right-to-left document.
 */
export const rtl: Scene = {
  about: "slider.rtl.about",
  draw: () => (
    <div dir="rtl">
      <Room size="sm">
        <examples.volume.Volume dir="rtl" />
      </Room>
    </div>
  ),
  example: examples.volume,
  props: { dir: "rtl" },
  title: "slider.rtl.title",
};

/**
 * Returns a hand-written scene that renders one example in a room of a phone's width.
 *
 * @param key - The scene's key under `slider`.
 * @param example - The example module the scene shows as its source.
 * @param Drawing - The example's component.
 * @returns The scene.
 */
function roomed(key: string, example: object, Drawing: () => ReactElement): Scene {
  return {
    about: `slider.${key}.about`,
    draw: () => (
      <Room size="sm">
        <Drawing />
      </Room>
    ),
    example,
    title: `slider.${key}.title`,
  };
}

export default specimen({
  about: "slider.about",
  id: "components/forms/slider",
  imports: 'import { Slider } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<Slider.RootProps>(recipe, {
      axes: { size: { direction: "column" }, variant: { direction: "column" } },
      draw: (props) => (
        <Room size="sm">
          <examples.volume.Volume {...props} />
        </Room>
      ),
      example: examples.volume,
      namespace: "slider",
      order: ["variant", "size", "palette"],
    }),
    states,
    roomed("range", examples.price, examples.price.Price),
    roomed("marks", examples.storage, examples.storage.Storage),
    roomed("controlled", examples.seats, examples.seats.Seats),
    roomed("origin", examples.balance, examples.balance.Balance),
    roomed("vertical", examples.equalizer, examples.equalizer.Equalizer),
    dragging,
    rtl,
  ],
  title: "slider.title",
});
