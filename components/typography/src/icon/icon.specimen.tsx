/**
 * Catalogue page for the icon.
 *
 * @remarks
 *   `scenesOf` generates one scene per recipe axis. The examples pass lucide icons through `as`: a
 *   star for the size, ink and motion scenes, and an arrow for the mirroring scene, because a
 *   mirrored star looks the same. The ink, motion and mirroring scenes render at `lg`. The tone
 *   scene renders the inverted ink on `bg.inverted` through `grounded`. Every scene renders a
 *   component from `examples/` and shows that file as its source. The words are keys under `icon`
 *   in `locales/en/specimen/icon.json`.
 */

import { grounded, scenesOf, specimen } from "@stealthscale/specimen";

import * as favourite from "#icon/examples/favourite.example.tsx";
import * as next from "#icon/examples/next.example.tsx";
import { recipe } from "#icon/recipe.ts";

export default specimen({
  about: "icon.about",
  id: "components/typography/icon",
  imports: 'import { Icon } from "@stealthscale/component-typography";',
  scenes: scenesOf<Parameters<typeof favourite.Favourite>[0]>(recipe, {
    axes: {
      mirrored: {
        draw: (props) => <next.Next {...props} />,
        example: next,
        with: { size: "lg" },
      },
      motion: { with: { size: "lg" } },
      tone: {
        draw: (props) => grounded(props.tone, <favourite.Favourite {...props} />),
        with: { size: "lg" },
      },
    },
    draw: (props) => <favourite.Favourite {...props} />,
    example: favourite,
    namespace: "icon",
    order: ["size", "tone", "motion", "mirrored"],
  }),
  title: "icon.title",
});
