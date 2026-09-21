/**
 * Covers where the root is found, which directory is configured, and what the environment holds.
 *
 * @remarks
 *   Each case lays a repository out in a temporary directory, because the code
 *   under test answers by looking at the file system and has nothing to inject.
 */

import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { type ConfigEnv } from "vite";
import { describe, expect, it, vi } from "vitest";

import { contextOf, rooted } from "#context.ts";

/**
 * A development server run, which is the invocation these cases are read under.
 */
const SERVING: ConfigEnv = { command: "serve", mode: "development" };

/**
 * Lays a two-level repository out on disk and reports both of its directories.
 *
 * @remarks
 *   The package below always carries a manifest, so a case that wants a
 *   directory with none has to name one that was never created.
 * @param manifest - What the root manifest declares.
 * @param env - The contents of a `.env` at the root, or nothing to write none.
 * @param own - The contents of a `.env` in the package, or nothing to write
 *   none.
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
 * Lays out a repository whose root manifest declares a workspace.
 */
function workspace(env?: string, own?: string): { readonly at: string; readonly root: string } {
  return laid({ workspaces: ["packages/*"] }, env, own);
}

describe("context", () => {
  it("finds the root from a package below it", () => {
    const held = workspace();

    expect(rooted(held.at)).toBe(held.root);
  });

  it("finds it from the root itself", () => {
    const held = workspace();

    expect(rooted(held.root)).toBe(held.root);
  });

  it("finds it when the workspace is declared under a key rather than as an array", () => {
    const held = laid({ workspaces: { packages: ["packages/*"] } });

    expect(rooted(held.at)).toBe(held.root);
  });

  it("ignores a manifest declaring no workspace", () => {
    const held = laid({ name: "root" });

    expect(rooted(held.at)).toBe(held.at);
  });

  it("returns where it started when nothing above declares a workspace", () => {
    const held = laid({ name: "root" });

    expect(rooted(held.root)).toBe(held.root);
  });

  it("reads the variables the repository declares", () => {
    const held = workspace("STEALTH_SPECIFIED=stated\n");

    expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SPECIFIED"]).toBe("stated");
  });

  it("leaves a variable with neither prefix out", () => {
    const held = workspace("NOT_PREFIXED=read\nVITE_SHOWN=client\n");
    const context = contextOf(SERVING, held.at, held.at);

    vi.stubEnv("REVIEW_CACHE_UNRELATED", "one");

    expect(context.env["NOT_PREFIXED"]).toBeUndefined();
    expect(context.env["VITE_SHOWN"]).toBe("client");
    expect(contextOf(SERVING, held.at, held.at).env["REVIEW_CACHE_UNRELATED"]).toBeUndefined();
  });

  it("reads the revision and the CI flag the runner sets by name", () => {
    const held = workspace();

    vi.stubEnv("GITHUB_SHA", "abc123");
    vi.stubEnv("CI", "true");

    const context = contextOf(SERVING, held.at, held.at);

    expect(context.env["GITHUB_SHA"]).toBe("abc123");
    expect(context.env["CI"]).toBe("true");
  });

  it("returns no repository variable when the repository declares none", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SPECIFIED"]).toBeUndefined();
  });

  it("reads what the package declares", () => {
    const held = workspace(undefined, "STEALTH_SPECIFIED=package\n");

    expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SPECIFIED"]).toBe("package");
  });

  it("lets the package override the workspace", () => {
    const held = workspace("STEALTH_SPECIFIED=workspace\n", "STEALTH_SPECIFIED=package\n");

    expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SPECIFIED"]).toBe("package");
  });

  it("keeps what the workspace declares and the package omits", () => {
    const held = workspace("STEALTH_SHARED=workspace\n", "STEALTH_SPECIFIED=package\n");
    const context = contextOf(SERVING, held.at, held.at);

    expect(context.env["STEALTH_SHARED"]).toBe("workspace");
    expect(context.env["STEALTH_SPECIFIED"]).toBe("package");
  });

  it("keeps the workspace value when the package writes a file naming another", () => {
    const held = workspace("STEALTH_SHARED=workspace\n", "STEALTH_OTHER=package\n");

    expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SHARED"]).toBe("workspace");
  });

  it("lets the shell override both", () => {
    const held = workspace("STEALTH_SPECIFIED=workspace\n", "STEALTH_SPECIFIED=package\n");

    vi.stubEnv("STEALTH_SPECIFIED", "shell");

    expect(contextOf(SERVING, held.at, held.at).env["STEALTH_SPECIFIED"]).toBe("shell");
  });

  it("passes the command and the mode through", () => {
    const held = workspace();
    const context = contextOf({ command: "build", mode: "production" }, held.at, held.at);

    expect(context.command).toBe("build");
    expect(context.mode).toBe("production");
  });

  it("reports where the root is", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.at, held.at).root).toBe(held.root);
  });

  it("reads the package's own manifest", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.at, held.at).manifest.version).toBe("1.2.3");
  });

  it("returns the workspace as an array when the manifest declares one", () => {
    const held = laid({ workspaces: ["packages/*"] });

    expect(contextOf(SERVING, held.root, held.root).manifest.workspaces).toStrictEqual([
      "packages/*",
    ]);
  });

  it("returns undefined when the manifest declares no workspace", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.at, held.at).manifest.workspaces).toBeUndefined();
  });

  /**
   * Lays out a repository that declares its workspace in a pnpm file alone.
   *
   * @param yaml - The contents of the `pnpm-workspace.yaml` written at the root.
   */
  function pnpm(yaml: string): { readonly at: string; readonly root: string } {
    const held = laid({});

    writeFileSync(join(held.root, "pnpm-workspace.yaml"), yaml);

    return held;
  }

  it("finds the root by a pnpm workspace file when the manifest declares none", () => {
    const held = pnpm("packages:\n  - packages/*\n");

    expect(rooted(held.at)).toBe(held.root);
  });

  it("passes what that file declares through to the layer", () => {
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

  it("returns an empty manifest when the file is not an object", () => {
    const held = workspace();

    writeFileSync(join(held.at, "package.json"), "null");

    expect(contextOf(SERVING, held.at, held.at).manifest).toStrictEqual({});
  });

  it("takes the declared directory when a package has a config of its own", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.at, held.at).at).toBe(held.at);
  });

  it("keeps it when the command runs at the root", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.at, held.root).at).toBe(held.at);
  });

  it("takes the working directory when a package has no config of its own", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.root, held.at).at).toBe(held.at);
  });

  it("keeps the root when the command runs in a package with its own config", () => {
    const held = workspace();

    writeFileSync(join(held.at, "vite.config.ts"), "export default {};\n");

    expect(contextOf(SERVING, held.root, held.at).at).toBe(held.root);
  });

  it("keeps the root when it is both declared and where the command runs", () => {
    const held = workspace();

    expect(contextOf(SERVING, held.root, held.root).at).toBe(held.root);
  });

  it("keeps the root when the command runs where there is no manifest", () => {
    const held = workspace();
    const elsewhere = join(held.root, "docs");

    mkdirSync(elsewhere, { recursive: true });

    expect(contextOf(SERVING, held.root, elsewhere).at).toBe(held.root);
  });
});
