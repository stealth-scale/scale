/**
 * Builds the catalogue: the React layers, the stylesheet compiler, and the specimen index.
 *
 * @remarks
 *   The patterns reach across the workspace rather than into this directory, because a catalogue
 *   shows the components of the packages beside it and holds none of its own. The React Compiler
 *   runs in the build alone: a build and a preview exercise what ships, and a day of editing runs
 *   without the compile per save. The dev server bundles unless `STEALTH_DEV_SERVER=standard` is
 *   set, which the `dev:standard` script does for the module-per-file server.
 */

import { remove, server } from "@stealthscale/vite-config";
import * as i18n from "@stealthscale/vite-config-i18n";
import * as react from "@stealthscale/vite-config-react";
import * as specimen from "@stealthscale/vite-config-specimen";
import * as theme from "@stealthscale/vite-config-theme";
import { defineConfig } from "@stealthscale/vite-config/preset/app";

/**
 * The variable that picks the module-per-file dev server over the bundling one.
 */
const STANDARD = process.env["STEALTH_DEV_SERVER"] === "standard";

export default defineConfig(import.meta.dirname, {
  extends: [
    react.layers({ compiler: "build" }),
    i18n.layers(),
    theme.stylesheet(),
    specimen.catalogue({ patterns: ["../../components/*/src/**/*.specimen.tsx"], props: {} }),
    server.port(4100),
    ...(STANDARD
      ? [
          remove({
            because:
              "the module-per-file server is the fallback for a change the bundling server " +
              "cannot follow, and the script that sets the variable says which one it is",
            name: "docs.server.standard",
            target: "server.bundled",
          }),
        ]
      : []),
  ],
});
