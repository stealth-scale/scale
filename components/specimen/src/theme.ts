/**
 * Publishes the kit's recipes as a preset, for the compiler of a catalogue that draws with it.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as matrix } from "#matrix/recipe.ts";
import { recipe as room } from "#room/recipe.ts";
import { recipe as sample } from "#sample/recipe.ts";
import { recipe as stage } from "#stage/recipe.ts";
import { recipe as tile } from "#tile/recipe.ts";

export default definePreset({
  name: "@stealthscale/specimen",
  theme: {
    extend: {
      recipes: { room, stage, tile },
      slotRecipes: { matrix, sample },
    },
  },
});
