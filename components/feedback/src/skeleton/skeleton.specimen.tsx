/**
 * Catalogue page for the skeleton.
 *
 * @remarks
 *   `scenesOf` generates one scene per recipe axis. Every scene renders the profile card from
 *   `examples/` and shows that file as its source. The card gives the skeleton a box, because an
 *   empty skeleton collapses to zero height. Each card renders in a `Room` at a sidebar's width.
 *   The words are keys under `skeleton` in `locales/en/specimen/skeleton.json`.
 */

import { Room, scenesOf, specimen } from "@stealthscale/specimen";

import * as profile from "#skeleton/examples/profile.example.tsx";
import { recipe } from "#skeleton/recipe.ts";

export default specimen({
  about: "skeleton.about",
  id: "components/feedback/skeleton",
  imports: 'import { Skeleton } from "@stealthscale/component-feedback";',
  scenes: scenesOf<Parameters<typeof profile.Profile>[0]>(recipe, {
    draw: (props) => (
      <Room size="xs">
        <profile.Profile {...props} />
      </Room>
    ),
    example: profile,
    namespace: "skeleton",
    order: ["loading", "motion", "radius"],
  }),
  title: "skeleton.title",
});
