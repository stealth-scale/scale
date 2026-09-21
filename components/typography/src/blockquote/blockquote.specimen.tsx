/**
 * Shows the block quotation: every look in every status, every size, the places in a width, and
 * the motions.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every quotation carries the icon, the content and the caption, so each
 *   scene shows the whole figure. The words are keys under `blockquote` in the catalogue's
 *   namespace, kept beside this file in `locales/en/specimen/blockquote.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as Blockquote from "#blockquote/index.ts";
import { recipe } from "#blockquote/recipe.ts";

/**
 * The path of a pair of quotation marks, in a 24 unit box.
 */
const MARKS = "M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z";

/**
 * Draws the quotation's icon, content and caption.
 */
function Figure(): ReactElement {
  const { t } = useWords("blockquote");

  return (
    <>
      <Blockquote.Icon size="lg" viewBox="0 0 24 24">
        <path d={MARKS} />
      </Blockquote.Icon>
      <Blockquote.Content>{t("quotation")}</Blockquote.Content>
      <Blockquote.Caption>{t("author")}</Blockquote.Caption>
    </>
  );
}

/**
 * Draws the quotation in every look in every status.
 */
function Looks(): ReactElement {
  return (
    <Matrix
      across={{ knob: "status", of: valuesOf(recipe, "status") }}
      knob="variant"
      of={valuesOf(recipe, "variant")}
    >
      {(variant, status) => (
        <Blockquote.Root status={status} variant={variant}>
          <Figure />
        </Blockquote.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the quotation at every size.
 */
function Sizes(): ReactElement {
  return (
    <Matrix knob="size" of={valuesOf(recipe, "size")}>
      {(size) => (
        <Blockquote.Root size={size}>
          <Figure />
        </Blockquote.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the quotation at every place in a width.
 */
function Distribution(): ReactElement {
  return (
    <Matrix direction="column" knob="justify" of={valuesOf(recipe, "justify")}>
      {(justify) => (
        <Blockquote.Root justify={justify}>
          <Figure />
        </Blockquote.Root>
      )}
    </Matrix>
  );
}

/**
 * Draws the quotation entering with every motion.
 */
function Motion(): ReactElement {
  return (
    <Matrix knob="motion" of={valuesOf(recipe, "motion")}>
      {(motion) => (
        <Blockquote.Root motion={motion}>
          <Figure />
        </Blockquote.Root>
      )}
    </Matrix>
  );
}

/**
 * Every look in every status.
 */
export const looks: Scene = {
  about: "blockquote.looks.about",
  draw: Looks,
  title: "blockquote.looks.title",
};

/**
 * Every size.
 */
export const sizes: Scene = {
  about: "blockquote.sizes.about",
  draw: Sizes,
  title: "blockquote.sizes.title",
};

/**
 * Every place in a width.
 */
export const distribution: Scene = {
  about: "blockquote.distribution.about",
  draw: Distribution,
  title: "blockquote.distribution.title",
};

/**
 * Every motion.
 */
export const motion: Scene = {
  about: "blockquote.motion.about",
  draw: Motion,
  title: "blockquote.motion.title",
};

export default specimen({
  about: "blockquote.about",
  group: "Typography",
  id: "typography/blockquote",
  imports: 'import { Blockquote } from "@stealthscale/component-typography";',
  scenes: [looks, sizes, distribution, motion],
  title: "blockquote.title",
});
