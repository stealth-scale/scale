/**
 * Builds the package for a browser, with the React and i18n layers added.
 *
 * @remarks
 *   No theme layers, because the package states no recipe of its own. Every part it draws is a
 *   component of the library, which carries the recipe a theme moves.
 *   The i18n layers type the catalogue's own words and put them in scope for the specifications, so
 *   a specification reads what a reader reads rather than the key.
 */

import * as i18n from "@stealthscale/vite-config-i18n";
import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [react.layers(), i18n.layers()] });
