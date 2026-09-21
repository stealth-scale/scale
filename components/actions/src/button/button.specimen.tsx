/**
 * Shows the button: every axis of its recipe crossed with every look, and the two states a page
 * puts one in that no axis names.
 *
 * @remarks
 *   The axes are built from the recipe, so one added to it reaches this page without the file
 *   changing. The pressed state and the disabled state are written out, because a page states them
 *   on the element and the recipe names neither.
 *   Each scene names a different action, so a reader sees the words vary rather than one label
 *   repeated. The words are keys under `button` in the catalogue's namespace, kept beside this file
 *   in `locales/en/specimen/button.json`.
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
 * Every look the recipe draws, which every other scene crosses with its own axis.
 */
const LOOKS = valuesOf(recipe, "variant");

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * The button as a consumer writes it, which every scene on the page shows as its source, the ones
 * built from the recipe and the ones written out alike.
 */
const SAMPLE = {
  children: "Publish",
  imports: 'import { Button } from "@stealthscale/component-actions";',
  name: "Button",
};

/**
 * Draws a button beside its pressed self, in every look.
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
 * Draws a button beside its disabled self, in every look.
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
 * Draws a button naming one action, so a reader sees the words vary from scene to scene rather
 * than one label repeated down the page.
 */
function acting(says: string): (props: ButtonProps) => ReactElement {
  return function Acting(props: ButtonProps): ReactElement {
    const { t } = useWords("button");

    return <Button {...props}>{t(says)}</Button>;
  };
}

/**
 * Draws the square that holds one glyph rather than words.
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
 * A button beside its pressed self.
 */
export const pressed: Scene = {
  about: "button.pressed.about",
  draw: Pressed,
  source: written(SAMPLE, { "aria-pressed": true, variant: "solid" }),
  title: "button.pressed.title",
};

/**
 * A button beside its disabled self.
 */
export const disabled: Scene = {
  about: "button.disabled.about",
  draw: Disabled,
  source: written(SAMPLE, { disabled: true, variant: "solid" }),
  title: "button.disabled.title",
};

export default specimen({
  about: "button.about",
  group: "Actions",
  id: "actions/button",
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
