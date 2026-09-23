/**
 * Catalogues the spinner: one scene per axis, one in a line of text, and one in a button.
 *
 * @remarks
 *   The axis scenes are generated from the recipe, so a value added there reaches the page without
 *   an edit here. The words are keys under `spinner` in the catalogue namespace, stored beside this
 *   file at `locales/en/specimen/spinner.json`.
 */

import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { Text } from "@stealthscale/component-typography";
import { Matrix, type Scene, scenesOf, specimen, useWords } from "@stealthscale/specimen";

import { recipe } from "#spinner/recipe.ts";
import { Spinner, type SpinnerProps } from "#spinner/spinner.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  imports: 'import { Spinner } from "@stealthscale/component-feedback";',
  name: "Spinner",
};

/**
 * The body text sizes the inline scene sets its words in.
 */
const TEXT_SIZES = ["sm", "md", "lg"] as const;

/**
 * The button looks the button scene renders, from the filled look to the unfilled one.
 */
const LOOKS = ["solid", "subtle", "outline"] as const;

/**
 * Renders a spinner at `inherit` beside words at each body text size.
 */
function Inline(): ReactElement {
  const { t } = useWords("spinner");

  return (
    <Matrix knob="size" of={TEXT_SIZES}>
      {(size) => (
        <Text size={size}>
          <Spinner size="inherit" /> {t("saving")}
        </Text>
      )}
    </Matrix>
  );
}

/**
 * Renders a disabled button holding a spinner at `inherit`, in each look.
 */
function InButton(): ReactElement {
  const { t } = useWords("spinner");

  return (
    <Matrix knob="variant" of={LOOKS}>
      {(variant) => (
        <Button disabled variant={variant}>
          <Spinner size="inherit" />
          {t("saving")}
        </Button>
      )}
    </Matrix>
  );
}

/**
 * The hand-written scene for a spinner in a line of text.
 */
export const inline: Scene = {
  about: "spinner.inline.about",
  draw: Inline,
  title: "spinner.inline.title",
};

/**
 * The hand-written scene for a spinner in a button.
 */
export const button: Scene = {
  about: "spinner.button.about",
  draw: InButton,
  title: "spinner.button.title",
};

export default specimen({
  about: "spinner.about",
  id: "components/feedback/spinner",
  imports: 'import { Spinner } from "@stealthscale/component-feedback";',
  scenes: [
    ...scenesOf<SpinnerProps>(recipe, {
      axes: {
        effect: { across: "palette", with: { size: "lg" } },
        palette: { with: { size: "lg" } },
        stroke: { with: { size: "lg" } },
        track: { with: { palette: "primary", size: "lg" } },
      },
      draw: (props) => <Spinner {...props} />,
      namespace: "spinner",
      order: ["size", "palette", "stroke", "track", "effect"],
      sample: SAMPLE,
    }),
    inline,
    button,
  ],
  title: "spinner.title",
});
