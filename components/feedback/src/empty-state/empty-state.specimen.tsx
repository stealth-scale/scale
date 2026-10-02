/**
 * Catalogue page for the empty state.
 *
 * @remarks
 *   `scenesOf` generates the size scene, one panel per row, because a panel fills the width it
 *   gets. The scene renders the example from `examples/` and shows it as its source. The example's
 *   title is an `h3` under the scene's `h2`. The words are keys under `empty-state` in
 *   `locales/en/specimen/empty-state.json`.
 */

import { scenesOf, specimen } from "@stealthscale/specimen";

import * as invoices from "#empty-state/examples/invoices.example.tsx";
import { recipe } from "#empty-state/recipe.ts";

export default specimen({
  about: "empty-state.about",
  id: "components/feedback/empty-state",
  imports: 'import { EmptyState } from "@stealthscale/component-feedback";',
  scenes: scenesOf<Parameters<typeof invoices.Invoices>[0]>(recipe, {
    axes: { size: { direction: "column" } },
    draw: (props) => <invoices.Invoices {...props} />,
    example: invoices,
    namespace: "empty-state",
  }),
  title: "empty-state.title",
});
