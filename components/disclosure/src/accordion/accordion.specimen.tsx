/**
 * Catalogue page for the accordion.
 *
 * @remarks
 *   `scenesOf` generates the looks, palettes, sizes and motions from the questions example, which
 *   opens its first question, so every scene shows an open item beside closed ones. The palettes
 *   use the subtle look, which fills the open item from the palette. The hand-written scenes show a
 *   filter panel with several items open, icons, avatars, a controlled checkout, actions beside the
 *   triggers and a disabled accordion. Every accordion renders in a room at its real width: the
 *   filter panel in a sidebar's, the others in a column's. The words are keys under `accordion` in
 *   `locales/en/specimen/accordion.json`.
 */

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#accordion/examples/index.ts";
import type * as Accordion from "#accordion/index.ts";
import { recipe } from "#accordion/recipe.ts";

/**
 * Props of the disabled scene's accordion.
 */
const DISABLED: Accordion.RootProps = { disabled: true };

/**
 * Hand-written scene for a filter panel that keeps several items open.
 */
export const multiple: Scene = {
  about: "accordion.multiple.about",
  draw: () => (
    <Room size="xs">
      <examples.filters.Filters />
    </Room>
  ),
  example: examples.filters,
  title: "accordion.multiple.title",
};

/**
 * Hand-written scene for triggers that start with an icon.
 */
export const icons: Scene = {
  about: "accordion.icons.about",
  draw: () => (
    <Room size="md">
      <examples.clauses.Clauses />
    </Room>
  ),
  example: examples.clauses,
  title: "accordion.icons.title",
};

/**
 * Hand-written scene for triggers with an avatar and a second line.
 */
export const reviewers: Scene = {
  about: "accordion.reviewers.about",
  draw: () => (
    <Room size="md">
      <examples.reviewers.Reviewers />
    </Room>
  ),
  example: examples.reviewers,
  title: "accordion.reviewers.title",
};

/**
 * Hand-written scene for a checkout whose caller opens the next section.
 */
export const checkout: Scene = {
  about: "accordion.checkout.about",
  draw: () => (
    <Room size="md">
      <examples.checkout.Checkout />
    </Room>
  ),
  example: examples.checkout,
  title: "accordion.checkout.title",
};

/**
 * Hand-written scene for an action button after each trigger.
 */
export const documents: Scene = {
  about: "accordion.documents.about",
  draw: () => (
    <Room size="md">
      <examples.documents.Documents />
    </Room>
  ),
  example: examples.documents,
  title: "accordion.documents.title",
};

/**
 * Hand-written scene for a disabled accordion.
 */
export const disabled: Scene = {
  about: "accordion.disabled.about",
  draw: () => (
    <Room size="md">
      <examples.faq.Faq {...DISABLED} />
    </Room>
  ),
  example: examples.faq,
  props: { disabled: true },
  title: "accordion.disabled.title",
};

export default specimen({
  about: "accordion.about",
  id: "components/disclosure/accordion",
  imports: 'import { Accordion } from "@stealthscale/component-disclosure";',
  scenes: [
    ...scenesOf<Accordion.RootProps>(recipe, {
      axes: {
        palette: { with: { variant: "subtle" } },
        size: { direction: "column" },
        variant: { direction: "column" },
      },
      draw: (props) => (
        <Room size="md">
          <examples.faq.Faq {...props} />
        </Room>
      ),
      example: examples.faq,
      namespace: "accordion",
      order: ["variant", "palette", "size", "motion"],
    }),
    multiple,
    icons,
    reviewers,
    checkout,
    documents,
    disabled,
  ],
  title: "accordion.title",
});
