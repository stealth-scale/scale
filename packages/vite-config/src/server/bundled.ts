/**
 * Serves an application from one bundle rather than one module per file.
 */

import { override, type Override } from "@stealthscale/vite-config-core";

/**
 * The mode a specification run composes its configuration under.
 *
 * @remarks
 *   The test runner serves its files through the same server, and a bundled one parses a setup
 *   file another package publishes as plain script, which TypeScript is not. A specification run
 *   reads one file at a time anyway, so there is nothing for a bundle to win there.
 */
const TESTING = "test";

/**
 * Bundles the application before serving it, the way a build does, so a page loads a handful of
 * chunks rather than every module in its graph.
 *
 * @remarks
 *   The module-per-file server transforms and serves each file on request: a catalogue page cost
 *   729 requests and 19 MB on a cold load, and every frame the page opened cost them again. The
 *   bundling server answers the same page in nine requests, and a frame in eight, from chunks the
 *   browser keeps. Vite marks the mode experimental: a hot update is computed in the browser from
 *   what ran rather than on the server from the graph, and a plugin's hot update hook is handed no
 *   environment, which the house plugins allow for. An override rather than a preset, because only
 *   an override is handed the mode, and a specification run is left as it was.
 */
export function bundled(): Override {
  return override({
    because:
      "a page served from one bundle loads a handful of chunks rather than every module in its " +
      "graph, and a frame the page opens loads them from the browser's cache",
    name: "server.bundled",
    refine: (context, config) =>
      context.mode === TESTING
        ? config
        : { ...config, experimental: { ...config.experimental, bundledDev: true } },
  });
}
