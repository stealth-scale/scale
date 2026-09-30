/**
 * Publishes the kit's recipes as a preset, for the compiler of a catalogue that renders with it.
 *
 * @remarks
 *   The preset also makes the root of a framed document transparent over the background the theme
 *   paints every root in, so a sample in a device renders on the card around the frame as it
 *   renders on the page.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as contained } from "#contained/recipe.ts";
import { recipe as device } from "#device/recipe.ts";
import { FRAMED_ATTRIBUTE } from "#framed/attribute.ts";
import { recipe as pane } from "#framed/pane.recipe.ts";
import { recipe as matrix } from "#matrix/recipe.ts";
import { recipe as room } from "#room/recipe.ts";
import { recipe as sample } from "#sample/recipe.ts";
import { recipe as screen } from "#screen/recipe.ts";
import { recipe as tile } from "#tile/recipe.ts";

export default definePreset({
  globalCss: { [`html[${FRAMED_ATTRIBUTE}]`]: { background: "transparent" } },
  name: "@stealthscale/specimen",
  theme: {
    extend: {
      recipes: { contained, pane, room, screen, tile },
      slotRecipes: { device, matrix, sample },
    },
  },
});
