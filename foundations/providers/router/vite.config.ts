/**
 * Configures the build and the specification run for this package.
 *
 * @remarks
 *   The web preset gives each specification a document, because every hook here measures one. The
 *   React layers give the provider's specifications a JSX transform. The specimen layers exclude
 *   the route link's specimen and its examples from the coverage count, as in every package with a
 *   specimen.
 */

import * as react from "@stealthscale/vite-config-react";
import * as specimen from "@stealthscale/vite-config-specimen";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, {
  extends: [react.layers(), specimen.layers()],
});
