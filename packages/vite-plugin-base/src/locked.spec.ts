/**
 * Covers what each lockfile format yields, what it declines to record, and which record an
 * installation is matched to.
 *
 * @remarks
 *   Each case writes a real lockfile into a temporary directory rather than stubbing the reader,
 *   because what is under test is the text two package managers actually write.
 */

import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { installedOf, locked } from "#locked.ts";

/**
 * Lays out a workspace whose root holds a bun lockfile listing the given rows.
 *
 * @returns The package directory below the root, so a case reads from inside the workspace.
 */
function workspace(packages: string): string {
  const root = mkdtempSync(join(tmpdir(), "stealth-locked-"));
  const at = join(root, "packages", "one");

  mkdirSync(at, { recursive: true });
  writeFileSync(join(root, "bun.lock"), `{\n  "packages": {\n${packages}\n  },\n}\n`);

  return at;
}

/**
 * Lays out a workspace whose root holds a pnpm lockfile carrying the given entries.
 *
 * @param yaml - The body written under the `packages` key of the final document.
 * @param ahead - A whole document placed before that one, which is where pnpm records its own
 *   installation.
 * @returns The package directory below the root, so a case reads from inside the workspace.
 */
function pnpm(yaml: string, ahead?: string): string {
  const root = mkdtempSync(join(tmpdir(), "stealth-locked-"));
  const at = join(root, "packages", "one");
  const first = ahead === undefined ? "" : `${ahead}\n---\n`;

  mkdirSync(at, { recursive: true });
  writeFileSync(
    join(root, "pnpm-lock.yaml"),
    `${first}lockfileVersion: '9.0'\n\npackages:\n${yaml}`,
  );

  return at;
}

describe("locked", () => {
  it("reads a registry package", () => {
    const held = locked(workspace('    "wrappy": ["wrappy@1.0.2", "", {}, "sha512-abc"],'));

    expect(held.get("wrappy@1.0.2")).toStrictEqual({
      integrity: "sha512-abc",
      resolution: "1.0.2",
    });
  });

  it("reads a git package from its resolution field", () => {
    const held = locked(
      workspace('    "once": ["once@github:isaacs/once#0fbb41e", {}, "isaacs", "sha512-def"],'),
    );

    expect(held.get("once@github:isaacs/once#0fbb41e")).toStrictEqual({
      integrity: "sha512-def",
      resolution: "github:isaacs/once#0fbb41e",
    });
  });

  it("reads a scoped name whole", () => {
    const held = locked(workspace('    "@types/bun": ["@types/bun@1.4.2", "", {}, "sha512-ghi"],'));

    expect(held.get("@types/bun@1.4.2")?.resolution).toBe("1.4.2");
  });

  it("records a registry that is not the default one", () => {
    const held = locked(
      workspace('    "held": ["held@1.0.0", "https://npm.acme.test/", {}, "sha512-jkl"],'),
    );

    expect(held.get("held@1.0.0")?.registry).toBe("https://npm.acme.test/");
  });

  it("ignores an entry whose first field names no version", () => {
    expect(locked(workspace('    "held": ["held", "", {}],')).size).toBe(0);
  });

  it("ignores an entry that is not an array", () => {
    expect(locked(workspace('    "held": { "not": "a list" },')).size).toBe(0);
  });

  it("returns an empty map when the lockfile lists no packages", () => {
    const root = mkdtempSync(join(tmpdir(), "stealth-locked-"));

    writeFileSync(join(root, "bun.lock"), '{ "lockfileVersion": 2 }');

    expect(locked(root).size).toBe(0);
  });

  it("ignores an entry whose first field is not a string", () => {
    expect(locked(workspace('    "held": [3, "", {}],')).size).toBe(0);
  });

  it("returns an empty map when the workspace has no lockfile it recognises", () => {
    expect(locked(mkdtempSync(join(tmpdir(), "stealth-locked-"))).size).toBe(0);
  });

  it("returns an empty map when the lockfile does not parse", () => {
    const root = mkdtempSync(join(tmpdir(), "stealth-locked-"));

    writeFileSync(join(root, "bun.lock"), "{ not json");

    expect(locked(root).size).toBe(0);
  });

  it("reads an entry that records no integrity", () => {
    const held = locked(workspace('    "held": ["held@1.0.0", "", {}],'));

    expect(held.get("held@1.0.0")).toStrictEqual({ resolution: "1.0.0" });
  });

  it("reads a registry package out of a pnpm lockfile", () => {
    const held = pnpm("  wrappy@1.0.2:\n    resolution: {integrity: sha512-abc}\n");

    expect(locked(held).get("wrappy@1.0.2")).toStrictEqual({ integrity: "sha512-abc" });
  });

  it("reads a scoped name whole out of a pnpm lockfile", () => {
    const held = pnpm("  '@types/node@26.5.1':\n    resolution: {integrity: sha512-def}\n");

    expect(locked(held).get("@types/node@26.5.1")?.integrity).toBe("sha512-def");
  });

  it("records the tarball a pnpm entry resolves from", () => {
    const held = pnpm(
      "  once@1.4.1:\n    resolution: {tarball: https://codeload.github.com/isaacs/once/tar.gz/0fbb41e}\n",
    );

    expect(locked(held).get("once@1.4.1")?.registry).toBe(
      "https://codeload.github.com/isaacs/once/tar.gz/0fbb41e",
    );
  });

  it("reads the document after the one pnpm writes for its own installation", () => {
    const held = pnpm(
      "  wrappy@1.0.2:\n    resolution: {integrity: sha512-abc}\n",
      "packages:\n  '@pnpm/exe.linux-x64@12.4.1':\n    resolution: {integrity: sha512-self}",
    );

    expect(locked(held).get("wrappy@1.0.2")?.integrity).toBe("sha512-abc");
  });

  it("records the url a pnpm git entry resolves from", () => {
    const held = pnpm(
      "  held@1.0.0:\n    resolution: {type: git, url: git+ssh://git@github.com/acme/held.git}\n",
    );

    expect(locked(held).get("held@1.0.0")?.registry).toBe("git+ssh://git@github.com/acme/held.git");
  });

  it("records the resolution when a pnpm key has a reference in place of a version", () => {
    const held = pnpm(
      "  once@github.com/isaacs/once/0fbb41e:\n    resolution: {integrity: sha512-m}\n",
    );

    expect(locked(held).get("once@github.com/isaacs/once/0fbb41e")?.resolution).toBe(
      "github.com/isaacs/once/0fbb41e",
    );
  });

  it("keeps two versions of one package apart", () => {
    const held = locked(
      pnpm(
        "  wrappy@1.0.2:\n    resolution: {integrity: sha512-one}\n" +
          "  wrappy@2.0.0:\n    resolution: {integrity: sha512-two}\n",
      ),
    );

    expect(held.get("wrappy@1.0.2")?.integrity).toBe("sha512-one");
    expect(held.get("wrappy@2.0.0")?.integrity).toBe("sha512-two");
  });

  it("ignores a pnpm entry that records no resolution", () => {
    const held = pnpm("  held@1.0.0:\n    cpu: [x64]\n");

    expect(locked(held).size).toBe(0);
  });

  it("ignores a pnpm entry written with nothing under it", () => {
    const held = pnpm("  held@1.0.0:\n");

    expect(locked(held).size).toBe(0);
  });

  it("reads the document after an empty one", () => {
    const held = pnpm("  wrappy@1.0.2:\n    resolution: {integrity: sha512-abc}\n", "---");

    expect(locked(held).get("wrappy@1.0.2")?.integrity).toBe("sha512-abc");
  });

  it("ignores a pnpm key with no @ past its first character", () => {
    const held = pnpm("  held:\n    resolution: {integrity: sha512-abc}\n");

    expect(locked(held).size).toBe(0);
  });

  it("returns an empty map when a pnpm lockfile records no packages", () => {
    const held = pnpm("");

    expect(locked(held).size).toBe(0);
  });
});

