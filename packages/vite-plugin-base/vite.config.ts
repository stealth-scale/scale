/**
 * Builds and tests this package under the plain configuration.
 *
 * @remarks
 *   The configuration tiers are built on the plugin packages themselves, so a plugin extending a
 *   tier would pack itself with a copy of itself. The plain configuration states the same settings
 *   directly.
 */

import { defineConfig } from "vite";

import { plain } from "@stealthscale/vite-config-plain";

export default defineConfig(plain);
