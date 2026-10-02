/**
 * Publishes the preset that registers every recipe in this package, for an application's compiler
 * to install.
 *
 * @remarks
 *   The list is written by hand. The package's own specification reports a recipe file the list
 *   leaves out, so no generator runs here.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as actionBar } from "#action-bar/recipe.ts";
import { recipe as appShell } from "#app-shell/recipe.ts";
import { recipe as floatingPanel } from "#floating-panel/recipe.ts";
import { recipe as page } from "#page/recipe.ts";
import { recipe as section } from "#section/recipe.ts";
import { recipe as sidebar } from "#sidebar/recipe.ts";
import { recipe as splitter } from "#splitter/recipe.ts";
import { recipe as switcher } from "#switcher/recipe.ts";
import { recipe as toolbar } from "#toolbar/recipe.ts";

export default definePreset({
  name: "@stealthscale/component-screen",
  theme: {
    extend: {
      slotRecipes: {
        actionBar,
        appShell,
        floatingPanel,
        page,
        section,
        sidebar,
        splitter,
        switcher,
        toolbar,
      },
    },
  },
});
