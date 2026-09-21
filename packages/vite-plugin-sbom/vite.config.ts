/**
 * Builds this package under the settings the plain tier states.
 *
 * @remarks
 *   Every tier packs through this plugin, so building the package from a tier would make it depend
 *   on its own output.
 */

import { defineConfig } from "vite";

import { plain } from "@stealthscale/vite-config-plain";

export default defineConfig(plain);
