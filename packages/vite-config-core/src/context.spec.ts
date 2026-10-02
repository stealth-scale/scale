/**
 * Covers `rooted` and `contextOf`: where the workspace root is found, which directory ends up
 * configured, and which variables the environment receives.
 *
 * @remarks
 *   Each case writes a repository into a temporary directory, because the code under test reads
 *   the file system and takes no injectable dependency.
 */

import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { type ConfigEnv } from "vite";
import { describe, expect, it, vi } from "vitest";

import { contextOf, rooted } from "#context.ts";

/**
 * The invocation every case passes except the two that vary the command and the mode.
 */
const SERVING: ConfigEnv = { command: "serve", mode: "development" };

/**
 * Writes a repository with a root and one package under `packages/one` to a temporary directory.
 *
 * @remarks
 *   The package directory always gets a manifest, so a case needing a directory without one names
 *   a path that was never created.
 * @param manifest - The contents of the root manifest.
 * @param env - The contents of a `.env` at the root, or undefined to write none.
 * @param own - The contents of a `.env` in the package, or undefined to write none.
 * @returns The package directory as `at` and the repository root as `root`, both absolute.
 */
function laid(
  manifest: Record<string, unknown>,
  env?: string,
  own?: string,
): { readonly at: string; readonly root: string } {
  const root = mkdtempSync(join(tmpdir(), "stealth-context-"));
  const at = join(root, "packages", "one");

  mkdirSync(at, { recursive: true });
  writeFileSync(join(root, "package.json"), JSON.stringify(manifest));
  writeFileSync(join(at, "package.json"), JSON.stringify({ name: "one", version: "1.2.3" }));

  if (env !== undefined) writeFileSync(join(root, ".env"), env);
  if (own !== undefined) writeFileSync(join(at, ".env"), own);

  return { at, root };
}

/**
 * Writes a repository whose root manifest declares `packages/*` as its workspace.
 *
 * @param env - The contents of a `.env` at the root, or undefined to write none.
 * @param own - The contents of a `.env` in the package, or undefined to write none.
 * @returns The package directory as `at` and the repository root as `root`, both absolute.
 */
function workspace(env?: string, own?: string): { readonly at: string; readonly root: string } {
  return laid({ workspaces: ["packages/*"] }, env, own);
}

/**
 * Writes a repository whose root manifest is empty and whose workspace is declared in
 * `pnpm-workspace.yaml` alone.
 *
 * @param yaml - The contents of the `pnpm-workspace.yaml` written at the root.
 * @returns The package directory as `at` and the repository root as `root`, both absolute.
 */
function pnpm(yaml: string): { readonly at: string; readonly root: string } {
  const held = laid({});

  writeFileSync(join(held.root, "pnpm-workspace.yaml"), yaml);

  return held;
}

