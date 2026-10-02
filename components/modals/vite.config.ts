/**
 * Builds the package for the browser with the React, theme, specimen and i18n layers applied.
 *
 * @remarks
 *   The theme layers contribute no code generation here, since the preset in `src/theme.ts` is
 *   hand-written and the package specification catches a recipe file left out of it. The specimen
 *   layers exclude specimen files from the coverage figures. The i18n layers type the keys the
 *   specimens read from `locales/`, so a misspelled key fails in the editor instead of rendering
 *   as an empty string. The package's own setup file declares the global the tour machine reads.
 */

import { contribute } from "@stealthscale/vite-config";
import * as i18n from "@stealthscale/vite-config-i18n";
import * as react from "@stealthscale/vite-config-react";
import * as specimen from "@stealthscale/vite-config-specimen";
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, {
  extends: [
    react.layers(),
    theme.layers(),
    specimen.layers(),
    i18n.layers(),
    contribute({
      at: "test.setupFiles",
      because:
        "the tour machine reads the global visualViewport, which the DOM the specifications run " +
        "in does not declare",
      item: `${import.meta.dirname}/vitest.setup.ts`,
      name: "modals.test.viewport",
    }),
  ],
});
