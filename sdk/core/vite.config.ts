/**
 * Configures the build and the specification run for this package.
 *
 * @remarks
 *   The base preset commits the package to no runtime. The build loads it in Node, the host in a
 *   browser, and a service in either, so neither a Node built-in nor the document is in scope.
 */

import { defineConfig } from "@stealthscale/vite-config/preset/base";

export default defineConfig(import.meta.dirname);
