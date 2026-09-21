/**
 * Covers the forms an export map takes, and the conditions a target is picked under.
 */

import { describe, expect, it } from "vitest";

import { exportTarget } from "#exports.ts";

describe("exportTarget", () => {
  it("reads a string export map as the entry of the package", () => {
    expect(exportTarget({ exports: "./index.js" }, ".")).toBe("./index.js");
    expect(exportTarget({ exports: "./index.js" }, "./theme")).toBeUndefined();
  });

  it("reads a subpath written as a string", () => {
    expect(exportTarget({ exports: { "./theme": "./src/theme.ts" } }, "./theme")).toBe(
      "./src/theme.ts",
    );
  });

  it("picks the first matching condition in the order given", () => {
    const manifest = {
      exports: { ".": { "acme-source": "./src/index.ts", default: "./dist/index.mjs" } },
    };

    expect(exportTarget(manifest, ".", ["acme-source"])).toBe("./src/index.ts");
    expect(exportTarget(manifest, ".", ["import", "acme-source"])).toBe("./src/index.ts");
  });

  it("falls back to default when no condition matches", () => {
    const manifest = {
      exports: { ".": { "acme-source": "./src/index.ts", default: "./dist/index.mjs" } },
    };

    expect(exportTarget(manifest, ".")).toBe("./dist/index.mjs");
  });

  it("reads a condition nested under another", () => {
    const manifest = { exports: { ".": { import: { default: "./x.mjs", types: "./x.d.mts" } } } };

    expect(exportTarget(manifest, ".", ["import"])).toBe("./x.mjs");
  });

  it("reads the keys of a conditions object in the order they are written", () => {
    const written = Object.fromEntries([
      ["import", "./a.mjs"],
      ["acme-source", "./src.ts"],
    ]);
    const manifest = { exports: { ".": written } };

    expect(exportTarget(manifest, ".", ["acme-source", "import"])).toBe("./a.mjs");
    expect(exportTarget(manifest, ".", ["acme-source"])).toBe("./src.ts");
  });

  it("falls back to the next key when a matching condition leads nowhere", () => {
    const manifest = { exports: { ".": { default: "./x.js", import: { types: "./x.d.mts" } } } };
    const entries: ReadonlyArray<readonly [string, unknown]> = [
      ["import", { types: "./x.d.mts" }],
      ["default", "./x.js"],
    ];
    const written = { exports: { ".": Object.fromEntries(entries) } };

    expect(exportTarget(manifest, ".", ["import"])).toBe("./x.js");
    expect(exportTarget(written, ".", ["import"])).toBe("./x.js");
  });

  it("tries the elements of an array target in turn", () => {
    const manifest = { exports: { ".": [{ require: "./c.cjs" }, "./fallback.js"] } };

    expect(exportTarget(manifest, ".", ["import"])).toBe("./fallback.js");
    expect(exportTarget(manifest, ".", ["require"])).toBe("./c.cjs");
  });

  it("returns undefined when no element of an array target resolves", () => {
    const manifest = { exports: { ".": [{ require: "./c.cjs" }, { types: "./t.d.ts" }] } };

    expect(exportTarget(manifest, ".", ["import"])).toBeUndefined();
  });

  it("reads a withheld subpath as unpublished and stops there", () => {
    const withheld = Object.fromEntries([
      ["import", null],
      ["default", "./x.js"],
    ]);

    expect(exportTarget({ exports: { ".": null } }, ".")).toBeUndefined();
    expect(exportTarget({ exports: { ".": withheld } }, ".", ["import"])).toBeUndefined();
  });

  it("does not expand a subpath pattern", () => {
    expect(exportTarget({ exports: { "./*": "./dist/*.js" } }, "./theme")).toBeUndefined();
  });

  it("reads a map of conditions with no subpath as the entry of the package", () => {
    const manifest = { exports: { import: "./index.mjs", require: "./index.cjs" } };

    expect(exportTarget(manifest, ".", ["import"])).toBe("./index.mjs");
    expect(exportTarget(manifest, "./theme", ["import"])).toBeUndefined();
  });

  it("returns undefined when the subpath is absent or names no target", () => {
    expect(exportTarget({ exports: { ".": "./index.js" } }, "./theme")).toBeUndefined();
    expect(
      exportTarget({ exports: { "./theme": { types: "./t.d.ts" } } }, "./theme"),
    ).toBeUndefined();
    expect(exportTarget({ exports: { "./theme": 3 } }, "./theme")).toBeUndefined();
  });

  it("returns undefined when no condition matches and the object names no default", () => {
    const manifest = { exports: { ".": { require: "./index.cjs", types: "./index.d.ts" } } };

    expect(exportTarget(manifest, ".", ["import"])).toBeUndefined();
    expect(exportTarget(manifest, ".")).toBeUndefined();
  });

  it("returns undefined when the manifest has no export map", () => {
    expect(exportTarget({ name: "x" }, ".")).toBeUndefined();
    expect(exportTarget({ exports: 3 }, ".")).toBeUndefined();
  });
});
