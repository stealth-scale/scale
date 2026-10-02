/**
 * Catalogue page for the switch.
 *
 * @remarks
 *   `scenesOf` generates the looks by sizes, palettes and statuses by looks, corners, alignment and
 *   spread scenes, each from an example, with the switch checked so the fill shows. The alignment
 *   scene renders in a room of a sidebar's width, so the label wraps. The states scene is
 *   hand-written, because off, on, invalid and disabled are props of the root and not recipe axes.
 *   The channels scene shows switches inside a fieldset that sets their size, and the field scene
 *   shows a switch described by a field's helper text. Every scene renders a component from
 *   `examples/` and shows that file as its source. The words are keys under `switch` in
 *   `locales/en/specimen/switch.json`.
 */

import { Matrix, Room, type Scene, scenesOf, specimen, valuesOf } from "@stealthscale/specimen";

import * as examples from "#switch/examples/index.ts";
import type * as Switch from "#switch/index.ts";
import { recipe } from "#switch/recipe.ts";

/**
 * States of the states scene, in reading order.
 */
const STATES = ["off", "on", "invalid", "disabled"] as const;

/**
 * Maps each state to the root props that put the switch in it.
 */
const STATED: Readonly<Record<(typeof STATES)[number], Switch.RootProps>> = {
  disabled: { defaultChecked: true, disabled: true },
  invalid: { defaultChecked: false, invalid: true },
  off: { defaultChecked: false },
  on: { defaultChecked: true },
};

/**
 * Looks the states scene crosses the states with.
 */
const LOOKS = valuesOf(recipe, "variant");

/**
 * Hand-written scene for off, on, invalid and disabled in every look.
 */
export const states: Scene = {
  about: "switch.states.about",
  draw: () => (
    <Matrix across={{ knob: "variant", of: LOOKS }} knob="state" of={STATES}>
      {(state, variant) => <examples.theme.Theme {...STATED[state]} variant={variant} />}
    </Matrix>
  ),
  example: examples.theme,
  props: { defaultChecked: false, variant: "outline" },
  title: "switch.states.title",
};

/**
 * Hand-written scene for three switches inside a fieldset.
 */
export const channels: Scene = {
  about: "switch.group.about",
  draw: () => (
    <Room size="sm">
      <examples.channels.Channels />
    </Room>
  ),
  example: examples.channels,
  title: "switch.group.title",
};

/**
 * Hand-written scene for a switch inside a field.
 */
export const sync: Scene = {
  about: "switch.field.about",
  draw: () => (
    <Room size="sm">
      <examples.sync.Sync />
    </Room>
  ),
  example: examples.sync,
  title: "switch.field.title",
};

export default specimen({
  about: "switch.about",
  id: "components/forms/switch",
  imports: 'import { Switch } from "@stealthscale/component-forms";',
  scenes: [
    ...scenesOf<Switch.RootProps>(recipe, {
      axes: {
        align: {
          draw: (props) => (
            <Room size="xs">
              <examples.session.Session {...props} />
            </Room>
          ),
          example: examples.session,
        },
        palette: { across: "variant" },
        spread: {
          direction: "column",
          draw: (props) => <examples.setting.Setting {...props} />,
          example: examples.setting,
        },
        status: { across: "variant" },
        variant: { across: "size" },
      },
      draw: (props) => <examples.theme.Theme {...props} />,
      example: examples.theme,
      namespace: "switch",
      order: ["variant", "palette", "status", "radius", "align", "spread"],
    }),
    states,
    channels,
    sync,
  ],
  title: "switch.title",
});
