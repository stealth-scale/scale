import { mkdirSync, symlinkSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  manifest,
  packageFiles,
  type ScratchFiles,
  type ScratchWorkspace,
  withScratchWorkspace,
} from "@stealthscale/testing";
import { dependencies } from "@stealthscale/vite-plugin-base";

import { contributors, installedSources, workspaceRoots, workspaceSources } from "#contributors.ts";

const PUBLISHED = {
  ".": "./index.js",
  "./package.json": "./package.json",
  "./theme": "./theme.js",
};

const FILES = { "index.js": "export {};\n", "theme.js": "export default {};\n" };

function installed(
  name: string,
  dependsOn: readonly string[] = [],
  publishes = false,
  directory = `node_modules/${name}`,
): ScratchFiles {
  return packageFiles(
    directory,
    {
      dependencies: Object.fromEntries(dependsOn.map((each) => [each, "*"])),
      exports: publishes ? PUBLISHED : { ".": "./index.js", "./package.json": "./package.json" },
      name,
      peerDependencies: publishes ? { "@acme/design": "*" } : {},
    },
    FILES,
  );
}

function root(dependsOn: readonly string[]): ScratchFiles {
  return {
    "package.json": manifest({
      dependencies: Object.fromEntries(dependsOn.map((each) => [each, "*"])),
      name: "@acme/app",
    }),
  };
}

function named(files: ScratchFiles, system = "@acme/design"): readonly string[] {
  return withScratchWorkspace(files, (workspace) =>
    contributors(dependencies(workspace.root), system).map((each) => each.name),
  );
}

function linked(workspace: ScratchWorkspace, names: readonly string[]): void {
  mkdirSync(workspace.path("node_modules/@acme"), { recursive: true });

  for (const name of names) {
    symlinkSync(
      workspace.path(`packages/${name}`),
      workspace.path(`node_modules/@acme/${name}`),
      "dir",
    );
  }
}

describe("contributors", () => {
  it("lists a dependency that publishes a preset", () => {
    expect(named({ ...root(["@acme/kit"]), ...installed("@acme/kit", [], true) })).toStrictEqual([
      "@acme/kit",
    ]);
  });

  it("records the directory of a contributor", () => {
    const at = withScratchWorkspace(
      { ...root(["@acme/kit"]), ...installed("@acme/kit", [], true) },
      (workspace) =>
        contributors(dependencies(workspace.root), "@acme/design").map((each) =>
          each.at.slice(workspace.root.length + 1),
        ),
    );

    expect(at).toStrictEqual(["node_modules/@acme/kit"]);
  });

  it("passes over a dependency that publishes no preset", () => {
    expect(named({ ...root(["@acme/plain"]), ...installed("@acme/plain") })).toStrictEqual([]);
  });

  it("passes over a package that publishes the subpath without naming the system package", () => {
    const stranger = packageFiles(
      "node_modules/@vendor/highlight",
      { exports: PUBLISHED, name: "@vendor/highlight" },
      FILES,
    );

    expect(named({ ...root(["@vendor/highlight"]), ...stranger })).toStrictEqual([]);
  });

  it("lists a publisher that depends on the system package rather than peering on it", () => {
    const kit = packageFiles(
      "node_modules/@acme/kit",
      { dependencies: { "@acme/design": "*" }, exports: PUBLISHED, name: "@acme/kit" },
      FILES,
    );

    expect(named({ ...root(["@acme/kit"]), ...installed("@acme/design"), ...kit })).toStrictEqual([
      "@acme/kit",
    ]);
  });

  it("places the system package first whatever the graph says", () => {
    expect(
      named({
        ...root(["@acme/kit", "@acme/design"]),
        ...installed("@acme/design", [], true),
        ...installed("@acme/kit", [], true),
      }),
    ).toStrictEqual(["@acme/design", "@acme/kit"]);
  });

  it("places a package after the package it builds on", () => {
    expect(
      named({
        ...root(["@acme/extra"]),
        ...installed("@acme/base", [], true),
        ...installed("@acme/extra", ["@acme/base"], true),
      }),
    ).toStrictEqual(["@acme/base", "@acme/extra"]);
  });

  it("finds a publisher reached through a package that publishes nothing", () => {
    expect(
      named({
        ...root(["@acme/shared"]),
        ...installed("@acme/kit", [], true),
        ...installed("@acme/shared", ["@acme/kit"]),
      }),
    ).toStrictEqual(["@acme/kit"]);
  });

  it("returns an empty array when the application has no readable manifest", () => {
    expect(named({ "package.json": "{ not json" })).toStrictEqual([]);
  });

  it("lists a glob for the source of every linked package", () => {
    const globs = withScratchWorkspace(
      {
        ...root(["@acme/kit"]),
        ...installed("@acme/deep", [], false, "packages/deep"),
        ...installed("@acme/kit", ["@acme/deep"], false, "packages/kit"),
      },
      (workspace) => {
        linked(workspace, ["deep", "kit"]);

        return workspaceSources(workspace.root, dependencies(workspace.root));
      },
    );

    expect(globs).toStrictEqual([
      "packages/deep/src/**/*.{ts,tsx}",
      "packages/kit/src/**/*.{ts,tsx}",
    ]);
  });

  it("leaves an installed package out of the source globs", () => {
    const globs = withScratchWorkspace(
      { ...root(["@acme/vendor"]), ...installed("@acme/vendor") },
      (workspace) => workspaceSources(workspace.root, dependencies(workspace.root)),
    );

    expect(globs).toStrictEqual([]);
  });

  it("lists a glob for the published code of every installed contributor", () => {
    const globs = withScratchWorkspace(
      {
        ...root(["@acme/kit", "@acme/plain"]),
        ...packageFiles(
          "node_modules/@acme/kit",
          {
            exports: { ".": { import: "./dist/index.js" }, "./theme": "./dist/theme.js" },
            name: "@acme/kit",
            peerDependencies: { "@acme/design": "*" },
          },
          { "dist/index.js": "export {};\n", "dist/theme.js": "export default {};\n" },
        ),
        ...installed("@acme/plain", [], true, "packages/plain"),
      },
      (workspace) => {
        linked(workspace, ["plain"]);

        return installedSources(
          workspace.root,
          contributors(dependencies(workspace.root), "@acme/design"),
        );
      },
    );

    expect(globs).toStrictEqual(["node_modules/@acme/kit/dist/**/*.{js,mjs}"]);
  });

  it("reads an installed contributor whose export map names no entry under dist", () => {
    const globs = withScratchWorkspace(
      { ...root(["@acme/kit"]), ...installed("@acme/kit", [], true) },
      (workspace) => {
        const found = contributors(dependencies(workspace.root), "@acme/design");

        return installedSources(workspace.root, [
          {
            ...found[0],
            at: found[0]?.at ?? "",
            manifest: { name: "@acme/kit" },
            name: "@acme/kit",
          },
        ]);
      },
    );

    expect(globs).toStrictEqual(["node_modules/@acme/kit/dist/**/*.{js,mjs}"]);
  });

  it("lists the source directory of every linked package as an absolute path", () => {
    const roots = withScratchWorkspace(
      {
        ...root(["@acme/kit"]),
        ...installed("@acme/deep", [], false, "packages/deep"),
        ...installed("@acme/kit", ["@acme/deep"], false, "packages/kit"),
      },
      (workspace) => {
        linked(workspace, ["deep", "kit"]);

        return workspaceRoots(dependencies(workspace.root)).map((at) =>
          at.slice(workspace.root.length + 1),
        );
      },
    );

    expect(roots).toStrictEqual(["packages/deep/src", "packages/kit/src"]);
  });
});
