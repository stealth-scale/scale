/**
 * Shows the multi-line box: every look at every size, every status in every look, every grip, and
 * a box that grows beside one that does not.
 *
 * @remarks
 *   The scenes are generated from the recipe, so a value added to it reaches the page without this
 *   file changing. The size is crossed with the look and the look with the status, because each
 *   pair reads as a grid rather than as two lists. The box that grows is drawn holding four lines,
 *   because a box takes its height from the text it holds only once there is more text than rows.
 *   Every box is named with `aria-label`. The words are keys under `textarea` in the catalogue's
 *   namespace, kept beside this file in `locales/en/specimen/textarea.json`.
 */

import { type ReactElement } from "react";

import { scenesOf, specimen, useWords } from "@stealthscale/specimen";

import { recipe } from "#textarea/recipe.ts";
import { Textarea, type TextareaProps } from "#textarea/textarea.tsx";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  imports: 'import { Textarea } from "@stealthscale/component-forms";',
  name: "Textarea",
};

/**
 * Draws an empty box, which is what a look, a size, a status or a grip is read against.
 */
function Notes(props: TextareaProps): ReactElement {
  const { t } = useWords("textarea");

  return <Textarea aria-label={t("notes")} {...props} />;
}

/**
 * Draws a box holding four lines, which is what a box that grows is read against.
 */
function Written(props: TextareaProps): ReactElement {
  const { t } = useWords("textarea");

  return <Notes defaultValue={t("written")} {...props} />;
}

export default specimen({
  about: "textarea.about",
  id: "components/forms/textarea",
  imports: 'import { Textarea } from "@stealthscale/component-forms";',
  scenes: scenesOf<TextareaProps>(recipe, {
    axes: {
      grows: { draw: (props) => <Written {...props} /> },
      status: { across: "variant" },
      variant: { across: "size" },
    },
    draw: (props) => <Notes {...props} />,
    namespace: "textarea",
    order: ["variant", "status", "grip", "grows"],
    sample: SAMPLE,
  }),
  title: "textarea.title",
});
