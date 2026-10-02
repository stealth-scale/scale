/**
 * Catalogue page for the swap.
 *
 * @remarks
 *   `scenesOf` generates the motion scene from the mute example, whose button turns the mark over.
 *   The other scenes are hand-written: the states matrix shows both marks at rest, and the mute,
 *   playback and follow scenes each show one example. The mute and playback buttons render in a
 *   `Sample`, because a lone control in a scene card stretches to the card's width. The words are
 *   keys under `swap` in `locales/en/specimen/swap.json`.
 */

import { Matrix, Sample, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as follow from "#swap/examples/follow.example.tsx";
import * as marks from "#swap/examples/marks.example.tsx";
import * as mute from "#swap/examples/mute.example.tsx";
import * as playback from "#swap/examples/playback.example.tsx";
import type * as Swap from "#swap/index.ts";
import { recipe } from "#swap/recipe.ts";

/**
 * Values of `swap` the states scene shows.
 */
const SWAPS = [false, true] as const;

/**
 * Hand-written scene for both marks at rest.
 */
export const states: Scene = {
  about: "swap.states.about",
  draw: () => (
    <Matrix knob="swap" of={SWAPS}>
      {(swap) => <marks.Marks swap={swap} />}
    </Matrix>
  ),
  example: marks,
  props: { swap: false },
  title: "swap.states.title",
};

/**
 * Hand-written scene for a toggle button that keeps one name.
 */
export const toggle: Scene = {
  about: "swap.mute.about",
  draw: () => (
    <Sample>
      <mute.Mute />
    </Sample>
  ),
  example: mute,
  title: "swap.mute.title",
};

/**
 * Hand-written scene for a button whose name follows the mark.
 */
export const named: Scene = {
  about: "swap.playback.about",
  draw: () => (
    <Sample>
      <playback.Playback />
    </Sample>
  ),
  example: playback,
  title: "swap.playback.title",
};

/**
 * Hand-written scene for two words in one place.
 */
export const words: Scene = {
  about: "swap.follow.about",
  draw: follow.Follow,
  example: follow,
  title: "swap.follow.title",
};

export default specimen({
  about: "swap.about",
  id: "components/actions/swap",
  imports: 'import { Swap } from "@stealthscale/component-actions";',
  scenes: [
    states,
    toggle,
    named,
    words,
    ...scenesOf<Swap.RootProps>(recipe, {
      draw: (props) => <mute.Mute {...props} />,
      example: mute,
      namespace: "swap",
    }),
  ],
  title: "swap.title",
});
