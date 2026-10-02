/**
 * Builds this package for the browser under the React, theme, specimen and i18n layers.
 *
 * @remarks
 *   The theme layers add no build step here, because the preset in `src/theme.ts` is hand-written
 *   and the package's own specification catches a recipe file missing from it. The specimen layers
 *   keep the specimen files out of the coverage figures. The i18n layers type the keys the
 *   specimens read from `locales/`, so a misspelt key fails in the editor rather than at run time.
 */

import * as i18n from "@stealthscale/vite-config-i18n";
import * as react from "@stealthscale/vite-config-react";
import * as specimen from "@stealthscale/vite-config-specimen";
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, {
  extends: [react.layers(), theme.layers(), specimen.layers(), i18n.layers()],
});
