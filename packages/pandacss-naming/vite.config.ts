/**
 * Builds and tests this package with the web tier.
 *
 * @remarks
 *   The naming scheme runs in the browser as well as in Node and touches no platform API, so it
 *   qualifies for the web tier. `defineConfig` derives the entry point and the output paths from
 *   the package root it is handed.
 */

import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname);
