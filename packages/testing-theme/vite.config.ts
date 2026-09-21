/**
 * Builds the theme testing kit, packed for Node.
 *
 * @remarks
 *   The kit needs both tiers. It reads a package's source off the filesystem and resolves a font
 *   package through node:module, and it reads the classes on a rendered element, which needs the
 *   DOM types only the web tier declares. The web tier builds it, and `pack.platform("node")`
 *   declares the platform so that `vp pack` accepts every Node builtin the kit imports.
 */

import { pack } from "@stealthscale/vite-config";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [pack.platform("node")] });
