/**
 * Catalogue page for the spinner.
 *
 * @remarks
 *   `scenesOf` generates one scene per recipe axis. The inline and button scenes are hand-written,
 *   because they vary the text size and the button look, which are not spinner axes. Every scene
 *   renders a component from `examples/` and shows that file as its source. The words are keys
 *   under `spinner` in `locales/en/specimen/spinner.json`.
 */

import { Matrix, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as busy from "#spinner/examples/busy.example.tsx";
import * as saving from "#spinner/examples/saving.example.tsx";
import * as turning from "#spinner/examples/turning.example.tsx";
import { recipe } from "#spinner/recipe.ts";

/**
 * Body text sizes of the inline scene.
 */
const TEXT_SIZES = ["sm", "md", "lg"] as const;

/**
 * Button looks of the button scene, from filled to outlined.
 */
const LOOKS = ["solid", "subtle", "outline"] as const;

/**
 * Hand-written scene for a spinner at `inherit` next to text at three body sizes.
 */
export const inline: Scene = {
  about: "spinner.inline.about",
  draw: () => (
    <Matrix knob="size" of={TEXT_SIZES}>
      {(size) => <saving.Saving size={size} />}
    </Matrix>
  ),
  example: saving,
  props: { size: "sm" },
  title: "spinner.inline.title",
};

/**
 * Hand-written scene for a spinner at `inherit` in a disabled button in three looks.
 */
export const button: Scene = {
  about: "spinner.button.about",
  draw: () => (
    <Matrix knob="variant" of={LOOKS}>
      {(variant) => <busy.Busy variant={variant} />}
    </Matrix>
  ),
  example: busy,
  props: { variant: "solid" },
  title: "spinner.button.title",
};

export default specimen({
  about: "spinner.about",
  id: "components/feedback/spinner",
  imports: 'import { Spinner } from "@stealthscale/component-feedback";',
  scenes: [
    ...scenesOf<Parameters<typeof turning.Turning>[0]>(recipe, {
      axes: {
        effect: { across: "palette", with: { size: "lg" } },
        palette: { with: { size: "lg" } },
        stroke: { with: { size: "lg" } },
        track: { with: { palette: "primary", size: "lg" } },
      },
      draw: (props) => <turning.Turning {...props} />,
      example: turning,
      namespace: "spinner",
      order: ["size", "palette", "stroke", "track", "effect"],
    }),
    inline,
    button,
  ],
  title: "spinner.title",
});
