/**
 * Catalogue page for the color picker.
 *
 * @remarks
 *   `scenesOf` generates the size, look and status scenes from a brand color field, each in a room
 *   at the `xs` measure, because a color picker fills its container. Hand-written scenes render
 *   swatches alone, a trigger that shows its value, a panel always on the page, a slider and an
 *   input per channel, a picker in a validated field, and the disabled, read-only and invalid
 *   states. Every floating panel renders closed and portalled, and a reader opens one to see its
 *   area, sliders and swatches. The words are keys under `color-picker` in
 *   `locales/en/specimen/color-picker.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as accent from "#color-picker/examples/accent.example.tsx";
import * as brand from "#color-picker/examples/brand.example.tsx";
import * as channels from "#color-picker/examples/channels.example.tsx";
import * as labels from "#color-picker/examples/labels.example.tsx";
import * as primary from "#color-picker/examples/primary.example.tsx";
import * as states from "#color-picker/examples/states.example.tsx";
import * as theme from "#color-picker/examples/theme.example.tsx";
import { type RootProps } from "#color-picker/index.ts";
import { recipe } from "#color-picker/recipe.ts";

/**
 * Hand-written scene for a picker of swatches alone.
 */
export const swatches: Scene = {
  about: "color-picker.swatches.about",
  draw: () => (
    <Room size="xs">
      <labels.Labels />
    </Room>
  ),
  example: labels,
  title: "color-picker.swatches.title",
};

/**
 * Hand-written scene for a trigger that shows its value.
 */
export const valued: Scene = {
  about: "color-picker.valued.about",
  draw: () => (
    <Room size="xs">
      <accent.Accent />
    </Room>
  ),
  example: accent,
  title: "color-picker.valued.title",
};

/**
 * Hand-written scene for a panel always on the page.
 */
export const inline: Scene = {
  about: "color-picker.inline.about",
  draw: () => (
    <Room size="xs">
      <theme.Theme />
    </Room>
  ),
  example: theme,
  title: "color-picker.inline.title",
};

/**
 * Hand-written scene for a slider and an input per channel of the format in force.
 */
export const channelled: Scene = {
  about: "color-picker.channelled.about",
  draw: () => (
    <Room size="xs">
      <channels.Channels />
    </Room>
  ),
  example: channels,
  title: "color-picker.channelled.title",
};

/**
 * Hand-written scene for a picker in a validated field of a form.
 */
export const validated: Scene = {
  about: "color-picker.validated.about",
  draw: () => (
    <Room size="xs">
      <primary.Primary />
    </Room>
  ),
  example: primary,
  title: "color-picker.validated.title",
};

/**
 * Hand-written scene for the disabled, read-only and invalid states.
 */
export const stated: Scene = {
  about: "color-picker.stated.about",
  draw: () => (
    <Room size="xs">
      <states.States />
    </Room>
  ),
  example: states,
  title: "color-picker.stated.title",
};

export default specimen({
  about: "color-picker.about",
  id: "components/forms/color-picker",
  imports: 'import { ColorPicker } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<RootProps>(recipe, {
      draw: (props) => (
        <Room size="xs">
          <brand.Brand {...props} />
        </Room>
      ),
      example: brand,
      namespace: "color-picker",
      order: ["size", "variant", "status"],
    }),
    swatches,
    valued,
    inline,
    channelled,
    validated,
    stated,
  ],
  title: "color-picker.title",
});
