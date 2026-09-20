/**
 * Serves an application from one bundle rather than one module per file.
 */

import { type UserConfig } from "vite";

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
 * The command a dev server composes its configuration under.
 *
 * @remarks
 *   A build is left alone. The mode is the dev server's, and the bundler reads the dev mode
 *   option under a build too: stated there, it loads a dev runtime the build has no use for and
 *   the packer's own build fails resolving it.
 */
const SERVING = "serve";

/**
 * The bundler's options, as the build states them.
 */
type Bundling = NonNullable<NonNullable<UserConfig["build"]>["rolldownOptions"]>;

/**
 * Bundles every dynamic import up front rather than when a browser first asks for it.
 *
 * @remarks
 *   The bundling server compiles a lazy import on the first request, and marks its output stale
 *   until a rebuild has folded the compiled module in. A document requested in that window, a
 *   frame the page opens or the source map a browser's tools ask for, is answered with the
 *   server's spinner page and reloads every client, and the reloaded page asks for its imports
 *   again. A catalogue page reloaded 39 times in 20 seconds. Bundled up front, a page's chunks
 *   are built once when the server starts, which costs the start five seconds more, and a page
 *   nobody visited yet opens as fast as one somebody did.
 */
function eager(bundling: Bundling | undefined): Bundling {
  return { ...bundling, experimental: { ...bundling?.experimental, devMode: { lazy: false } } };
}

/**
 * Bundles the application before serving it, the way a build does, so a page loads a handful of
 * chunks rather than every module in its graph.
 *
 * @remarks
 *   The module-per-file server transforms and serves each file on request: a catalogue page cost
 *   729 requests and 19 MB on a cold load, and every frame the page opened cost them again. The
 *   bundling server answers the same page in nine requests, and a frame in eight, from chunks the
 *   browser keeps. Vite marks the mode experimental: a hot update is computed in the browser from
 *   what ran rather than on the server from the graph, and a plugin's hot update hook is not
 *   called, which the house plugins allow for. An override rather than a preset, because only an
 *   override is handed the command and the mode, and a build and a specification run are left as
 *   they were.
 */
export function bundled(): Override {
  return override({
    because:
      "a page served from one bundle loads a handful of chunks rather than every module in its " +
      "graph, and a frame the page opens loads them from the browser's cache",
    name: "server.bundled",
    refine: (context, config) =>
      context.command !== SERVING || context.mode === TESTING
        ? config
        : {
            ...config,
            build: { ...config.build, rolldownOptions: eager(config.build?.rolldownOptions) },
            experimental: { ...config.experimental, bundledDev: true },
          },
  });
}
