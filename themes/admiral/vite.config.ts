/**
 * Builds the theme package for a browser, with the theme layers added.
 *
 * @remarks
 *   The theme layers contribute nothing. The theme is written by hand, and its own specification
 *   runs it through the gate, so no plugin runs here.
 */

import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [theme.layers()] });
