/**
 * Shows the button: every look at every size, the statuses in the looks that draw them, the two
 * elevations, the square that holds one glyph, and the disabled state.
 *
 * @remarks
 *   Every axis is drawn from the vocabulary's own list, so a look or a size added to the theme
 *   reaches the page without this file changing. The words are keys under `button` in the
 *   catalogue's namespace, kept beside this file in `locales/en/specimen/button.json`.
 */

import { type ReactElement } from "react";

import { Icon } from "@stealthscale/component-typography";
import { Matrix, type Scene, specimen, useWords } from "@stealthscale/specimen";
import { LIFTED, LOOKS, SCALE, STATUSES } from "@stealthscale/theme/authoring";

import { Button } from "#button/button.ts";
import { IconButton } from "#button/icon-button.ts";

/**
 * The looks the vocabulary offers, and the glass the button's recipe adds beside them.
 */
const VARIANTS = [...LOOKS, "glass"] as const;

/**
 * The looks a status is shown in: the three that draw the palette as a fill or an edge.
 */
const SHOWN = ["solid", "subtle", "outline"] as const;

/**
 * The two answers to `disabled`.
 */
const DISABLED = [false, true] as const;

/**
 * The path of the check mark the square buttons hold.
 */
const CHECK = "M20 6 9 17l-5-5";

/**
 * Draws every look at every size.
 */
function Looks(): ReactElement {
  const { t } = useWords("button");

  return (
    <Matrix across={{ knob: "size", of: SCALE }} knob="variant" of={VARIANTS}>
      {(variant, size) => (
        <Button size={size} variant={variant}>
          {t("publish")}
        </Button>
      )}
    </Matrix>
  );
}

/**
 * Draws every status in the looks that show it.
 */
function Statuses(): ReactElement {
  const { t } = useWords("button");

  return (
    <Matrix across={{ knob: "variant", of: SHOWN }} knob="status" of={STATUSES}>
      {(status, variant) => (
        <Button status={status} variant={variant}>
          {t("retry")}
        </Button>
      )}
    </Matrix>
  );
}

/**
 * Draws the two elevations.
 */
function Elevation(): ReactElement {
  const { t } = useWords("button");

  return (
    <Matrix knob="elevation" of={LIFTED}>
      {(elevation) => <Button elevation={elevation}>{t("publish")}</Button>}
    </Matrix>
  );
}

/**
 * Draws the square that holds one glyph, at every size.
 */
function Square(): ReactElement {
  const { t } = useWords("button");

  return (
    <Matrix knob="size" of={SCALE}>
      {(size) => (
        <IconButton aria-label={t("approve")} size={size}>
          <Icon viewBox="0 0 24 24">
            <path d={CHECK} fill="none" stroke="currentColor" strokeWidth="2" />
          </Icon>
        </IconButton>
      )}
    </Matrix>
  );
}

/**
 * Draws a button beside its disabled self.
 */
function States(): ReactElement {
  const { t } = useWords("button");

  return (
    <Matrix knob="disabled" of={DISABLED}>
      {(disabled) => <Button disabled={disabled}>{t("publish")}</Button>}
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
 * Every status in the looks that show it.
 */
export const statuses: Scene = {
  about: "button.statuses.about",
  draw: Statuses,
  title: "button.statuses.title",
};

/**
 * The two elevations.
 */
export const elevation: Scene = {
  about: "button.elevation.about",
  draw: Elevation,
  title: "button.elevation.title",
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
 * The disabled state.
 */
export const states: Scene = {
  about: "button.states.about",
  draw: States,
  title: "button.states.title",
};

export default specimen({
  about: "button.about",
  group: "Actions",
  id: "actions/button",
  scenes: [looks, statuses, elevation, square, states],
  title: "button.title",
});
