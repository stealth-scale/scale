/**
 * Covers the manifest text and the file maps a scratch workspace is written from.
 *
 * @remarks
 *   The exact JSON text is asserted once, because a caller writing it to disk depends on the
 *   trailing newline. Every other expectation parses the text first, so field order can change
 *   without breaking a test.
 */

import { describe, expect, it } from "vitest";

import { manifest, packageFiles, workspaceFiles } from "#manifest.ts";
import { withScratchWorkspace } from "#scratch.ts";

describe("manifest", () => {
  it("writes the fields as indented JSON with a version of 0.0.0 where none is declared", () => {
    expect(manifest({ name: "@acme/leaf" })).toBe(
      '{\n  "version": "0.0.0",\n  "name": "@acme/leaf"\n}\n',
    );
  });

  it("keeps a version the fields declare for themselves", () => {
    expect(JSON.parse(manifest({ name: "@acme/leaf", version: "1.2.3" }))).toStrictEqual({
      name: "@acme/leaf",
      version: "1.2.3",
    });
  });
});

describe("packageFiles", () => {
  it("keys the manifest ahead of every other file under the directory", () => {
    const files = packageFiles(
      "packages/leaf",
      { name: "@acme/leaf" },
      { "README.md": "# leaf\n", "src/index.ts": "export {}\n" },
    );

    expect(Object.keys(files)).toStrictEqual([
      "packages/leaf/package.json",
      "packages/leaf/README.md",
      "packages/leaf/src/index.ts",
    ]);
    expect(JSON.parse(files["packages/leaf/package.json"] ?? "")).toStrictEqual({
      name: "@acme/leaf",
      version: "0.0.0",
    });
  });

  it("combines with a root manifest into a single scratch workspace", () => {
    const files = withScratchWorkspace(
      {
        ...workspaceFiles(["packages/*"]),
        ...packageFiles("packages/leaf", { name: "@acme/leaf" }),
      },
      (workspace) => workspace.files(),
    );

    expect(files).toStrictEqual(["package.json", "packages/leaf/package.json"]);
  });
});

describe("workspaceFiles", () => {
  it("writes a private root manifest declaring the globs it was given", () => {
    expect(JSON.parse(workspaceFiles(["core/*", "tools/*"])["package.json"] ?? "")).toStrictEqual({
      name: "root",
      private: true,
      version: "0.0.0",
      workspaces: ["core/*", "tools/*"],
    });
  });

  it("keeps any further root field such as the catalog", () => {
    const root = JSON.parse(
      workspaceFiles(["core/*"], { catalog: { valibot: "^1.4.2" } })["package.json"] ?? "",
    ) as { catalog: Record<string, string> };

    expect(root.catalog).toStrictEqual({ valibot: "^1.4.2" });
  });
});
