/**
 * Shows the breadcrumb: both looks at every size, each a trail of three crumbs.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. The words are keys under `breadcrumb` in the catalogue's namespace, kept
 *   beside this file in `locales/en/specimen/breadcrumb.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as Breadcrumb from "#breadcrumb/index.ts";
import { recipe } from "#breadcrumb/recipe.ts";

/**
 * Draws the trail in both looks at every size.
 */
function Looks(): ReactElement {
  const { t } = useWords("breadcrumb");

  return (
    <Matrix
      across={{ knob: "size", of: valuesOf(recipe, "size") }}
      knob="variant"
      of={valuesOf(recipe, "variant")}
    >
      {(variant, size) => (
        <Breadcrumb.Root size={size} variant={variant}>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="#home">{t("home")}</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator>/</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="#invoices">{t("invoices")}</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator>/</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.CurrentLink>{t("april")}</Breadcrumb.CurrentLink>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      )}
    </Matrix>
  );
}

/**
 * Both looks at every size.
 */
export const looks: Scene = {
  about: "breadcrumb.looks.about",
  draw: Looks,
  title: "breadcrumb.looks.title",
};

export default specimen({
  about: "breadcrumb.about",
  group: "Navigation",
  id: "navigation/breadcrumb",
  scenes: [looks],
  title: "breadcrumb.title",
});
