/**
 * Registers every recipe in the package in the preset an application's style compiler installs.
 *
 * @remarks
 *   The list is written by hand. `theme.spec.ts` fails when a recipe file is missing from it, so no
 *   generator writes it.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as audio } from "#audio/recipe.ts";
import { recipe as avatarBadge } from "#avatar/avatar-badge.recipe.ts";
import { recipe as avatar } from "#avatar/recipe.ts";
import { recipe as carousel } from "#carousel/recipe.ts";
import { recipe as iframe } from "#iframe/recipe.ts";
import { recipe as imageCropper } from "#image-cropper/recipe.ts";
import { recipe as video } from "#video/recipe.ts";

export default definePreset({
  name: "@stealthscale/component-media",
  theme: {
    extend: {
      recipes: { audio, avatarBadge, iframe, video },
      slotRecipes: { avatar, carousel, imageCropper },
    },
  },
});
