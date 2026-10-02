/**
 * Catalogue page for the details.
 *
 * @remarks
 *   `scenesOf` generates the looks, palettes and sizes from the refund example, each in an `md`
 *   room. The looks and palettes render open, so the content shows, and the palettes use the subtle
 *   look, which fills the box. The hand-written scenes show an exclusive group of answers and a
 *   details under an alert. No generated scene sets `name`, because details with one name close
 *   each other across the page. The words are keys under `details` in
 *   `locales/en/specimen/details.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#details/examples/index.ts";
import type * as Details from "#details/index.ts";
import { recipe } from "#details/recipe.ts";

/**
 * Hand-written scene for three answers that close each other.
 */
export const faq: Scene = {
  about: "details.faq.about",
  draw: () => (
    <Room size="md">
      <examples.faq.Faq />
    </Room>
  ),
  example: examples.faq,
  title: "details.faq.title",
};

/**
 * Hand-written scene for the full error of a payment under its alert.
 */
export const declined: Scene = {
  about: "details.declined.about",
  draw: () => (
    <Room size="md">
      <examples.declined.Declined />
    </Room>
  ),
  example: examples.declined,
  title: "details.declined.title",
};

export default specimen({
  about: "details.about",
  id: "components/disclosure/details",
  imports: 'import { Details } from "@stealthscale/component-disclosure";',
  scenes: [
    ...scenesOf<Details.RootProps>(recipe, {
      axes: {
        palette: { with: { open: true, variant: "subtle" } },
        size: { direction: "column" },
        variant: { direction: "column", with: { open: true } },
      },
      draw: (props) => (
        <Room size="md">
          <examples.refund.Refund {...props} />
        </Room>
      ),
      example: examples.refund,
      namespace: "details",
      order: ["variant", "palette", "size"],
    }),
    faq,
    declined,
  ],
  title: "details.title",
});
