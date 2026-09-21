/**
 * Checks the plan against a stand-in registry, offline.
 *
 * @remarks
 *   The scripts lane is a test project of its own at the workspace root, so the workspace runner
 *   collects this file while the coverage policy, which counts `src/` alone, does not.
 */

import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { members, planned, printed, published, trusted } from "./plan.ts";
import { type Ran, type Runner } from "./run.ts";

/**
 * One member a case writes into a workspace.
 */
interface Named {
  /**
   * The package name.
   */
  readonly name: string;

  /**
   * Whether the manifest marks the package private.
   */
  readonly private?: boolean;

  /**
   * The scripts the manifest declares.
   */
  readonly scripts?: Readonly<Record<string, string>>;
}

/**
 * Writes a workspace with the members a case names, and answers `pnpm ls` for it.
 */
function workspace(named: readonly Named[]): { readonly listing: string; readonly root: string } {
  const root = mkdtempSync(join(tmpdir(), "stealth-trust-"));
  const listed = named.map((one) => {
    const path = join(root, "packages", one.name.replace("@", "").replace("/", "-"));

    mkdirSync(path, { recursive: true });
    writeFileSync(
      join(path, "package.json"),
      JSON.stringify({ name: one.name, private: one.private, scripts: one.scripts }),
    );

    return { name: one.name, path };
  });

  return { listing: JSON.stringify([{ name: "root", path: root }, ...listed]), root };
}

/**
 * Builds a runner that answers from a table, keyed by the command and its arguments joined.
 */
function answering(table: Readonly<Record<string, Partial<Ran>>>): Runner {
  return (command, args) => {
    const held = table[[command, ...args].join(" ")] ?? { code: 1, stderr: "unplanned call" };

    return Promise.resolve({ code: 0, stderr: "", stdout: "", ...held });
  };
}

const TRUSTING = JSON.stringify([
  { repository: "stealth-scale/config", workflow: ".github/workflows/release.yml" },
]);

describe("members", () => {
  it("lists every member with whether it builds and whether it is private", async () => {
    const held = workspace([
      { name: "@acme/one", scripts: { build: "vp pack" } },
      { name: "@acme/two", private: true },
    ]);
    const found = await members(
      answering({ "pnpm ls -r --depth -1 --json": { stdout: held.listing } }),
      held.root,
    );

    expect(found.map((one) => [one.name, one.builds, one.private])).toStrictEqual([
      ["@acme/one", true, false],
      ["@acme/two", false, true],
    ]);
  });

  it("ends the plan when the listing cannot be read", async () => {
    await expect(members(answering({}), "/nowhere")).rejects.toThrow("pnpm ls failed");
  });
});

describe("published", () => {
  it("reads a package the registry answers for as published", async () => {
    const run = answering({ "npm view @acme/one name --json": { stdout: '"@acme/one"' } });

    await expect(published(run, "@acme/one")).resolves.toBe(true);
  });

  it("reads a 404 as absence", async () => {
    const run = answering({
      "npm view @acme/one name --json": { code: 1, stderr: "npm error code E404" },
    });

    await expect(published(run, "@acme/one")).resolves.toBe(false);
  });

  it("ends the plan on any other failure rather than counting the package as absent", async () => {
    const run = answering({
      "npm view @acme/one name --json": { code: 1, stderr: "npm error code E401 unauthorized" },
    });

    await expect(published(run, "@acme/one")).rejects.toThrow("gave no answer");
  });
});

describe("trusted", () => {
  it("reads a record naming the repository and the workflow as trust", async () => {
    const run = answering({ "npm trust list @acme/one --json": { stdout: TRUSTING } });

    await expect(trusted(run, "@acme/one")).resolves.toBe(true);
  });

  it("reads a record for another repository as no trust", async () => {
    const stdout = JSON.stringify([{ repository: "other/repo", workflow: "release.yml" }]);
    const run = answering({ "npm trust list @acme/one --json": { stdout } });

    await expect(trusted(run, "@acme/one")).resolves.toBe(false);
  });

  it("reads a listing the registry refused as no trust", async () => {
    const run = answering({ "npm trust list @acme/one --json": { code: 1 } });

    await expect(trusted(run, "@acme/one")).resolves.toBe(false);
  });

  it("ends the plan on a listing that is no JSON", async () => {
    const run = answering({
      "npm trust list @acme/one --json": { stdout: "stealth-scale/config release.yml" },
    });

    await expect(trusted(run, "@acme/one")).rejects.toThrow("wrote no JSON");
  });
});

describe("planned", () => {
  it("plans a publication and a trust for every public member the registry lacks", async () => {
    const held = workspace([
      { name: "@acme/one", scripts: { build: "vp pack" } },
      { name: "@acme/two" },
      { name: "@acme/secret", private: true },
    ]);
    const plan = await planned(
      answering({
        "npm trust list @acme/two --json": { stdout: TRUSTING },
        "npm view @acme/one name --json": { code: 1, stderr: "E404" },
        "npm view @acme/two name --json": { stdout: '"@acme/two"' },
        "pnpm ls -r --depth -1 --json": { stdout: held.listing },
      }),
      held.root,
    );

    expect(plan.map((one) => [one.member.name, one.publish, one.trust])).toStrictEqual([
      ["@acme/one", true, true],
      ["@acme/two", false, false],
    ]);
    expect(printed(plan)).toBe("@acme/one: build, publish, trust\n@acme/two: nothing to do");
  });

  it("plans a publication without a build for a member that declares none", async () => {
    const held = workspace([{ name: "@acme/plain" }]);
    const plan = await planned(
      answering({
        "npm view @acme/plain name --json": { code: 1, stderr: "E404" },
        "pnpm ls -r --depth -1 --json": { stdout: held.listing },
      }),
      held.root,
    );

    expect(printed(plan)).toBe("@acme/plain: publish, trust");
  });
});
