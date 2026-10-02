/**
 * Configures the build and the specification run for this package from the node tier.
 *
 * @remarks
 *   The node tier configures a package that ships no browser code.
 */

import { defineConfig } from "@stealthscale/vite-config/preset/node";

export default defineConfig(import.meta.dirname);
