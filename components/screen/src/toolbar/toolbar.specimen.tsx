/**
 * Catalogue page for the toolbar.
 *
 * @remarks
 *   Every hand-written scene renders its toolbar plain inside an outlined sample, the box a
 *   toolbar sits in on a page. The folding scene renders the publishing example twice: at the
 *   card's width and in a room a phone's width, because the row folds on its own width. The sizes
 *   scene renders the editor at every size. `scenesOf` generates the looks and the corners from the
 *   invoices example, and the corners render on an outlined row, because a plain row has no edge.
 *   The samples and the rooms never appear in the examples. The words are keys under `toolbar` in
 *   `locales/en/specimen/toolbar.json`.
 */

import { Stack } from "@stealthscale/component-layout";
import { Room, Sample, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#toolbar/examples/index.ts";
import type * as Toolbar from "#toolbar/index.ts";
import { recipe } from "#toolbar/recipe.ts";

/**
 * Hand-written scene for a toolbar with three bands, a group and a separator.
 */
export const whole: Scene = {
  about: "toolbar.whole.about",
  draw: () => (
    <Sample place="stretch" variant="outline">
      <examples.editor.Editor />
    </Sample>
  ),
  example: examples.editor,
  title: "toolbar.whole.title",
};

/**
 * Hand-written scene for one toolbar wide and at a phone's width.
 */
export const folding: Scene = {
  about: "toolbar.folding.about",
  draw: () => (
    <Stack gap="lg">
      <Sample place="stretch" variant="outline">
        <examples.publishing.Publishing />
      </Sample>
      <Room size="sm">
        <Sample place="stretch" variant="outline">
          <examples.publishing.Publishing />
        </Sample>
      </Room>
    </Stack>
  ),
  example: examples.publishing,
  title: "toolbar.folding.title",
};

/**
 * Sizes the sizes scene renders, from the smallest.
 */
const SIZES = ["sm", "md", "lg"] as const;

/**
 * Hand-written scene for the editor at every size.
 */
export const sizes: Scene = {
  about: "toolbar.size.about",
  axes: ["size"],
  draw: () => (
    <Stack gap="lg">
      {SIZES.map((size) => (
        <Sample key={size} place="stretch" variant="outline">
          <examples.editor.Editor size={size} />
        </Sample>
      ))}
    </Stack>
  ),
  example: examples.editor,
  props: { size: "sm" } satisfies Omit<Toolbar.RootProps, "aria-label">,
  title: "toolbar.size.title",
};

/**
 * Hand-written scene for controls with tab stops of their own.
 */
export const loose: Scene = {
  about: "toolbar.loose.about",
  draw: () => (
    <Sample place="stretch" variant="outline">
      <examples.loose.Loose />
    </Sample>
  ),
  example: examples.loose,
  title: "toolbar.loose.title",
};

export default specimen({
  about: "toolbar.about",
  id: "components/screen/toolbar",
  imports: 'import { Toolbar } from "@stealthscale/component-screen";',
  scenes: [
    whole,
    folding,
    sizes,
    loose,
    ...scenesOf<Omit<Toolbar.RootProps, "aria-label">>(recipe, {
      axes: {
        radius: { direction: "column", with: { variant: "outline" } },
        variant: { direction: "column" },
      },
      draw: (props) => <examples.invoices.Invoices {...props} />,
      example: examples.invoices,
      namespace: "toolbar",
      order: ["variant", "radius"],
      skip: { size: "The sizes scene renders every size with its controls at the same size." },
    }),
  ],
  title: "toolbar.title",
});
