/**
 * Catalogue page for the colour swatch.
 *
 * @remarks
 *   `scenesOf` generates the size and shape scenes from the recipe. The mix scene is hand-written,
 *   because a caller selects a mix by the number of colours and never passes the `mix` axis. Every
 *   scene renders a component from `examples/` and shows that file as its source. The colours are
 *   the source colours of the published themes. The words are keys under `color-swatch` in the
 *   `specimen` namespace, stored in `locales/en/specimen/color-swatch.json`.
 */

import { Frame } from "@stealthscale/component-layout";
import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as mixed from "#color-swatch/examples/mixes.example.tsx";
import * as paletted from "#color-swatch/examples/palette.example.tsx";
import * as primary from "#color-swatch/examples/primary.example.tsx";
import * as sentenced from "#color-swatch/examples/sentence.example.tsx";
import * as themed from "#color-swatch/examples/themes.example.tsx";
import * as tokened from "#color-swatch/examples/tokens.example.tsx";
import * as translucent from "#color-swatch/examples/translucent.example.tsx";
import { recipe } from "#color-swatch/recipe.ts";

/**
 * Hand-written scene for a palette row.
 */
export const palette: Scene = {
  about: "color-swatch.palette.about",
  draw: paletted.Palette,
  example: paletted,
  title: "color-swatch.palette.title",
};

/**
 * Hand-written scene for a table of colour tokens.
 */
export const tokens: Scene = {
  about: "color-swatch.tokens.about",
  draw: () => (
    <Room size="sm">
      <tokened.Tokens />
    </Room>
  ),
  example: tokened,
  title: "color-swatch.tokens.title",
};

/**
 * Hand-written scene for the published themes as mixes.
 */
export const themes: Scene = {
  about: "color-swatch.themes.about",
  draw: () => (
    <Room size="md">
      <themed.Themes />
    </Room>
  ),
  example: themed,
  title: "color-swatch.themes.title",
};

/**
 * Hand-written scene for the `mix` axis, one swatch per number of colours.
 */
export const mix: Scene = {
  about: "color-swatch.mix.about",
  axes: ["mix"],
  draw: mixed.Mixes,
  example: mixed,
  title: "color-swatch.mix.title",
};

/**
 * Hand-written scene for a swatch at `inherit` size inside a sentence.
 */
export const sentence: Scene = {
  about: "color-swatch.sentence.about",
  draw: sentenced.Sentence,
  example: sentenced,
  title: "color-swatch.sentence.title",
};

/**
 * Hand-written scene for a translucent colour over the checkerboard.
 */
export const translucence: Scene = {
  about: "color-swatch.translucent.about",
  draw: translucent.Translucent,
  example: translucent,
  title: "color-swatch.translucent.title",
};

export default specimen({
  about: "color-swatch.about",
  id: "components/data/color-swatch",
  imports: 'import { ColorSwatch, ColorSwatchMix } from "@stealthscale/component-data";',
  scenes: [
    palette,
    tokens,
    themes,
    ...scenesOf<Parameters<typeof primary.Primary>[0]>(recipe, {
      axes: {
        shape: { with: { size: "xl" } },
        size: {
          draw: (props) =>
            props.size === "full" ? (
              <Room size="xs">
                <Frame ratio="landscape">
                  <primary.Primary {...props} />
                </Frame>
              </Room>
            ) : (
              <primary.Primary {...props} />
            ),
        },
      },
      draw: (props) => <primary.Primary {...props} />,
      example: primary,
      namespace: "color-swatch",
      order: ["size", "shape"],
      skip: { mix: "rendered by the mix scene, because a caller never passes the axis" },
    }),
    mix,
    sentence,
    translucence,
  ],
  title: "color-swatch.title",
});
