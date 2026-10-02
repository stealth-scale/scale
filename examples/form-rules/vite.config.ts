/**
 * Builds this example as a React application in one theme, on its own port.
 *
 * @remarks
 *   The stylesheet compiler reads `theme.config.ts` for the theme, and the preset of every package
 *   on the dependency graph that publishes one, so the form's controls take their recipes.
 */

import { server } from "@stealthscale/vite-config";
import * as react from "@stealthscale/vite-config-react";
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

export default defineConfig(import.meta.dirname, {
  extends: [react.layers(), theme.stylesheet(), server.port(4910)],
});
