/**
 * Publishes the preset that registers every recipe in this package, for an application's compiler
 * to install.
 *
 * @remarks
 *   The list is written by hand. The package's own specification reports a recipe file the list
 *   leaves out, so no generator runs here.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as accordion } from "#accordion/recipe.ts";
import { recipe as collapsible } from "#collapsible/recipe.ts";
import { recipe as details } from "#details/recipe.ts";
import { recipe as hoverCard } from "#hover-card/recipe.ts";
import { recipe as menu } from "#menu/recipe.ts";
import { recipe as menubar } from "#menubar/recipe.ts";
import { recipe as popover } from "#popover/recipe.ts";
import { recipe as steps } from "#steps/recipe.ts";
import { recipe as tabs } from "#tabs/recipe.ts";
import { recipe as toggleTip } from "#toggle-tip/recipe.ts";
import { recipe as tooltip } from "#tooltip/recipe.ts";
import { recipe as truncate } from "#truncate/recipe.ts";

export default definePreset({
  name: "@stealthscale/component-disclosure",
  theme: {
    extend: {
      recipes: { truncate },
      slotRecipes: {
        accordion,
        collapsible,
        details,
        hoverCard,
        menu,
        menubar,
        popover,
        steps,
        tabs,
        toggleTip,
        tooltip,
      },
    },
  },
});
