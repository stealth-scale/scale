/**
 * Shows the input group: a mark at each side and at both, every size, and both alignments.
 *
 * @remarks
 *   The scenes are generated from the recipe, so a value added to it reaches the page without this
 *   file changing. The marks are a currency symbol and a unit, both decorative, so each states
 *   `aria-hidden` and the field is named itself. The words are keys under `input-group` in the
 *   catalogue's namespace, kept beside this file in `locales/en/specimen/input-group.json`.
 */

import { type ReactElement } from "react";

import { scenesOf, specimen, useWords } from "@stealthscale/specimen";

import * as InputGroup from "#input-group/index.ts";
import { recipe } from "#input-group/recipe.ts";
import { Textarea } from "#textarea/textarea.tsx";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: [
    "<InputGroup.Start aria-hidden>€</InputGroup.Start>",
    '<InputGroup.Field aria-label="Amount" inputMode="decimal" />',
    "<InputGroup.End aria-hidden>EUR</InputGroup.End>",
  ].join("\n"),
  imports: 'import { InputGroup } from "@stealthscale/component-forms";',
  name: "InputGroup.Root",
};

/**
 * Draws an amount field with a mark on each side the group names.
 *
 * @remarks
 *   A mark is drawn only for the side the group leaves room at. A group that names one side and
 *   draws marks on both puts the second mark over the box.
 */
function Marked({ marks, ...rest }: InputGroup.RootProps): ReactElement {
  const { t } = useWords("input-group");

  return (
    <InputGroup.Root {...(marks === undefined ? {} : { marks })} {...rest}>
      {marks === "end" ? null : <InputGroup.Start aria-hidden>€</InputGroup.Start>}
      <InputGroup.Field aria-label={t("amount")} inputMode="decimal" />
      {marks === "start" ? null : <InputGroup.End aria-hidden>EUR</InputGroup.End>}
    </InputGroup.Root>
  );
}

/**
 * Draws an amount field with a mark at each side.
 *
 * @remarks
 *   The size is stated on the field as well as on the group. The group's size is the room a mark
 *   takes, and the field's is its own height, so a group at one size around a field at another drew
 *   the marks stepping while the box stayed put.
 */
function Amount({ size, ...rest }: InputGroup.RootProps): ReactElement {
  const { t } = useWords("input-group");

  return (
    <InputGroup.Root {...(size === undefined ? {} : { size })} {...rest}>
      <InputGroup.Start aria-hidden>€</InputGroup.Start>
      <InputGroup.Field
        aria-label={t("amount")}
        inputMode="decimal"
        {...(size === undefined ? {} : { size })}
      />
      <InputGroup.End aria-hidden>EUR</InputGroup.End>
    </InputGroup.Root>
  );
}

/**
 * Draws the marks against a box of several lines, which is what an alignment moves them in.
 */
function Lines(props: InputGroup.RootProps): ReactElement {
  const { t } = useWords("input-group");

  return (
    <InputGroup.Root {...props}>
      <InputGroup.Start aria-hidden>€</InputGroup.Start>
      <InputGroup.Field aria-label={t("amount")} as={Textarea} />
      <InputGroup.End aria-hidden>EUR</InputGroup.End>
    </InputGroup.Root>
  );
}

export default specimen({
  about: "input-group.about",
  id: "components/forms/input-group",
  imports: 'import { InputGroup, Textarea } from "@stealthscale/component-forms";',
  scenes: scenesOf<InputGroup.RootProps>(recipe, {
    axes: {
      align: { draw: (props) => <Lines {...props} /> },
      marks: { draw: (props) => <Marked {...props} /> },
    },
    draw: (props) => <Amount {...props} />,
    namespace: "input-group",
    order: ["marks", "size", "align"],
    sample: SAMPLE,
  }),
  title: "input-group.title",
});
