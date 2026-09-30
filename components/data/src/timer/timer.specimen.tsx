/**
 * Catalogue page for the timer.
 *
 * @remarks
 *   `scenesOf` generates the sizes, the looks, the palettes and the effects from a running offer
 *   countdown, the palettes in the subtle look and the effects in the outline look. The
 *   hand-written scenes show a stopwatch, a pomodoro with a progress bar, a countdown in days and a
 *   resend wait, each in a 448px room. The words are keys under `timer` in
 *   `locales/en/specimen/timer.json`.
 */

import { type ReactElement } from "react";

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#timer/examples/index.ts";
import type * as Timer from "#timer/index.ts";
import { recipe } from "#timer/recipe.ts";

/**
 * Builds a hand-written scene for one example in a 448px room.
 *
 * @param name - The key of the scene's words under `timer`.
 * @param example - The example module.
 * @param Drawn - The example's component.
 * @returns The scene.
 */
function roomed(name: string, example: Scene["example"], Drawn: () => ReactElement): Scene {
  return {
    about: `timer.${name}.about`,
    draw: () => (
      <Room size="md">
        <Drawn />
      </Room>
    ),
    example,
    title: `timer.${name}.title`,
  };
}

export default specimen({
  about: "timer.about",
  id: "components/data/timer",
  imports: 'import { Timer } from "@stealthscale/component-data";',
  scenes: [
    ...scenesOf<Timer.RootProps>(recipe, {
      axes: {
        effect: { with: { variant: "outline" } },
        palette: { with: { variant: "subtle" } },
        size: { direction: "row" },
      },
      draw: (props) => <examples.offer.Offer {...props} />,
      example: examples.offer,
      namespace: "timer",
      order: ["size", "variant", "palette", "effect"],
    }),
    roomed("stopwatch", examples.stopwatch, examples.stopwatch.Stopwatch),
    roomed("pomodoro", examples.pomodoro, examples.pomodoro.Pomodoro),
    roomed("launch", examples.launch, examples.launch.Launch),
    roomed("resend", examples.resend, examples.resend.Resend),
  ],
  title: "timer.title",
});
