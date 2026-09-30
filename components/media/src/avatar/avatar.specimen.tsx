/**
 * Catalogue page for the avatar.
 *
 * @remarks
 *   `scenesOf` generates the size, shape, palette and effect scenes from the avatar recipe, each
 *   rendering one person's initials. The palette scene crosses the looks, and the effect scene uses
 *   the primary palette. It generates the badge's palette, placement and look scenes from the badge
 *   recipe on a large avatar with a count. Hand-written scenes render pictures beside initials, a
 *   team group, the four kinds of badge, a status dot at every size, a byline beside a name in
 *   words, and services with icons. The pictures are generated gradients beside the examples, so no
 *   scene loads from the network. The words are keys under `avatar` in
 *   `locales/en/specimen/avatar.json`.
 */

import { Matrix, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import { recipe as badgeRecipe } from "#avatar/avatar-badge.recipe.ts";
import * as examples from "#avatar/examples/index.ts";
import { type BadgeProps, type RootProps } from "#avatar/index.ts";
import { recipe } from "#avatar/recipe.ts";

/**
 * Sizes of the status scene, smallest first.
 */
const SIZES = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"] as const;

/**
 * Hand-written scene for pictures beside a person without one.
 */
export const pictures: Scene = {
  about: "avatar.pictures.about",
  draw: examples.pictures.Pictures,
  example: examples.pictures,
  title: "avatar.pictures.title",
};

/**
 * Hand-written scene for a group with a count of the people left out.
 */
export const team: Scene = {
  about: "avatar.team.about",
  draw: examples.team.Team,
  example: examples.team,
  title: "avatar.team.title",
};

/**
 * Hand-written scene for a status dot, a count, an emoji and an icon.
 */
export const badges: Scene = {
  about: "avatar.badges.about",
  draw: examples.badges.Badges,
  example: examples.badges,
  title: "avatar.badges.title",
};

/**
 * Hand-written scene for a status dot at every size.
 */
export const presence: Scene = {
  about: "avatar.presence.about",
  draw: () => (
    <Matrix knob="size" of={SIZES}>
      {(size) => <examples.presence.Presence size={size} />}
    </Matrix>
  ),
  example: examples.presence,
  props: { size: "2xs" },
  title: "avatar.presence.title",
};

/**
 * Hand-written scene for an avatar beside the same name in words.
 */
export const byline: Scene = {
  about: "avatar.byline.about",
  draw: examples.byline.Byline,
  example: examples.byline,
  title: "avatar.byline.title",
};

/**
 * Hand-written scene for services and companies in square and rounded boxes.
 */
export const services: Scene = {
  about: "avatar.services.about",
  draw: examples.services.Services,
  example: examples.services,
  title: "avatar.services.title",
};

export default specimen({
  about: "avatar.about",
  id: "components/media/avatar",
  imports: 'import { Avatar } from "@stealthscale/component-media";',
  scenes: [
    ...scenesOf<RootProps>(recipe, {
      axes: {
        effect: { with: { palette: "primary" } },
        palette: { across: "variant" },
      },
      draw: (props) => <examples.person.Person {...props} />,
      example: examples.person,
      namespace: "avatar",
      order: ["size", "shape", "palette", "effect"],
    }),
    pictures,
    team,
    badges,
    presence,
    ...scenesOf<BadgeProps>(badgeRecipe, {
      draw: (props) => <examples.badged.Badged {...props} />,
      example: examples.badged,
      namespace: "avatar.badge",
      order: ["placement", "palette", "variant"],
    }),
    byline,
    services,
  ],
  title: "avatar.title",
});