describe("context", () => {
  it("climbs to the root from a package below it", () => {
    const held = workspace();

    expect(rooted(held.at)).toBe(held.root);
  });

  it("finds the root when it is the directory given", () => {
    const held = workspace();

    expect(rooted(held.root)).toBe(held.root);
  });

  it("finds the root when workspaces is an object rather than an array", () => {
    const held = laid({ workspaces: { packages: ["packages/*"] } });

    expect(rooted(held.at)).toBe(held.root);
  });

  it("returns the package directory when no directory above it declares a workspace", () => {
    const held = laid({ name: "root" });

    expect(rooted(held.at)).toBe(held.at);
  });

  it("returns the root directory when it declares no workspace of its own", () => {
    const held = laid({ name: "root" });

    expect(rooted(held.root)).toBe(held.root);
  });

  it("reads a STEALTH_ variable from the root env file", () => {
    const held = workspace("STEALTH_SPECIFIED=stated\n");

    expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SPECIFIED"]).toBe("stated");
  });

  it("omits an unprefixed variable declared in an env file", () => {
    const held = workspace("NOT_PREFIXED=read\n");

    expect(contextOf(SERVING, held.at, held.at).env["NOT_PREFIXED"]).toBeUndefined();
  });

  it("reads a VITE_ variable from the root env file", () => {
    const held = workspace("VITE_SHOWN=client\n");

    expect(contextOf(SERVING, held.at, held.at).env["VITE_SHOWN"]).toBe("client");
  });

  it("omits an unprefixed variable set in the shell", () => {
    const held = workspace();

    vi.stubEnv("REVIEW_CACHE_UNRELATED", "one");

    expect(contextOf(SERVING, held.at, held.at).env["REVIEW_CACHE_UNRELATED"]).toBeUndefined();
  });

  it("reads GITHUB_SHA from the shell by name", () => {
    const held = workspace();

    vi.stubEnv("GITHUB_SHA", "abc123");

    expect(contextOf(SERVING, held.at, held.at).env["GITHUB_SHA"]).toBe("abc123");
  });

  it("reads CI from the shell by name", () => {
    const held = workspace();

    vi.stubEnv("CI", "true");

    expect(contextOf(SERVING, held.at, held.at).env["CI"]).toBe("true");
  });

  it("returns undefined for a STEALTH_ variable the repository declares nowhere", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SPECIFIED"]).toBeUndefined();
  });

  it("reads a STEALTH_ variable from the package env file", () => {
    const held = workspace(undefined, "STEALTH_SPECIFIED=package\n");

    expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SPECIFIED"]).toBe("package");
  });

  it("prefers the package value when both env files declare the variable", () => {
    const held = workspace("STEALTH_SPECIFIED=workspace\n", "STEALTH_SPECIFIED=package\n");

    expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SPECIFIED"]).toBe("package");
  });

  it("merges a root variable and a package variable into one environment", () => {
    const held = workspace("STEALTH_SHARED=workspace\n", "STEALTH_SPECIFIED=package\n");
    const context = contextOf(SERVING, held.at, held.at);

    expect(context.env["STEALTH_SHARED"]).toBe("workspace");
    expect(context.env["STEALTH_SPECIFIED"]).toBe("package");
  });

  it("keeps a root variable when the package env file declares a different one", () => {
    const held = workspace("STEALTH_SHARED=workspace\n", "STEALTH_OTHER=package\n");

    expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SHARED"]).toBe("workspace");
  });

  it("prefers the shell value over both env files", () => {
    const held = workspace("STEALTH_SPECIFIED=workspace\n", "STEALTH_SPECIFIED=package\n");

    vi.stubEnv("STEALTH_SPECIFIED", "shell");

    expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SPECIFIED"]).toBe("shell");
  });

  it("returns the command Vite was invoked with", () => {
    const held = workspace();
    const context = contextOf({ command: "build", mode: "production" }, held.at, held.at);

    expect(context.command).toBe("build");
  });

  it("returns the mode Vite was invoked with", () => {
    const held = workspace();
    const context = contextOf({ command: "build", mode: "production" }, held.at, held.at);

    expect(context.mode).toBe("production");
  });

  it("reports the workspace root above the directory being configured", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.at, held.at).root).toBe(held.root);
  });

  it("reads the manifest of the directory being configured", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.at, held.at).manifest.version).toBe("1.2.3");
  });

  it("returns the workspace globs as an array when the manifest declares them", () => {
    const held = laid({ workspaces: ["packages/*"] });

    expect(contextOf(SERVING, held.root, held.root).manifest.workspaces).toStrictEqual([
      "packages/*",
    ]);
  });

  it("returns undefined for workspaces when the manifest declares none", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.at, held.at).manifest.workspaces).toBeUndefined();
  });

  it("finds the root by a pnpm workspace file when the manifest declares none", () => {
    const held = pnpm("packages:\n  - packages/*\n");

    expect(rooted(held.at)).toBe(held.root);
  });

  it("returns the globs pnpm-workspace.yaml declares as workspaces", () => {
    const held = pnpm("packages:\n  - examples/*\n  - packages/*\n");

    expect(contextOf(SERVING, held.root, held.root).manifest.workspaces).toStrictEqual([
      "examples/*",
      "packages/*",
    ]);
  });

  it("returns an empty manifest when the directory has none", () => {
    const held = workspace();
    const absent = join(held.root, "nothing");

    expect(contextOf(SERVING, absent, absent).manifest).toStrictEqual({});
  });

  it("returns an empty manifest when package.json parses to null", () => {
    const held = workspace();

    writeFileSync(join(held.at, "package.json"), "null");

    expect(contextOf(SERVING, held.at, held.at).manifest).toStrictEqual({});
  });

  it("configures the declared directory when it is not the root", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.at, held.at).at).toBe(held.at);
  });

  it("configures the declared package when the command runs at the root", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.at, held.root).at).toBe(held.at);
  });

  it("configures the working directory when the package there has no config of its own", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.root, held.at).at).toBe(held.at);
  });

  it("configures the root when the package the command runs in has a config of its own", () => {
    const held = workspace();

    writeFileSync(join(held.at, "vite.config.ts"), "export default {};\n");

    expect(contextOf(SERVING, held.root, held.at).at).toBe(held.root);
  });

  it("configures the root when it is both declared and the working directory", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.root, held.root).at).toBe(held.root);
  });

  it("configures the root when the working directory has no manifest", () => {
    const held = workspace();
    const elsewhere = join(held.root, "docs");

    mkdirSync(elsewhere, { recursive: true });

    expect(contextOf(SERVING, held.root, elsewhere).at).toBe(held.root);
  });
});
