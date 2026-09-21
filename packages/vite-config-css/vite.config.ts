/**
 * Builds and tests this package with the node tier.
 *
 * @remarks
 *   The package holds lint rules and a plugin that police other packages' CSS. It ships no CSS and
 *   no browser code of its own, so everything in it runs in Node during a build or a lint run.
 */

import { defineConfig } from "@stealthscale/vite-config/preset/node";

export default defineConfig(import.meta.dirname);
