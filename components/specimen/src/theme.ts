/**
 * Publishes the kit's recipes as a preset, for the compiler of a catalogue that draws with it.
 *
 * @remarks
 *   The preset also makes the root of a framed document see-through, over the background the
 *   theme paints every root in, so a sample shown in a device sits on the card that holds the
 *   frame the way it sits on the page.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as device } from "#device/recipe.ts";
import { FRAMED_ATTRIBUTE } from "#framed/attribute.ts";
import { recipe as pane } from "#framed/pane.recipe.ts";
import { recipe as matrix } from "#matrix/recipe.ts";
import { recipe as room } from "#room/recipe.ts";
import { recipe as sample } from "#sample/recipe.ts";
import { recipe as tile } from "#tile/recipe.ts";

export default definePreset({
  globalCss: { [`html[${FRAMED_ATTRIBUTE}]`]: { background: "transparent" } },
  name: "@stealthscale/specimen",
  theme: {
    extend: {
      recipes: { pane, room, tile },
      slotRecipes: { device, matrix, sample },
    },
  },
});
