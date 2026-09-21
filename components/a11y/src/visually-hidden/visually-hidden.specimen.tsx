/**
 * Shows the hidden words: a button whose name is hidden, beside a hidden control that comes into
 * view under focus.
 *
 * @remarks
 *   The axis is read off the recipe. A button holding a glyph and hidden words is the common
 *   case, so the first cell is one; the second makes the hidden words the control itself. The
 *   words are keys under `visually-hidden` in the catalogue's namespace, kept beside this file
 *   in `locales/en/specimen/visually-hidden.json`.
 */

import { type ReactElement } from "react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Icon } from "@stealthscale/component-typography";
import { Matrix, type Scene, specimen, useWords } from "@stealthscale/specimen";

import { VisuallyHidden } from "#visually-hidden/visually-hidden.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * The look every button of the scene takes, set once above them.
 */
const OUTLINE = { variant: "outline" } as const;

/**
 * The path of a cross, in a 24 unit box.
 */
const CROSS = "M6 6l12 12M18 6 6 18";

/**
 * Draws a button whose words are hidden, and hidden words that are a control.
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
 * Hidden words beside a hidden control.
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
