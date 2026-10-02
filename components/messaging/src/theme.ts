/**
 * Registers every recipe in the package in the preset an application's style compiler installs.
 *
 * @remarks
 *   The list is written by hand. `theme.spec.ts` fails when a recipe file is missing from it, so no
 *   generator writes it.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as attachment } from "#attachment/recipe.ts";
import { recipe as composer } from "#composer/recipe.ts";
import { recipe as conversation } from "#conversation/recipe.ts";
import { recipe as message } from "#message/recipe.ts";
import { recipe as reactions } from "#reactions/recipe.ts";

export default definePreset({
  name: "@stealthscale/component-messaging",
  theme: {
    extend: {
      slotRecipes: { attachment, composer, conversation, message, reactions },
    },
  },
});
