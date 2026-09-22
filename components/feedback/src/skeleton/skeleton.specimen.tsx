/**
 * Catalogues the skeleton across its variants, one scene per axis.
 *
 * @remarks
 *   The scenes are generated from the recipe, so a value added to it reaches the page without this
 *   file changing. Every placeholder wraps a tile, because a skeleton takes the box of its content
 *   and an empty one would collapse. The copy is keyed under `skeleton` in the catalogue namespace
 *   and stored beside this file at `locales/en/specimen/skeleton.json`.
 */

import { type ReactElement } from "react";

import { scenesOf, specimen, Tile, useWords } from "@stealthscale/specimen";

import { recipe } from "#skeleton/recipe.ts";
import { Skeleton, type SkeletonProps } from "#skeleton/skeleton.ts";

/**
 * The call site every scene's source snippet is generated from.
 */
const SAMPLE = {
  children: "<p>Ada Lovelace</p>",
  imports: 'import { Skeleton } from "@stealthscale/component-feedback";',
  name: "Skeleton",
};

/**
 * Draws a profile behind the placeholder, which is the box a skeleton takes.
 */
function Profile(props: SkeletonProps): ReactElement {
  const { t } = useWords("skeleton");

  return (
    <Skeleton {...props}>
      <Tile>{t("profile")}</Tile>
    </Skeleton>
  );
}

export default specimen({
  about: "skeleton.about",
  id: "components/feedback/skeleton",
  imports: 'import { Skeleton } from "@stealthscale/component-feedback";',
  scenes: scenesOf<SkeletonProps>(recipe, {
    draw: (props) => <Profile {...props} />,
    namespace: "skeleton",
    order: ["loading", "motion", "radius"],
    sample: SAMPLE,
  }),
  title: "skeleton.title",
});
