/**
 * Builds the primitives package for a browser, with the React, specimen and i18n layers added.
 *
 * @remarks
 *   The package binds no recipe, so it needs no theme layers. The specimen layers stop the package
 *   counting its specimens towards its coverage. The i18n layers type the words the specimens read
 *   out of `locales/`, so a key a specimen misspells is an error in the editor.
 */

import * as i18n from "@stealthscale/vite-config-i18n";
import * as react from "@stealthscale/vite-config-react";
import * as specimen from "@stealthscale/vite-config-specimen";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, {
  extends: [react.layers(), specimen.layers(), i18n.layers()],
});
