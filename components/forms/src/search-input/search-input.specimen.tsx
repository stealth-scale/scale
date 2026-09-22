/**
 * Shows the search field: every size, each holding a query so the control that empties it shows.
 *
 * @remarks
 *   The scene is generated from the recipe, so a size added to the theme reaches the page without
 *   this file changing. Every field is drawn holding a query, because the control that empties one
 *   is only there while there is something to empty. The control's glyph is a cross drawn here. The
 *   words are keys under `search-input` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/search-input.json`.
 */

import { type ReactElement } from "react";

import { Icon } from "@stealthscale/component-typography";
import { scenesOf, specimen, useWords } from "@stealthscale/specimen";

import { recipe } from "#search-input/recipe.ts";
import { SearchInput, type SearchInputProps } from "#search-input/search-input.tsx";

/**
 * The path of a cross, in a 24 unit box.
 */
const CROSS = "M6 6l12 12M18 6 6 18";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  imports: 'import { SearchInput } from "@stealthscale/component-forms";',
  name: "SearchInput",
};

/**
 * Draws the field holding a query, so the control that empties it is drawn beside it.
 */
function Searched(props: SearchInputProps): ReactElement {
  const { t } = useWords("search-input");

  return (
    <SearchInput
      aria-label={t("search")}
      clearIndicator={
        <Icon viewBox="0 0 24 24">
          <path d={CROSS} fill="none" stroke="currentColor" strokeWidth="2" />
        </Icon>
      }
      clearLabel={t("clear")}
      defaultValue={t("query")}
      {...props}
    />
  );
}

export default specimen({
  about: "search-input.about",
  id: "components/forms/search-input",
  imports: 'import { SearchInput } from "@stealthscale/component-forms";',
  scenes: scenesOf<SearchInputProps>(recipe, {
    draw: (props) => <Searched {...props} />,
    namespace: "search-input",
    sample: SAMPLE,
  }),
  title: "search-input.title",
});
