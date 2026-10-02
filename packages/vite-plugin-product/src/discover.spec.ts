/**
 * Covers finding the installed plugins' packages among loaded modules, with the evaluation order
 * written out by hand over the scratch product's tree.
 */

import { describe, expect, it } from "vitest";

import {
  type ScratchFiles,
  type ScratchWorkspace,
  withScratchWorkspace,
} from "@stealthscale/testing";
import { type Loaded } from "@stealthscale/vite-plugin-base";

import { APP, CONTRACT, DEFINITION as DEFINITION_FILE, PRODUCT, WEB } from "#compose.fixtures.ts";
import { discover, type Discovery } from "#discover.ts";

/**
 * The plugin's contract, as the contract package exports it.
 */
const CONTRACT_OBJECT = { pluginId: "time-off" };

/**
 * The plugin's manifest, as the web package exports it.
 */
const MANIFEST = { code: {}, contract: CONTRACT_OBJECT };

/**
 * A definition that installs the plugin.
 */
const DEFINITION = { plugins: [{ manifest: MANIFEST }] };

/**
 * Returns the modules a definition of the plugin loads, in evaluation order: the contract
 * package's entry, then the web package's manifest module and entry.
 */
function loadedIn(workspace: ScratchWorkspace): readonly Loaded[] {
  return [
    { exports: { contract: CONTRACT_OBJECT }, file: workspace.path(`${CONTRACT}/src/index.ts`) },
    { exports: { manifest: MANIFEST }, file: workspace.path(`${WEB}/src/manifest.ts`) },
    { exports: { manifest: MANIFEST }, file: workspace.path(`${WEB}/src/index.ts`) },
  ];
}

/**
 * Runs discovery over the scratch product with a case's files, and the modules a case lists.
 *
 * @param files - Files that replace or add to the product's.
 * @param loaded - The modules in evaluation order. The plugin's modules by default.
 * @param definition - The definition's default export. One that installs the plugin by default.
 */
function discovered(
  files: ScratchFiles = {},
  loaded: (workspace: ScratchWorkspace) => readonly Loaded[] = loadedIn,
  definition: object = DEFINITION,
): { readonly root: string } & Discovery {
  return withScratchWorkspace({ ...PRODUCT, ...files }, (workspace) => ({
    ...discover(
      definition,
      loaded(workspace),
      workspace.path(APP),
      workspace.path(`${APP}/${DEFINITION_FILE}`),
    ),
    root: workspace.root,
  }));
}

describe("discover", () => {
  it("returns the web package of each installed plugin by plugin id", () => {
    const { packages, root } = discovered();

    expect(packages).toStrictEqual({
      "time-off": { directory: `${root}/${WEB}`, name: "@acme/time-off" },
    });
  });

  it("returns the contract package of each installed plugin by plugin id", () => {
    const { contracts, root } = discovered();

    expect(contracts).toStrictEqual({
      "time-off": { directory: `${root}/${CONTRACT}`, name: "@acme/time-off-contract" },
    });
  });

  it("takes the package of the first module that exports an object", () => {
    const { contracts } = discovered({}, (workspace) => [
      { exports: { contract: CONTRACT_OBJECT }, file: workspace.path(`${CONTRACT}/src/index.ts`) },
      {
        exports: { contract: CONTRACT_OBJECT, manifest: MANIFEST },
        file: workspace.path(`${WEB}/src/index.ts`),
      },
    ]);

    expect(contracts["time-off"]?.name).toBe("@acme/time-off-contract");
  });

  it("skips a module outside every package", () => {
    const { packages } = discovered({}, (workspace) => [
      { exports: { manifest: MANIFEST }, file: workspace.path("loose.ts") },
      ...loadedIn(workspace),
    ]);

    expect(packages["time-off"]?.name).toBe("@acme/time-off");
  });

  it("skips an export that is not an object", () => {
    const { packages } = discovered({}, (workspace) => [
      { exports: { version: "1.0.0" }, file: workspace.path(`${CONTRACT}/src/index.ts`) },
      ...loadedIn(workspace),
    ]);

    expect(packages["time-off"]?.name).toBe("@acme/time-off");
  });

  it("leaves out a web package the product does not depend on", () => {
    const { contracts, packages } = discovered({
      [`${APP}/package.json`]: JSON.stringify({ name: "@acme/people", private: true }),
    });

    expect(packages).toStrictEqual({});
    expect(contracts["time-off"]?.name).toBe("@acme/time-off-contract");
  });

  it("returns the product's own package for a plugin the product defines", () => {
    const { packages, root } = discovered({}, (workspace) => [
      { exports: { contract: CONTRACT_OBJECT }, file: workspace.path(`${CONTRACT}/src/index.ts`) },
      { exports: { manifest: MANIFEST }, file: workspace.path(`${APP}/src/manifest.ts`) },
    ]);

    expect(packages).toStrictEqual({
      "time-off": { directory: `${root}/${APP}`, name: "@acme/people" },
    });
  });

  it("gives a manifest no loaded module exports the definition module's package", () => {
    const { contracts, packages, root } = discovered({}, () => []);

    expect({ contracts, packages }).toStrictEqual({
      contracts: {},
      packages: { "time-off": { directory: `${root}/${APP}`, name: "@acme/people" } },
    });
  });

  it.each([
    { label: "states no name", manifest: JSON.stringify({ version: "1.0.0" }) },
    { label: "does not parse", manifest: "{" },
  ])("leaves out a package whose manifest $label", ({ manifest }) => {
    const { packages } = discovered({ [`${WEB}/package.json`]: manifest });

    expect(packages).toStrictEqual({});
  });

  it.each([
    { definition: {}, label: "no plugins" },
    { definition: { plugins: "time-off" }, label: "plugins that are not an array" },
    { definition: { plugins: [null] }, label: "a plugin that is not an object" },
    { definition: { plugins: [{ manifest: 1 }] }, label: "a manifest that is not an object" },
    {
      definition: { plugins: [{ manifest: { contract: null } }] },
      label: "a contract that is not an object",
    },
    {
      definition: { plugins: [{ manifest: { contract: { pluginId: 7 } } }] },
      label: "a plugin id that is not a string",
    },
  ])("finds no package for a definition with $label", ({ definition }) => {
    const { contracts, packages } = discovered({}, loadedIn, definition);

    expect({ contracts, packages }).toStrictEqual({ contracts: {}, packages: {} });
  });
});
