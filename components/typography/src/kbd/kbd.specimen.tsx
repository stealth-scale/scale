/**
 * Catalogue page for the keycap.
 *
 * @remarks
 *   `scenesOf` generates the look scene, crossed with the size axis, and the palette scene, crossed
 *   with the look axis. Hand-written scenes render the modifier and named keys, a combination
 *   inside a line of body text, and a list of commands with their combinations in a 384px room.
 *   Every scene renders a component from `examples/` and shows that file as its source. Key labels
 *   are literal and the other words are keys under `kbd` in `locales/en/specimen/kbd.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as escape from "#kbd/examples/escape.example.tsx";
import * as keys from "#kbd/examples/keys.example.tsx";
import * as sentence from "#kbd/examples/sentence.example.tsx";
import * as shortcuts from "#kbd/examples/shortcuts.example.tsx";
import { recipe } from "#kbd/recipe.ts";

/**
 * Hand-written scene for the modifier and named keys.
 */
export const named: Scene = {
  about: "kbd.keys.about",
  draw: keys.Keys,
  example: keys,
  title: "kbd.keys.title",
};

/**
 * Hand-written scene for a combination inside a line of body text.
 */
export const inline: Scene = {
  about: "kbd.sentence.about",
  draw: sentence.Sentence,
  example: sentence,
  title: "kbd.sentence.title",
};

/**
 * Hand-written scene for a list of commands in a 384px room.
 */
export const listed: Scene = {
  about: "kbd.shortcuts.about",
  draw: () => (
    <Room size="sm">
      <shortcuts.Shortcuts />
    </Room>
  ),
  example: shortcuts,
  title: "kbd.shortcuts.title",
};

export default specimen({
  about: "kbd.about",
  id: "components/typography/kbd",
  imports: 'import { Kbd } from "@stealthscale/component-typography";',
  scenes: [
    ...scenesOf<Parameters<typeof escape.Escape>[0]>(recipe, {
      axes: {
        palette: { across: "variant" },
        variant: { across: "size" },
      },
      draw: (props) => <escape.Escape {...props} />,
      example: escape,
      namespace: "kbd",
      order: ["variant", "palette"],
    }),
    named,
    inline,
    listed,
  ],
  title: "kbd.title",
});
