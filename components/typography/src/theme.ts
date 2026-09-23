/**
 * Publishes the preset that registers every recipe in this package, for an application's compiler
 * to install.
 *
 * @remarks
 *   The list is written by hand. The package's own specification reports a recipe file the list
 *   leaves out, so no generator runs here.
 */

/* eslint-disable import/max-dependencies -- a preset names every recipe its package registers, so its dependency count is the size of the package */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as blockquote } from "#blockquote/recipe.ts";
import { recipe as code } from "#code/recipe.ts";
import { recipe as em } from "#em/recipe.ts";
import { recipe as heading } from "#heading/recipe.ts";
import { recipe as icon } from "#icon/recipe.ts";
import { recipe as kbdGroup } from "#kbd/kbd-group.recipe.ts";
import { recipe as kbd } from "#kbd/recipe.ts";
import { recipe as list } from "#list/recipe.ts";
import { recipe as mark } from "#mark/recipe.ts";
import { recipe as quote } from "#quote/recipe.ts";
import { recipe as span } from "#span/recipe.ts";
import { recipe as strong } from "#strong/recipe.ts";
import { recipe as text } from "#text/recipe.ts";

export default definePreset({
  name: "@stealthscale/component-typography",
  theme: {
    extend: {
      recipes: { code, em, heading, icon, kbd, kbdGroup, mark, quote, span, strong, text },
      slotRecipes: { blockquote, list },
    },
  },
});