describe("installedOf", () => {
  const two = locked(
    pnpm(
      "  wrappy@1.0.2:\n    resolution: {integrity: sha512-one}\n" +
        "  wrappy@2.0.0:\n    resolution: {integrity: sha512-two}\n",
    ),
  );
  const one = locked(pnpm("  wrappy@1.0.2:\n    resolution: {integrity: sha512-one}\n"));

  it("finds the record for the installed version", () => {
    expect(installedOf(two, "wrappy", "2.0.0")).toStrictEqual({ integrity: "sha512-two" });
    expect(installedOf(two, "wrappy", "1.0.2")).toStrictEqual({ integrity: "sha512-one" });
  });

  it("returns undefined for a version the lockfile does not pin", () => {
    expect(installedOf(two, "wrappy", "3.0.0")).toBeUndefined();
    expect(installedOf(one, "wrappy", "3.0.0")).toBeUndefined();
  });

  it("takes the one record under a name when no version is given", () => {
    expect(installedOf(one, "wrappy")).toStrictEqual({ integrity: "sha512-one" });
    expect(installedOf(two, "wrappy")).toBeUndefined();
    expect(installedOf(one, "absent")).toBeUndefined();
  });

  it("returns the single record when the lockfile keys it by a reference", () => {
    const held = locked(
      pnpm("  once@github.com/isaacs/once/0fbb41e:\n    resolution: {integrity: sha512-m}\n"),
    );

    expect(installedOf(held, "once", "1.4.1")).toStrictEqual({
      integrity: "sha512-m",
      resolution: "github.com/isaacs/once/0fbb41e",
    });
  });

  it("keys an aliased record by the name the alias installs as", () => {
    const held = locked(pnpm("  alias@npm:real@1.0.0:\n    resolution: {integrity: sha512-a}\n"));

    expect(installedOf(held, "alias")).toStrictEqual({
      integrity: "sha512-a",
      resolution: "npm:real@1.0.0",
    });
    expect(installedOf(held, "real")).toBeUndefined();
  });

  it("keeps an address with a credential whole on the version's side of the key", () => {
    const held = locked(
      pnpm(
        "  held@git+https://token@github.com/acme/held.git#abc:\n    resolution: {integrity: sha512-b}\n",
      ),
    );

    expect(installedOf(held, "held")).toStrictEqual({
      integrity: "sha512-b",
      resolution: "git+https://token@github.com/acme/held.git#abc",
    });
  });

  it("keeps a scoped name whole when it matches", () => {
    const held = locked(pnpm("  '@types/node@26.5.1':\n    resolution: {integrity: sha512-def}\n"));

    expect(installedOf(held, "@types/node")).toStrictEqual({ integrity: "sha512-def" });
  });
});
