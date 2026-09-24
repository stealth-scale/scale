/**
 * Catalogue page for the collapsible.
 *
 * @remarks
 *   `scenesOf` generates the looks, palettes, sizes and motions from the delivery example. The
 *   looks and palettes render open, so the content shows, and the palettes use the subtle look,
 *   which fills the box. The sizes and motions render closed in
 *   the outline look, because a motion shows only on a press. The preview scene is hand-written,
 *   because `collapsedHeight` needs content longer than two lines. Every collapsible renders in an
 *   `md` room, and every scene shows its example file as its source. The words are keys under
 *   `collapsible` in `locales/en/specimen/collapsible.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#collapsible/examples/index.ts";
import type * as Collapsible from "#collapsible/index.ts";
import { recipe } from "#collapsible/recipe.ts";

/**
 * Hand-written scene for content that keeps two lines visible while closed.
 */
export const preview: Scene = {
  about: "collapsible.preview.about",
  draw: () => (
    <Room size="md">
      <examples.terms.Terms />
    </Room>
  ),
  example: examples.terms,
  title: "collapsible.preview.title",
};

export default specimen({
  about: "collapsible.about",
  id: "components/disclosure/collapsible",
  imports: 'import { Collapsible } from "@stealthscale/component-disclosure";',
  scenes: [
    ...scenesOf<Collapsible.RootProps>(recipe, {
      axes: {
        motion: { with: { variant: "outline" } },
        palette: { with: { defaultOpen: true, variant: "subtle" } },
        size: { direction: "column", with: { variant: "outline" } },
        variant: { direction: "column", with: { defaultOpen: true } },
      },
      draw: (props) => (
        <Room size="md">
          <examples.delivery.Delivery {...props} />
        </Room>
      ),
      example: examples.delivery,
      namespace: "collapsible",
      order: ["variant", "palette", "size", "motion"],
    }),
    preview,
  ],
  title: "collapsible.title",
});
