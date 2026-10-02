/**
 * Configures the build and the specification run for this package from the plain config object.
 *
 * @remarks
 *   Every tier depends on this package, so composing a tier here would make the package configure
 *   itself. Vite receives the plain object directly and no layer resolves.
 */

import { defineConfig } from "vite";

import { plain } from "@stealthscale/vite-config-plain";

export default defineConfig(plain);
