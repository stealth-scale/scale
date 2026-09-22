/**
 * Lays out the catalogue page for the button.
 *
 * @remarks
 *   The axis scenes are generated from the recipe, so a variant added there appears here without an
 *   edit to this file. The pressed and disabled scenes are written by hand because a caller sets
 *   both as attributes on the element and the recipe declares neither as an axis. Each scene labels
 *   its buttons with a different action to keep one word from repeating down the page; the labels
 *   are keys under `button` in the catalogue namespace, held beside this file in
 *   `locales/en/specimen/button.json`.
 */

import { type ReactElement } from "react";

import { CheckIcon } from "lucide-react";

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
 * The variant values that form the second dimension of every other scene.
 */
const LOOKS = valuesOf(recipe, "variant");

/**
 * Both values of a boolean prop, off first.
 */
const EITHER = [false, true] as const;

/**
 * The call site every scene's source snippet is generated from, whether the scene is generated or
 * hand-written.
 */
const SAMPLE = {
  children: "Publish",
  imports: 'import { Button } from "@stealthscale/component-actions";',
  name: "Button",
};

/**
 * Renders a matrix of every look against `aria-pressed` set and unset.
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
 * Renders a matrix of every look against `disabled` set and unset.
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
 * Builds a scene renderer whose buttons all carry the same action as their label.
 *
 * @param says - The translation key, not the label itself.
 */
function acting(says: string): (props: ButtonProps) => ReactElement {
  return function Acting(props: ButtonProps): ReactElement {
    const { t } = useWords("button");

    return <Button {...props}>{t(says)}</Button>;
  };
}

/**
 * Renders an icon button holding a check mark, forwarding only the axes a scene set.
 *
 * @remarks
 *   An axis the scene left out is omitted from the element rather than passed as `undefined`, so
 *   the icon button's own defaults still apply to it.
 */
function Glyph({ shape, size, variant }: ButtonProps): ReactElement {
  const { t } = useWords("button");

  return (
    <IconButton
      aria-label={t("approve")}
      {...(shape === undefined ? {} : { shape })}
      {...(size === undefined ? {} : { size })}
      {...(variant === undefined ? {} : { variant })}
    >
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
        shape: { across: "variant", draw: (props) => <Glyph {...props} /> },
        status: { across: "variant", draw: acting("retry") },
        variant: { across: "size" },
      },
      draw: acting("publish"),
      namespace: "button",
      order: ["variant", "status", "elevation", "effect", "shape"],
      sample: SAMPLE,
    }),
    pressed,
    disabled,
  ],
  title: "button.title",
});
