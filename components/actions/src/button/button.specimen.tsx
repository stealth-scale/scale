/**
 * Catalogues the button: one scene per recipe axis, and the pressed and disabled states.
 *
 * @remarks
 *   The axis scenes are generated from the recipe, so a value added there reaches the page without
 *   an edit here. The pressed and disabled scenes are written by hand, because `aria-pressed` and
 *   `disabled` are element attributes, not recipe axes. Each scene labels its buttons with a
 *   different action. The words are keys under `button` in the catalogue namespace, stored at
 *   `locales/en/specimen/button.json`.
 */

import { type ReactElement } from "react";

import { CheckIcon } from "lucide-react";

import { omitUndefined } from "@stealthscale/hooks";
import {
  Matrix,
  type Scene,
  scenesOf,
  specimen,
  useWords,
  valuesOf,
  written,
} from "@stealthscale/specimen";

import { Button, type ButtonProps } from "#button/button.ts";
import { IconButton } from "#button/icon-button.ts";
import { recipe } from "#button/recipe.ts";

/**
 * The look values, crossed with every other axis.
 */
const LOOKS = valuesOf(recipe, "variant");

/**
 * Both values of a boolean attribute, false first.
 */
const EITHER = [false, true] as const;

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: "Publish",
  imports: 'import { Button } from "@stealthscale/component-actions";',
  name: "Button",
};

/**
 * Renders every look with `aria-pressed` unset and set.
 */
function Pressed(): ReactElement {
  const { t } = useWords("button");

  return (
    <Matrix across={{ knob: "variant", of: LOOKS }} knob="aria-pressed" of={EITHER}>
      {(pressed, variant) => (
        <Button aria-pressed={pressed} variant={variant}>
          {t("bold")}
        </Button>
      )}
    </Matrix>
  );
}

/**
 * Renders every look with `disabled` unset and set.
 */
function Disabled(): ReactElement {
  const { t } = useWords("button");

  return (
    <Matrix across={{ knob: "variant", of: LOOKS }} knob="disabled" of={EITHER}>
      {(disabled, variant) => (
        <Button disabled={disabled} variant={variant}>
          {t("archive")}
        </Button>
      )}
    </Matrix>
  );
}

/**
 * Returns a scene renderer whose buttons all show the same action label.
 *
 * @param says - The translation key of the label.
 */
function acting(says: string): (props: ButtonProps) => ReactElement {
  return function Acting(props: ButtonProps): ReactElement {
    const { t } = useWords("button");

    return <Button {...props}>{t(says)}</Button>;
  };
}

/**
 * Renders an icon button holding a check mark, with only the axes the scene sets.
 *
 * @remarks
 *   An axis the scene leaves unset is omitted rather than passed as `undefined`, so the icon
 *   button's own `shape` default still applies.
 */
function Glyph({ shape, size, variant }: ButtonProps): ReactElement {
  const { t } = useWords("button");

  return (
    <IconButton aria-label={t("approve")} {...omitUndefined({ shape, size, variant })}>
      <CheckIcon size="1em" />
    </IconButton>
  );
}

/**
 * The hand-written scene for the pressed state.
 */
export const pressed: Scene = {
  about: "button.pressed.about",
  draw: Pressed,
  source: written(SAMPLE, { "aria-pressed": true, variant: "solid" }),
  title: "button.pressed.title",
};

/**
 * The hand-written scene for the disabled state.
 */
export const disabled: Scene = {
  about: "button.disabled.about",
  draw: Disabled,
  source: written(SAMPLE, { disabled: true, variant: "solid" }),
  title: "button.disabled.title",
};

export default specimen({
  about: "button.about",
  id: "components/actions/button",
  imports: 'import { Button, IconButton } from "@stealthscale/component-actions";',
  scenes: [
    ...scenesOf<ButtonProps>(recipe, {
      axes: {
        effect: { across: "variant", draw: acting("celebrate") },
        elevation: { across: "variant", draw: acting("upload") },
        palette: { across: "variant", draw: acting("retry") },
        shape: { across: "variant", draw: (props) => <Glyph {...props} /> },
        variant: { across: "size" },
      },
      draw: acting("publish"),
      namespace: "button",
      order: ["variant", "palette", "elevation", "effect", "shape"],
      sample: SAMPLE,
    }),
    pressed,
    disabled,
  ],
  title: "button.title",
});
