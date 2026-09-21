/**
 * Builds this package for the browser under the React, specimen and i18n layers.
 *
 * @remarks
 *   Nothing here binds a recipe, so the theme layers are absent. The specimen layers keep the
 *   specimen files out of the coverage figures. The i18n layers type the keys the specimens read
 *   from `locales/`, so a misspelt key fails in the editor rather than at run time.
 */

import * as i18n from "@stealthscale/vite-config-i18n";
import * as react from "@stealthscale/vite-config-react";
import * as specimen from "@stealthscale/vite-config-specimen";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, {
  extends: [react.layers(), specimen.layers(), i18n.layers()],
});
