/**
 * Shows the button: every axis of its recipe crossed with every look, the square that holds one
 * glyph, and the two states a page puts it in.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme or to the recipe reaches the
 *   page without this file changing. Each scene names a different action, so a reader sees the
 *   words vary rather than one label repeated. The words are keys under `button` in the catalogue's
 *   namespace, kept beside this file in `locales/en/specimen/button.json`.
 */

import { type ReactElement } from "react";

import { Icon } from "@stealthscale/component-typography";
import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import { Button } from "#button/button.ts";
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
 * The path of the check mark the square buttons hold, in a 24 unit box.
 */
const CHECK = "M20 6 9 17l-5-5";

/**
 * Draws every look at every size.
 */
function Looks(): ReactElement {
  const { t } = useWords("button");

  return (
    <Matrix across={{ knob: "size", of: valuesOf(recipe, "size") }} knob="variant" of={LOOKS}>
      {(variant, size) => (
        <Button size={size} variant={variant}>
          {t("publish")}
        </Button>
      )}
    </Matrix>
  );
}

/**
 * Draws every status in every look.
 */
function Statuses(): ReactElement {
  const { t } = useWords("button");

  return (
    <Matrix across={{ knob: "variant", of: LOOKS }} knob="status" of={valuesOf(recipe, "status")}>
      {(status, variant) => (
        <Button status={status} variant={variant}>
          {t("retry")}
        </Button>
      )}
    </Matrix>
  );
}

/**
 * Draws both elevations in every look.
 */
function Elevation(): ReactElement {
  const { t } = useWords("button");

  return (
    <Matrix
      across={{ knob: "variant", of: LOOKS }}
      knob="elevation"
      of={valuesOf(recipe, "elevation")}
    >
      {(elevation, variant) => (
        <Button elevation={elevation} variant={variant}>
          {t("upload")}
        </Button>
      )}
    </Matrix>
  );
}

/**
 * Draws the glow in every look.
 */
function Effects(): ReactElement {
  const { t } = useWords("button");

  return (
    <Matrix across={{ knob: "variant", of: LOOKS }} knob="effect" of={valuesOf(recipe, "effect")}>
      {(effect, variant) => (
        <Button effect={effect} variant={variant}>
          {t("celebrate")}
        </Button>
      )}
    </Matrix>
  );
}

/**
 * Draws the square that holds one glyph, at every size in every look.
 */
function Square(): ReactElement {
  const { t } = useWords("button");

  return (
    <Matrix across={{ knob: "variant", of: LOOKS }} knob="size" of={valuesOf(recipe, "size")}>
      {(size, variant) => (
        <IconButton aria-label={t("approve")} size={size} variant={variant}>
          <Icon viewBox="0 0 24 24">
            <path d={CHECK} fill="none" stroke="currentColor" strokeWidth="2" />
          </Icon>
        </IconButton>
      )}
    </Matrix>
  );
}

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
 * Every look at every size.
 */
export const looks: Scene = {
  about: "button.looks.about",
  draw: Looks,
  title: "button.looks.title",
};

/**
 * Every status in every look.
 */
export const statuses: Scene = {
  about: "button.statuses.about",
  draw: Statuses,
  title: "button.statuses.title",
};

/**
 * Both elevations in every look.
 */
export const elevation: Scene = {
  about: "button.elevation.about",
  draw: Elevation,
  title: "button.elevation.title",
};

/**
 * The glow in every look.
 */
export const effects: Scene = {
  about: "button.effects.about",
  draw: Effects,
  title: "button.effects.title",
};

/**
 * The square that holds one glyph.
 */
export const square: Scene = {
  about: "button.square.about",
  draw: Square,
  title: "button.square.title",
};

/**
 * The pressed state.
 */
export const pressed: Scene = {
  about: "button.pressed.about",
  draw: Pressed,
  title: "button.pressed.title",
};

/**
 * The disabled state.
 */
export const disabled: Scene = {
  about: "button.disabled.about",
  draw: Disabled,
  title: "button.disabled.title",
};

export default specimen({
  about: "button.about",
  group: "Actions",
  id: "actions/button",
  scenes: [looks, statuses, elevation, effects, square, pressed, disabled],
  title: "button.title",
});
