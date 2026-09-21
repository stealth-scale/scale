/**
 * Catalogue entry for `VisuallyHidden`, covering both values of its `focusable` variant.
 *
 * @remarks
 *   The axis is taken from the recipe rather than written by hand. The `false` cell is the common
 *   case, an icon-only button whose accessible name is hidden text; the `true` cell makes the
 *   hidden text the control itself, so it can be seen once it takes focus. Copy comes from the
 *   `visually-hidden` namespace in `locales/en/specimen/visually-hidden.json`.
 */

import { type ReactElement } from "react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Icon } from "@stealthscale/component-typography";
import { Matrix, type Scene, specimen, useWords } from "@stealthscale/specimen";

import { VisuallyHidden } from "#visually-hidden/visually-hidden.ts";

/**
 * Both values of a boolean variant, in the order the matrix draws them.
 */
const EITHER = [false, true] as const;

/**
 * Button props supplied once from above, so both cells share a variant.
 */
const OUTLINE = { variant: "outline" } as const;

/**
 * Path data for a close glyph, drawn against a 24 by 24 viewBox.
 */
const CROSS = "M6 6l12 12M18 6 6 18";

/**
 * Renders an icon button labelled by hidden text next to a hidden button that appears on focus.
 */
function Focusable(): ReactElement {
  const { t } = useWords("visually-hidden");

  return (
    <ButtonPropsProvider value={OUTLINE}>
      <Matrix knob="focusable" of={EITHER}>
        {(focusable) =>
          focusable ? (
            <VisuallyHidden as={Button} focusable>
              {t("close")}
            </VisuallyHidden>
          ) : (
            <Button shape="square">
              <Icon viewBox="0 0 24 24">
                <path d={CROSS} fill="none" stroke="currentColor" strokeWidth="2" />
              </Icon>
              <VisuallyHidden>{t("close")}</VisuallyHidden>
            </Button>
          )
        }
      </Matrix>
    </ButtonPropsProvider>
  );
}

/**
 * Scene comparing a hidden label with a hidden control that can take focus.
 */
export const focusable: Scene = {
  about: "visually-hidden.focusable.about",
  draw: Focusable,
  title: "visually-hidden.focusable.title",
};

export default specimen({
  about: "visually-hidden.about",
  group: "Accessibility",
  id: "a11y/visually-hidden",
  imports: 'import { VisuallyHidden } from "@stealthscale/component-a11y";',
  scenes: [focusable],
  title: "visually-hidden.title",
});
