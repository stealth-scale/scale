/**
 * Configures a browser application that is deployed rather than published.
 */

import { configuring, type Defining, type Extendable } from "@stealthscale/vite-config-core";

import * as build from "#build/index.ts";
import * as lint from "#lint/index.ts";
import { house } from "#preset/house.ts";
import * as server from "#server/index.ts";
import * as test from "#test/index.ts";
import * as worker from "#worker/index.ts";

/**
 * Lists the layers a browser application is built, linted, tested, served and
 * bundled with.
 *
 * @remarks
 *   Nothing here packs an entry point or writes an exports map, because an
 *   application has no consumer to read one. What the web tier spends on
 *   packing, this tier spends on build output, on bundling a worker as a
 *   module, and on serving the application from one bundle in development,
 *   because an application is what a dev server serves.
 */
export function layers(): readonly Extendable[] {
  return [
    ...house(),
    build.preset.web(),
    lint.preset.web(),
    test.preset.web(),
    worker.format(),
    server.bundled(),
  ];
}

/**
 * Composes the Vite configuration of a deployed browser application.
 *
 * @remarks
 *   The layers are placed ahead of whatever a repository extends, so a key the
 *   application sets by hand stands over the same key a layer set.
 */
export const defineConfig: Defining = configuring(layers);
