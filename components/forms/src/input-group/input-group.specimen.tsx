/**
 * Shows the input group: a mark at each side and at both, every size, and both alignments.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. The marks are a currency symbol and a unit, both decorative, so each
 *   states `aria-hidden` and the field is named itself. The words are keys under `input-group` in
 *   the catalogue's namespace, kept beside this file in `locales/en/specimen/input-group.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as InputGroup from "#input-group/index.ts";
import { recipe } from "#input-group/recipe.ts";
import { Textarea } from "#textarea/textarea.tsx";

/**
 * Draws an amount field with a mark on each side the group names.
 */
function Marks(): ReactElement {
  const { t } = useWords("input-group");

  return (
    <Matrix knob="marks" of={valuesOf(recipe, "marks")}>
      {(marks) => (
        <InputGroup.Root marks={marks}>
          {marks === "end" ? null : <InputGroup.Start aria-hidden>€</InputGroup.Start>}
          <InputGroup.Field aria-label={t("amount")} inputMode="decimal" />
          {marks === "start" ? null : <InputGroup.End aria-hidden>EUR</InputGroup.End>}
        </InputGroup.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the field with both marks at every size.
 *
 * @remarks
 *   The size is stated on the field as well as on the group. The group's size is the room a mark
 *   takes, and the field's is its own height, so a group at one size around a field at another
 *   drew the marks stepping while the box stayed put.
 */
function Sizes(): ReactElement {
  const { t } = useWords("input-group");

  return (
    <Matrix knob="size" of={valuesOf(recipe, "size")}>
      {(size) => (
        <InputGroup.Root size={size}>
          <InputGroup.Start aria-hidden>€</InputGroup.Start>
          <InputGroup.Field aria-label={t("amount")} inputMode="decimal" size={size} />
          <InputGroup.End aria-hidden>EUR</InputGroup.End>
        </InputGroup.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the marks against a box of several lines, at both places.
 */
function Alignment(): ReactElement {
  const { t } = useWords("input-group");

  return (
    <Matrix knob="align" of={valuesOf(recipe, "align")}>
      {(align) => (
        <InputGroup.Root align={align}>
          <InputGroup.Start aria-hidden>€</InputGroup.Start>
          <InputGroup.Field aria-label={t("amount")} as={Textarea} />
          <InputGroup.End aria-hidden>EUR</InputGroup.End>
        </InputGroup.Root>
      )}
    </Matrix>
  );
}

/**
 * A mark at each side and at both.
 */
export const marks: Scene = {
  about: "input-group.marks.about",
  draw: Marks,
  title: "input-group.marks.title",
};

/**
 * Every size.
 */
export const sizes: Scene = {
  about: "input-group.sizes.about",
  draw: Sizes,
  title: "input-group.sizes.title",
};

/**
 * Both alignments.
 */
export const alignment: Scene = {
  about: "input-group.alignment.about",
  draw: Alignment,
  title: "input-group.alignment.title",
};

export default specimen({
  about: "input-group.about",
  group: "Forms",
  id: "forms/input-group",
  imports: 'import { InputGroup, Textarea } from "@stealthscale/component-forms";',
  scenes: [marks, sizes, alignment],
  title: "input-group.title",
});
