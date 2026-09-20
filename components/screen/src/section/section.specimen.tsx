/**
 * Shows the section: both looks at every size, and the heading beside the body as an annotation.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every section holds the same block: a title, a description, one action
 *   and a body. The title is drawn as an `h3`, under the scene's own `h2`. The words are keys
 *   under `section` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/section.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, Tile, useWords, valuesOf } from "@stealthscale/specimen";

import * as Section from "#section/index.ts";
import { recipe } from "#section/recipe.ts";

/**
 * The two answers to a boolean prop.
 */
const EITHER = [false, true] as const;

/**
 * Draws the block every section holds.
 */
function Payment(): ReactElement {
  const { t } = useWords("section");

  return (
    <>
      <Section.Header>
        <Section.Title as="h3">{t("payment")}</Section.Title>
        <Section.Description>{t("cards")}</Section.Description>
        <Section.Actions>
          <Section.Action priority="secondary">{t("add")}</Section.Action>
        </Section.Actions>
      </Section.Header>
      <Section.Body>
        <Tile>{t("content")}</Tile>
      </Section.Body>
    </>
  );
}

/**
 * Draws the section in both looks at every size.
 */
function Looks(): ReactElement {
  return (
    <Matrix
      across={{ knob: "size", of: valuesOf(recipe, "size") }}
      knob="variant"
      of={valuesOf(recipe, "variant")}
    >
      {(variant, size) => (
        <Section.Root size={size} variant={variant}>
          <Payment />
        </Section.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the section with its heading above the body and beside it.
 */
function Annotated(): ReactElement {
  return (
    <Matrix direction="column" knob="annotated" of={EITHER}>
      {(annotated) => (
        <Section.Root annotated={annotated} variant="surface">
          <Payment />
        </Section.Root>
      )}
    </Matrix>
  );
}

/**
 * Both looks at every size.
 */
export const looks: Scene = {
  about: "section.looks.about",
  draw: Looks,
  title: "section.looks.title",
};

/**
 * The heading above beside the heading alongside.
 */
export const annotated: Scene = {
  about: "section.annotated.about",
  draw: Annotated,
  title: "section.annotated.title",
};

export default specimen({
  about: "section.about",
  group: "Screen",
  id: "screen/section",
  scenes: [looks, annotated],
  title: "section.title",
});
