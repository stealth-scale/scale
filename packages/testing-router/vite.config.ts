/**
 * Configures the build and the specification run for this package.
 *
 * @remarks
 *   The web preset gives each specification a document, and the React layers give it a JSX
 *   transform. The helpers render a router into that document, so both are required.
 */

import * as react from "@stealthscale/vite-config-react";
import { defineConfig } from "@stealthscale/vite-config/preset/web";

export default defineConfig(import.meta.dirname, { extends: [react.layers()] });
