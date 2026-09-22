/**
 * Catalogue entry for `VisuallyHidden`, covering both values of its `focusable` variant.
 *
 * @remarks
 *   The scene is generated from the recipe, so an axis added to it reaches the page without this
 *   file changing. The `false` cell is the common case, an icon-only button whose accessible name
 *   is hidden text; the `true` cell makes the hidden text the control itself, so it can be seen
 *   once it takes focus. The two cells are drawn differently rather than from one call, because a
 *   hidden label and a hidden control are two arrangements rather than one arrangement twice. Copy
 *   comes from the `visually-hidden` namespace in `locales/en/specimen/visually-hidden.json`.
 */

import { type ReactElement } from "react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Icon } from "@stealthscale/component-typography";
import { scenesOf, specimen, useWords } from "@stealthscale/specimen";

import { recipe } from "#visually-hidden/recipe.ts";
import { VisuallyHidden, type VisuallyHiddenProps } from "#visually-hidden/visually-hidden.ts";

/**
 * Button props supplied once from above, so both cells share a variant.
 */
const OUTLINE = { variant: "outline" } as const;

/**
 * Path data for a close glyph, drawn against a 24 by 24 viewBox.
 */
const CROSS = "M6 6l12 12M18 6 6 18";

/**
 * The call site the scene's source snippet is generated from.
 */
const SAMPLE = {
  children: "Close",
  imports: 'import { VisuallyHidden } from "@stealthscale/component-a11y";',
  name: "VisuallyHidden",
};

/**
 * Draws hidden text as the name of an icon button, or as a control that appears once focused.
 */
function Hidden({ focusable }: VisuallyHiddenProps): ReactElement {
  const { t } = useWords("visually-hidden");

  if (focusable === true) {
    return (
      <ButtonPropsProvider value={OUTLINE}>
        <VisuallyHidden as={Button} focusable>
          {t("close")}
        </VisuallyHidden>
      </ButtonPropsProvider>
    );
  }

  return (
    <ButtonPropsProvider value={OUTLINE}>
      <Button shape="square">
        <Icon viewBox="0 0 24 24">
          <path d={CROSS} fill="none" stroke="currentColor" strokeWidth="2" />
        </Icon>
        <VisuallyHidden>{t("close")}</VisuallyHidden>
      </Button>
    </ButtonPropsProvider>
  );
}

export default specimen({
  about: "visually-hidden.about",
  id: "components/a11y/visually-hidden",
  imports: 'import { VisuallyHidden } from "@stealthscale/component-a11y";',
  scenes: scenesOf<VisuallyHiddenProps>(recipe, {
    draw: (props) => <Hidden {...props} />,
    namespace: "visually-hidden",
    sample: SAMPLE,
  }),
  title: "visually-hidden.title",
});
