/**
 * Shows the input group: a mark at each side and at both, every size, both alignments, and the
 * three things a mark turns out to be.
 *
 * @remarks
 *   The axis scenes are generated from the recipe, so a value added to it reaches the page without
 *   this file changing. The marks are a currency symbol and a unit, both decorative, so each states
 *   `aria-hidden` and the field is named itself.
 *   Every field is drawn holding something. Empty, a group read as a box with two words floating at
 *   its ends and nothing between them, which is the one arrangement the component never draws in
 *   use.
 *   The uses scene is written by hand, because what a mark is for is not an axis. The axis scenes
 *   draw a currency symbol and a unit; this one draws the two the axes never reach, a glyph that
 *   says what the field takes and a control the reader presses.
 *   A mark is a square on the control scale and the field reserves exactly that much room, so a
 *   word longer than the square runs over the typing. The marks drawn here are a glyph and a
 *   control, and the words drawn elsewhere on the page are a symbol and a three-letter unit.
 *   The words are keys under `input-group` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/input-group.json`.
 */

import { type ReactElement } from "react";

import { Eye, Search, X } from "lucide-react";

import { IconButton } from "@stealthscale/component-actions";
import { Board, Sample, type Scene, scenesOf, specimen, useWords } from "@stealthscale/specimen";

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
      <InputGroup.Field aria-label={t("amount")} defaultValue={t("sum")} inputMode="decimal" />
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
        defaultValue={t("sum")}
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
      <InputGroup.Field aria-label={t("amount")} as={Textarea} defaultValue={t("note")} />
      <InputGroup.End aria-hidden>EUR</InputGroup.End>
    </InputGroup.Root>
  );
}

/**
 * Draws a search field, its glyph leading and a control to empty it at the end.
 *
 * @remarks
 *   The glyph says what the field takes and carries no pointer, so a press over it lands in the
 *   field. The control does take a pointer, which is what the mark's own rule hands back to
 *   whatever a caller puts inside it.
 */
function Searched(): ReactElement {
  const { t } = useWords("input-group");

  return (
    <InputGroup.Root>
      <InputGroup.Start aria-hidden>
        <Search />
      </InputGroup.Start>
      <InputGroup.Field aria-label={t("search")} defaultValue={t("query")} type="search" />
      <InputGroup.End>
        <IconButton aria-label={t("clear")} size="xs" variant="ghost">
          <X />
        </IconButton>
      </InputGroup.End>
    </InputGroup.Root>
  );
}

/**
 * Draws a passphrase field with the control that shows what was typed.
 *
 * @remarks
 *   A mark at the end alone, so the typing starts where it would in any other field and the control
 *   sits where a reader looks for it.
 */
function Secret(): ReactElement {
  const { t } = useWords("input-group");

  return (
    <InputGroup.Root marks="end">
      <InputGroup.Field
        aria-label={t("passphrase")}
        autoComplete="current-password"
        defaultValue={t("typed")}
        type="password"
      />
      <InputGroup.End>
        <IconButton aria-label={t("reveal")} size="xs" variant="ghost">
          <Eye />
        </IconButton>
      </InputGroup.End>
    </InputGroup.Root>
  );
}

/**
 * Draws the two marks a currency symbol and a unit do not cover: a glyph that says what the field
 * takes, and a control the reader presses.
 */
function Uses(): ReactElement {
  const { t } = useWords("input-group");

  return (
    <Board columns="1">
      <Sample knob={t("use")} of={t("glyph")}>
        <Searched />
      </Sample>
      <Sample knob={t("use")} of={t("control")}>
        <Secret />
      </Sample>
    </Board>
  );
}

/**
 * The hand-written scene for what a mark is for.
 */
export const uses: Scene = {
  about: "input-group.uses.about",
  draw: Uses,
  source: [
    'import { IconButton } from "@stealthscale/component-actions";',
    'import { InputGroup } from "@stealthscale/component-forms";',
    "",
    "<InputGroup.Root>",
    "  <InputGroup.Start aria-hidden>",
    "    <Search />",
    "  </InputGroup.Start>",
    '  <InputGroup.Field aria-label="Search" type="search" />',
    "  <InputGroup.End>",
    '    <IconButton aria-label="Clear" size="xs" variant="ghost">',
    "      <X />",
    "    </IconButton>",
    "  </InputGroup.End>",
    "</InputGroup.Root>",
  ].join("\n"),
  title: "input-group.uses.title",
};

export default specimen({
  about: "input-group.about",
  id: "components/forms/input-group",
  imports: 'import { InputGroup, Textarea } from "@stealthscale/component-forms";',
  scenes: [
    uses,
    ...scenesOf<InputGroup.RootProps>(recipe, {
      axes: {
        align: { draw: (props) => <Lines {...props} /> },
        marks: { draw: (props) => <Marked {...props} /> },
      },
      draw: (props) => <Amount {...props} />,
      namespace: "input-group",
      order: ["marks", "size", "align"],
      sample: SAMPLE,
    }),
  ],
  title: "input-group.title",
});
