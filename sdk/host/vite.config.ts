/**
 * Configures the build and the specification run for this package.
 *
 * @remarks
 *   The web preset gives each specification a document, because the host's parts render in one.
 *   The React layers give their specifications a JSX transform. The i18n layers type the host's
 *   words in `locales/` and put the fallback language in scope for the specifications.
 */

import * as i18n from "@stealthscale/vite-config-i18n";
import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [react.layers(), i18n.layers()] });
