/**
 * Covers the names of the plugin chunks over a module graph written out by hand: an entry, the
 * definition, a web package's main entry and manifest, and its lazy modules.
 */

import { describe, expect, it } from "vitest";

import { type Chunking, pluginChunkOf } from "#chunks.ts";

/**
 * The web package's directory.
 */
const WEB = "/people/node_modules/@acme/time-off";

/**
 * Each installed plugin's web package, by plugin id.
 */
const PACKAGES = { "time-off": { directory: WEB, name: "@acme/time-off" } };

/**
 * The static importers of each module of the graph, and whether it is an entry.
 */
const GRAPH: Readonly<
  Record<string, { readonly importers: readonly string[]; readonly isEntry: boolean }>
> = {
  "/people/src/main.ts": { importers: [], isEntry: true },
  "/people/src/product.ts": { importers: ["\0virtual:product"], isEntry: false },
  [`${WEB}/src/cycle-a.ts`]: { importers: [`${WEB}/src/cycle-b.ts`], isEntry: false },
  [`${WEB}/src/cycle-b.ts`]: { importers: [`${WEB}/src/cycle-a.ts`], isEntry: false },
  [`${WEB}/src/index.ts`]: { importers: ["/people/src/product.ts"], isEntry: false },
  [`${WEB}/src/manifest.ts`]: { importers: [`${WEB}/src/index.ts`], isEntry: false },
  [`${WEB}/src/orphan.ts`]: { importers: ["/unknown.ts"], isEntry: false },
  [`${WEB}/src/overview.ts`]: { importers: [], isEntry: false },
  [`${WEB}/src/parts.ts`]: { importers: [`${WEB}/src/overview.ts`], isEntry: false },
  "\0virtual:product": { importers: ["/people/src/main.ts"], isEntry: false },
};

/**
 * The context rolldown passes a group's name function, over {@link GRAPH}.
 */
const CHUNKING: Chunking = { getModuleInfo: (id) => GRAPH[id] ?? null };

describe("chunks", () => {
  it("names a lazy module of a web package after its plugin", () => {
    expect(pluginChunkOf(`${WEB}/src/overview.ts`, CHUNKING, PACKAGES)).toBe("plugin-time-off");
  });

  it("names a module a lazy module imports statically after its plugin", () => {
    expect(pluginChunkOf(`${WEB}/src/parts.ts`, CHUNKING, PACKAGES)).toBe("plugin-time-off");
  });

  it("leaves the web package's main entry to the entry's chunks", () => {
    expect(pluginChunkOf(`${WEB}/src/index.ts`, CHUNKING, PACKAGES)).toBeNull();
  });

  it("leaves a module the main entry imports statically to the entry's chunks", () => {
    expect(pluginChunkOf(`${WEB}/src/manifest.ts`, CHUNKING, PACKAGES)).toBeNull();
  });

  it("leaves a module outside every web package to the other groups", () => {
    expect(pluginChunkOf("/people/src/product.ts", CHUNKING, PACKAGES)).toBeNull();
  });

  it("leaves a module of a package whose directory the web package's directory prefixes", () => {
    expect(pluginChunkOf(`${WEB}-extra/src/index.ts`, CHUNKING, PACKAGES)).toBeNull();
  });

  it("names a module in a cycle of static imports after its plugin", () => {
    expect(pluginChunkOf(`${WEB}/src/cycle-a.ts`, CHUNKING, PACKAGES)).toBe("plugin-time-off");
  });

  it("reads an importer the build does not know as no entry", () => {
    expect(pluginChunkOf(`${WEB}/src/orphan.ts`, CHUNKING, PACKAGES)).toBe("plugin-time-off");
  });
});
