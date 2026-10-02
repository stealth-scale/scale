/**
 * Covers the graph readers against real packages written to disk.
 *
 * @remarks
 *   Each check installs a package of its own in a fresh temporary directory, so the checks can run
 *   in any order and one that writes a broken manifest cannot disturb another.
 */

import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { type Bundling } from "#plugin.ts";
import { licensed, manifestAt, owning, reached, text } from "#reached.ts";

/**
 * Writes a package into a fresh temporary `node_modules`, with one empty module inside it.
 *
 * @remarks
 *   A new temporary root each time keeps one check's manifest away from the next, which matters
 *   because several checks overwrite the manifest they were given with a broken one.
 * @param named - The name written into the manifest and used as the directory.
 * @param manifest - Further fields, spread after the name and able to replace it.
 * @param licence - The text to file as LICENSE, or nothing to ship none.
 * @returns The package directory and the path of the single module inside it.
 */
function packaged(
  named: string,
  manifest: Record<string, unknown> = {},
  licence?: string,
): { readonly at: string; readonly module: string } {
  const root = mkdtempSync(join(tmpdir(), "stealth-reached-"));
  const at = join(root, "node_modules", named);

  mkdirSync(at, { recursive: true });
  writeFileSync(join(at, "package.json"), JSON.stringify({ name: named, ...manifest }));
  writeFileSync(join(at, "index.js"), "");

  if (licence !== undefined) writeFileSync(join(at, "LICENSE"), licence);

  return { at, module: join(at, "index.js") };
}

/**
 * Fakes a finished module graph out of a map from module to imports.
 *
 * @remarks
 *   A module that appears only as an import, and never as a key, is still crawled, so a graph can
 *   describe an edge into a package without listing that package's own modules.
 */
function building(imports: Readonly<Record<string, readonly string[]>>): Bundling {
  return {
    getModuleIds: () => Object.keys(imports),
    getModuleInfo: (id: string) => ({ importedIds: imports[id] ?? [] }),
  } as unknown as Bundling;
}

describe("reached", () => {
  it("reads a manifest field that holds a string", () => {
    expect(text({ name: "held" }, "name")).toBe("held");
  });

  it("returns undefined for a manifest field that holds something other than a string", () => {
    expect(text({ name: 3 }, "name")).toBeUndefined();
  });

  it("finds the package directory a module file sits in", () => {
    const held = packaged("one");

    expect(owning(held.module)).toBe(held.at);
  });

  it("returns undefined for a path with no manifest anywhere above it", () => {
    expect(owning("/nonexistent-3f9a/deeper/file.js")).toBeUndefined();
  });

  it("parses the manifest a package directory holds", () => {
    const held = packaged("one", { version: "1.2.3" });

    expect(manifestAt(held.at)?.["version"]).toBe("1.2.3");
  });

  it("returns undefined for a directory that holds no manifest", () => {
    const held = packaged("one", { version: "1.2.3" });

    expect(manifestAt(join(held.at, "nowhere"))).toBeUndefined();
  });

  it("returns undefined for a manifest that parses to something other than an object", () => {
    const held = packaged("one");

    writeFileSync(join(held.at, "package.json"), "null");

    expect(manifestAt(held.at)).toBeUndefined();
  });

  it("counts a package once however many of its modules the build reached", () => {
    const one = packaged("one");

    writeFileSync(join(one.at, "second.js"), "");

    const second = join(one.at, "second.js");

    expect(reached(building({ [one.module]: [], [second]: [] })).size).toBe(1);
  });

  it("records no dependency when a package imports a file outside node_modules", () => {
    const one = packaged("one");
    const found = reached(building({ [one.module]: ["/repository/src/main.ts"] }));

    expect([...(found.get(one.at)?.dependsOn ?? [])]).toStrictEqual([]);
  });

  it("returns undefined for a manifest that is not valid JSON", () => {
    const held = packaged("one");

    writeFileSync(join(held.at, "package.json"), "{ not json");

    expect(manifestAt(held.at)).toBeUndefined();
  });

  it("returns one entry per installed package the build reached", () => {
    const one = packaged("one");
    const other = packaged("other");

    expect(
      [...reached(building({ [one.module]: [], [other.module]: [] })).keys()].toSorted(),
    ).toStrictEqual([one.at, other.at].toSorted());
  });

  it("returns an empty map when the build reached nothing under node_modules", () => {
    expect(reached(building({ "/repository/src/main.ts": [] })).size).toBe(0);
  });

  it("skips a package whose manifest declares no name", () => {
    const held = packaged("one");

    writeFileSync(join(held.at, "package.json"), JSON.stringify({ version: "1.0.0" }));

    expect(reached(building({ [held.module]: [] })).size).toBe(0);
  });

  it("records a dependency on the package directory an import resolved into", () => {
    const one = packaged("one");
    const other = packaged("other");
    const found = reached(building({ [one.module]: [other.module], [other.module]: [] }));

    expect([...(found.get(one.at)?.dependsOn ?? [])]).toStrictEqual([other.at]);
  });

  it("records no dependency when a package imports another of its own modules", () => {
    const one = packaged("one");

    writeFileSync(join(one.at, "second.js"), "");

    const found = reached(building({ [one.module]: [join(one.at, "second.js")] }));

    expect([...(found.get(one.at)?.dependsOn ?? [])]).toStrictEqual([]);
  });

  it("reads the name and text of a licence file a package ships", () => {
    const held = packaged("one", {}, "MIT License\n\nPermission is hereby granted");

    expect(licensed(held.at)[0]?.named).toBe("LICENSE");
    expect(licensed(held.at)[0]?.text).toContain("Permission is hereby granted");
  });

  it("returns no licences for a package that ships no licence file", () => {
    expect(licensed(packaged("one").at)).toStrictEqual([]);
  });

  it("returns no licences for a directory that cannot be read", () => {
    expect(licensed("/nonexistent-3f9a")).toStrictEqual([]);
  });

  it("skips a module under node_modules with no manifest above it", () => {
    const root = mkdtempSync(join(tmpdir(), "stealth-reached-"));
    const at = join(root, "node_modules");

    mkdirSync(at, { recursive: true });
    writeFileSync(join(at, "loose.js"), "");

    expect(reached(building({ [join(at, "loose.js")]: [] })).size).toBe(0);
  });

  it("records a package whose module the build reports no info for", () => {
    const one = packaged("one");
    const bundling = {
      getModuleIds: () => [one.module],
      getModuleInfo: () => null,
    } as unknown as Bundling;

    expect(reached(bundling).size).toBe(1);
  });

  it("records a package reached only by an import from outside node_modules", () => {
    const one = packaged("one");
    const held = reached(building({ "/repository/src/main.ts": [one.module] }));

    expect(held.size).toBe(1);
  });

  it("records no dependency on a package imported from outside node_modules", () => {
    const one = packaged("one");
    const held = reached(building({ "/repository/src/main.ts": [one.module] }));

    expect([...(held.get(one.at)?.dependsOn ?? [])]).toStrictEqual([]);
  });

  it("skips a package whose manifest is not valid JSON", () => {
    const one = packaged("one");

    writeFileSync(join(one.at, "package.json"), "{ not json");

    expect(reached(building({ [one.module]: [] })).size).toBe(0);
  });
});
