/**
 * Configures the build of this package for the browser, over the React, theme, specimen and i18n
 * layers.
 *
 * @remarks
 *   The theme layers generate nothing here: `src/theme.ts` is maintained by hand and the package
 *   spec fails when a recipe is missing from it. The specimen layers exclude the specimen files
 *   from the coverage denominator. The i18n layers generate types from `locales/`, which turns a
 *   misspelled key in a specimen into a type error in the editor.
 */

import * as i18n from "@stealthscale/vite-config-i18n";
import * as react from "@stealthscale/vite-config-react";
import * as specimen from "@stealthscale/vite-config-specimen";
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, {
  extends: [react.layers(), theme.layers(), specimen.layers(), i18n.layers()],
});
