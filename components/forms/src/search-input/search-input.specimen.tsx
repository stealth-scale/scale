/**
 * Shows the search field: every size, each holding a query so the control that empties it shows.
 *
 * @remarks
 *   The axis is read off the recipe, so a size added to the theme reaches the page without this
 *   file changing. The control's glyph is a cross drawn here. The words are keys under
 *   `search-input` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/search-input.json`.
 */

import { type ReactElement } from "react";

import { Icon } from "@stealthscale/component-typography";
import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import { recipe } from "#search-input/recipe.ts";
import { SearchInput } from "#search-input/search-input.tsx";

/**
 * The path of a cross, in a 24 unit box.
 */
const CROSS = "M6 6l12 12M18 6 6 18";

/**
 * Draws the field at every size.
 */
function Sizes(): ReactElement {
  const { t } = useWords("search-input");

  return (
    <Matrix knob="size" of={valuesOf(recipe, "size")}>
      {(size) => (
        <SearchInput
          aria-label={t("search")}
          clearIndicator={
            <Icon viewBox="0 0 24 24">
              <path d={CROSS} fill="none" stroke="currentColor" strokeWidth="2" />
            </Icon>
          }
          clearLabel={t("clear")}
          defaultValue={t("query")}
          size={size}
        />
      )}
    </Matrix>
  );
}

/**
 * Every size.
 */
export const sizes: Scene = {
  about: "search-input.sizes.about",
  draw: Sizes,
  title: "search-input.sizes.title",
};

export default specimen({
  about: "search-input.about",
  group: "Forms",
  id: "forms/search-input",
  scenes: [sizes],
  title: "search-input.title",
});
