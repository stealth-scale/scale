/**
 * Catalogue page for the button.
 *
 * @remarks
 *   `scenesOf` generates one scene per recipe axis. The pressed and disabled scenes are
 *   hand-written, because `aria-pressed` and `disabled` are element attributes, not recipe axes.
 *   Every scene renders a component from `examples/` and shows that file as its source, and each
 *   scene labels its buttons with a different action. The words are keys under `button` in the
 *   `specimen` namespace, stored in `locales/en/specimen/button.json`.
 */

import { Matrix, type Scene, scenesOf, specimen, valuesOf } from "@stealthscale/specimen";

import * as approved from "#button/examples/approve.example.tsx";
import * as archived from "#button/examples/archive.example.tsx";
import * as bolded from "#button/examples/bold.example.tsx";
import * as celebrated from "#button/examples/celebrate.example.tsx";
import * as published from "#button/examples/publish.example.tsx";
import * as retried from "#button/examples/retry.example.tsx";
import * as uploaded from "#button/examples/upload.example.tsx";
import { recipe } from "#button/recipe.ts";

/**
 * Look values, crossed with every other axis.
 */
const LOOKS = valuesOf(recipe, "variant");

/**
 * Both values of a boolean attribute, false first.
 */
const EITHER = [false, true] as const;

/**
 * Hand-written scene for `aria-pressed` on every look.
 */
export const pressed: Scene = {
  about: "button.pressed.about",
  draw: () => (
    <Matrix across={{ knob: "variant", of: LOOKS }} knob="aria-pressed" of={EITHER}>
      {(on, variant) => <bolded.Bold aria-pressed={on} variant={variant} />}
    </Matrix>
  ),
  example: bolded,
  props: { "aria-pressed": true, variant: "solid" },
  title: "button.pressed.title",
};

/**
 * Hand-written scene for `disabled` on every look.
 */
export const disabled: Scene = {
  about: "button.disabled.about",
  draw: () => (
    <Matrix across={{ knob: "variant", of: LOOKS }} knob="disabled" of={EITHER}>
      {(off, variant) => <archived.Archive disabled={off} variant={variant} />}
    </Matrix>
  ),
  example: archived,
  props: { disabled: true, variant: "solid" },
  title: "button.disabled.title",
};

export default specimen({
  about: "button.about",
  id: "components/actions/button",
  imports: 'import { Button, IconButton } from "@stealthscale/component-actions";',
  scenes: [
    ...scenesOf<Parameters<typeof published.Publish>[0]>(recipe, {
      axes: {
        effect: {
          across: "variant",
          draw: (props) => <celebrated.Celebrate {...props} />,
          example: celebrated,
        },
        elevation: {
          across: "variant",
          draw: (props) => <uploaded.Upload {...props} />,
          example: uploaded,
        },
        palette: {
          across: "variant",
          draw: (props) => <retried.Retry {...props} />,
          example: retried,
        },
        shape: {
          across: "variant",
          draw: (props) => <approved.Approve {...props} />,
          example: approved,
        },
        variant: { across: "size" },
      },
      draw: (props) => <published.Publish {...props} />,
      example: published,
      namespace: "button",
      order: ["variant", "palette", "elevation", "effect", "shape"],
    }),
    pressed,
    disabled,
  ],
  title: "button.title",
});
