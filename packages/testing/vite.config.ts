/**
 * Configures the build and the test run for this package.
 *
 * @remarks
 *   The node preset decides every setting and this package departs from none, so there is no layer
 *   to add. `import.meta.dirname` is the package root, which the entry points and the output paths
 *   resolve against.
 */

import { defineConfig } from "@stealthscale/vite-config/preset/node";

export default defineConfig(import.meta.dirname);
