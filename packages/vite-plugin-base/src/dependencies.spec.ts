/**
 * Covers the walk over a manifest's dependencies, installed under a scratch node_modules.
 */

import { describe, expect, it } from "vitest";

import {
  manifest,
  packageFiles,
  type ScratchFiles,
  withScratchWorkspace,
} from "@stealthscale/testing";

import { dependencies, type Dependency, packageAt, resolvedOnGraph } from "#dependencies.ts";

/**
 * Installs one package under node_modules, with an entry and the manifest fields given.
 */
function installed(
  name: string,
  dependsOn: readonly string[] = [],
  fields: Record<string, unknown> = {},
): ScratchFiles {
  return packageFiles(
    `node_modules/${name}`,
    {
      dependencies: Object.fromEntries(dependsOn.map((each) => [each, "*"])),
      exports: { ".": "./index.js", "./package.json": "./package.json" },
      name,
      ...fields,
    },
    { "index.js": "export {};\n" },
  );
}

/**
 * Writes the root manifest, depending on the names given.
 */
function root(dependsOn: readonly string[]): ScratchFiles {
  return {
    "package.json": manifest({
      dependencies: Object.fromEntries(dependsOn.map((each) => [each, "*"])),
      name: "@acme/app",
    }),
  };
}

/**
 * Walks the dependencies of a scratch workspace holding `files`, and returns the names in order.
 */
function named(files: ScratchFiles): readonly string[] {
  return withScratchWorkspace(files, (workspace) =>
    dependencies(workspace.root).map((each) => each.named),
  );
}

/**
 * Walks the dependencies of a scratch workspace and returns each record with its path made
 * relative to the workspace root.
 */
function walked(files: ScratchFiles): readonly Dependency[] {
  return withScratchWorkspace(files, (workspace) =>
    dependencies(workspace.root).map((each) => ({
      at: each.at.slice(workspace.root.length + 1),
      dependsOn: each.dependsOn,
      manifest: each.manifest,
      named: each.named,
    })),
  );
}

