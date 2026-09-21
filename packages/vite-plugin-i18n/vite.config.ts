/**
 * Configures the build and the specification run for this package from the node preset.
 *
 * @remarks
 *   The preset supplies every setting and this package adds none. `defineConfig` resolves the
 *   entry points and the output paths from the package root it is given.
 */

import { defineConfig } from "@stealthscale/vite-config/preset/node";

export default defineConfig(import.meta.dirname);
