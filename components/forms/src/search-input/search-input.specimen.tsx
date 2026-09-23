/**
 * Catalogue page for the search input.
 *
 * @remarks
 *   `scenesOf` generates the sizes scene from the clear control's recipe. Every field has a value,
 *   because the clear control renders only while the field has one. The scene renders a component
 *   from `examples/` and shows that file as its source. The words are keys under `search-input` in
 *   `locales/en/specimen/search-input.json`.
 */

import { scenesOf, specimen } from "@stealthscale/specimen";

import * as query from "#search-input/examples/query.example.tsx";
import { recipe } from "#search-input/recipe.ts";

export default specimen({
  about: "search-input.about",
  id: "components/forms/search-input",
  imports: 'import { SearchInput } from "@stealthscale/component-forms";',
  scenes: scenesOf<Parameters<typeof query.Query>[0]>(recipe, {
    draw: (props) => <query.Query {...props} />,
    example: query,
    namespace: "search-input",
  }),
  title: "search-input.title",
});