describe("dependencies", () => {
  it("lists a package the root depends on", () => {
    expect(named({ ...root(["@acme/kit"]), ...installed("@acme/kit") })).toStrictEqual([
      "@acme/kit",
    ]);
  });

  it("records where a package is and what it depends on", () => {
    const [deep, kit] = walked({
      ...root(["@acme/kit"]),
      ...installed("@acme/kit", ["@acme/deep"]),
      ...installed("@acme/deep"),
    });

    expect(kit).toMatchObject({
      at: "node_modules/@acme/kit",
      dependsOn: ["@acme/deep"],
      named: "@acme/kit",
    });
    expect(kit?.manifest["name"]).toBe("@acme/kit");
    expect(deep?.named).toBe("@acme/deep");
  });

  it("places a package after the package it depends on", () => {
    expect(
      named({
        ...root(["@acme/extra"]),
        ...installed("@acme/extra", ["@acme/base"]),
        ...installed("@acme/base"),
      }),
    ).toStrictEqual(["@acme/base", "@acme/extra"]);
  });

  it("lists a package two others depend on once and before both", () => {
    expect(
      named({
        ...root(["@acme/one", "@acme/two"]),
        ...installed("@acme/base"),
        ...installed("@acme/one", ["@acme/base"]),
        ...installed("@acme/two", ["@acme/base"]),
      }),
    ).toStrictEqual(["@acme/base", "@acme/one", "@acme/two"]);
  });

  it("passes over a package that is not installed", () => {
    expect(
      named({ ...root(["@acme/absent", "@acme/kit"]), ...installed("@acme/kit") }),
    ).toStrictEqual(["@acme/kit"]);
  });

  it("ends the descent at a cycle and lists both packages", () => {
    expect(
      named({
        ...root(["@acme/one"]),
        ...installed("@acme/one", ["@acme/two"]),
        ...installed("@acme/two", ["@acme/one"]),
      }),
    ).toStrictEqual(["@acme/two", "@acme/one"]);
  });

  it("reaches a package that does not publish its manifest", () => {
    expect(
      named({
        ...root(["@acme/shy"]),
        ...installed("@acme/shy", [], { exports: { ".": "./index.js" } }),
      }),
    ).toStrictEqual(["@acme/shy"]);
  });

  it("reaches a package that publishes for import alone", () => {
    expect(
      named({
        ...root(["@acme/esm"]),
        ...installed("@acme/esm", [], { exports: { ".": { import: "./index.js" } } }),
      }),
    ).toStrictEqual(["@acme/esm"]);
  });

  it("lists two installations of one name once each", () => {
    const found = walked({
      ...root(["@acme/dup", "@acme/one"]),
      ...installed("@acme/dup", [], { version: "1.0.0" }),
      ...installed("@acme/one", ["@acme/dup"]),
      ...packageFiles(
        "node_modules/@acme/one/node_modules/@acme/dup",
        { name: "@acme/dup", version: "2.0.0" },
        { "index.js": "export {};\n" },
      ),
    }).filter((each) => each.named === "@acme/dup");

    expect(found.map((each) => each.at)).toStrictEqual([
      "node_modules/@acme/dup",
      "node_modules/@acme/one/node_modules/@acme/dup",
    ]);
    expect(found.map((each) => each.manifest["version"])).toStrictEqual(["1.0.0", "2.0.0"]);
  });

  it("returns an empty array when the root has no readable manifest", () => {
    expect(named({ "package.json": "{ not json" })).toStrictEqual([]);
  });

  it("passes over a package whose manifest does not parse", () => {
    expect(
      named({
        ...root(["@acme/kit"]),
        "node_modules/@acme/kit/index.js": "export {};\n",
        "node_modules/@acme/kit/package.json": "{ not json",
      }),
    ).toStrictEqual([]);
  });

  it("resolves a package's directory from the package that depends on it", () => {
    const at = withScratchWorkspace(
      { ...root(["@acme/kit"]), ...installed("@acme/kit") },
      (workspace) => packageAt("@acme/kit", workspace.root)?.slice(workspace.root.length + 1),
    );

    expect(at).toBe("node_modules/@acme/kit");
  });

  it("returns undefined for a package that is not installed", () => {
    expect(
      withScratchWorkspace(root([]), (workspace) => packageAt("@acme/absent", workspace.root)),
    ).toBeUndefined();
  });

  it("resolves an entry from the root", () => {
    const entry = withScratchWorkspace(
      { ...root(["@f/face"]), ...installed("@f/face") },
      (workspace) => resolvedOnGraph(workspace.root, "@f/face")?.slice(workspace.root.length + 1),
    );

    expect(entry).toBe("node_modules/@f/face/index.js");
  });

  it("resolves an entry that only a dependency declares", () => {
    const entry = withScratchWorkspace(
      {
        ...root(["@acme/theme"]),
        ...installed("@acme/theme", ["@f/face"]),
        ...installed("@f/face"),
      },
      (workspace) => resolvedOnGraph(workspace.root, "@f/face")?.slice(workspace.root.length + 1),
    );

    expect(entry).toBe("node_modules/@f/face/index.js");
  });

  it("returns undefined when no package on the graph declares the entry", () => {
    expect(
      withScratchWorkspace(root([]), (workspace) => resolvedOnGraph(workspace.root, "@f/absent")),
    ).toBeUndefined();
  });

  it("resolves the entry of a package that publishes for import alone", () => {
    const entry = withScratchWorkspace(
      {
        ...root(["@acme/esm"]),
        ...installed("@acme/esm", [], { exports: { ".": { import: "./index.js" } } }),
      },
      (workspace) => resolvedOnGraph(workspace.root, "@acme/esm")?.slice(workspace.root.length + 1),
    );

    expect(entry).toBe("node_modules/@acme/esm/index.js");
  });

  it("resolves the entry of a package that withholds require and publishes for import", () => {
    const withheld = Object.fromEntries([
      ["require", null],
      ["import", "./index.js"],
    ]);
    const entry = withScratchWorkspace(
      {
        ...root(["@acme/withheld"]),
        ...installed("@acme/withheld", [], { exports: { ".": withheld } }),
      },
      (workspace) =>
        resolvedOnGraph(workspace.root, "@acme/withheld")?.slice(workspace.root.length + 1),
    );

    expect(entry).toBe("node_modules/@acme/withheld/index.js");
  });

  it("returns undefined for an installed package whose manifest does not parse", () => {
    expect(
      withScratchWorkspace(
        {
          ...root(["@acme/broken"]),
          "node_modules/@acme/broken/index.js": "",
          "node_modules/@acme/broken/package.json": "{ not json",
        },
        (workspace) => resolvedOnGraph(workspace.root, "@acme/broken"),
      ),
    ).toBeUndefined();
  });

  it("returns undefined for an installed package that publishes no import target", () => {
    expect(
      withScratchWorkspace(
        {
          ...root(["@acme/typed"]),
          ...installed("@acme/typed", [], { exports: { ".": { types: "./index.d.ts" } } }),
        },
        (workspace) => resolvedOnGraph(workspace.root, "@acme/typed"),
      ),
    ).toBeUndefined();
  });

  it("resolves an entry through a graph handed in", () => {
    const entry = withScratchWorkspace(
      {
        ...root(["@acme/theme"]),
        ...installed("@acme/theme", ["@f/face"]),
        ...installed("@f/face"),
      },
      (workspace) =>
        resolvedOnGraph(workspace.root, "@f/face", dependencies(workspace.root))?.slice(
          workspace.root.length + 1,
        ),
    );

    expect(entry).toBe("node_modules/@f/face/index.js");
  });
});
