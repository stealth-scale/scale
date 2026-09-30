/**
 * Catalogue page for the search input.
 *
 * @remarks
 *   Four hand-written scenes show an empty and a filled field, the input group's looks, a value the
 *   caller controls, and a clear control named after what it removes. `scenesOf` generates the
 *   sizes scene from the clear control's recipe. Every field in the looks and sizes scenes has a
 *   value, because the clear control renders only while the field has one. Every scene renders a
 *   component from `examples/` and shows that file as its source. The words are keys under
 *   `search-input` in `locales/en/specimen/search-input.json`.
 */

import { Matrix, type Scene, scenesOf, specimen, valuesOf } from "@stealthscale/specimen";

import { recipe as group } from "#input-group/recipe.ts";
import * as clearing from "#search-input/examples/clearing.example.tsx";
import * as controlled from "#search-input/examples/controlled.example.tsx";
import * as filters from "#search-input/examples/filters.example.tsx";
import * as query from "#search-input/examples/query.example.tsx";
import { recipe } from "#search-input/recipe.ts";

/**
 * Looks of the input group the field renders in.
 */
const LOOKS = valuesOf(group, "variant");

/**
 * Hand-written scene for the input group's looks, each with a value so the clear control renders.
 */
export const looks: Scene = {
  about: "search-input.looks.about",
  draw: () => (
    <Matrix knob="variant" of={LOOKS}>
      {(variant) => <query.Query variant={variant} />}
    </Matrix>
  ),
  example: query,
  props: { variant: "flushed" },
  title: "search-input.looks.title",
};

export default specimen({
  about: "search-input.about",
  id: "components/forms/search-input",
  imports: 'import { SearchInput } from "@stealthscale/component-forms";',
  scenes: [
    {
      about: "search-input.clearing.about",
      draw: clearing.Clearing,
      example: clearing,
      title: "search-input.clearing.title",
    },
    looks,
    ...scenesOf<Parameters<typeof query.Query>[0]>(recipe, {
      draw: (props) => <query.Query {...props} />,
      example: query,
      namespace: "search-input",
    }),
    {
      about: "search-input.controlled.about",
      draw: controlled.Controlled,
      example: controlled,
      title: "search-input.controlled.title",
    },
    {
      about: "search-input.filters.about",
      draw: filters.Filters,
      example: filters,
      title: "search-input.filters.title",
    },
  ],
  title: "search-input.title",
});
