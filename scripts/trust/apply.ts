/**
 * Runs the plan `plan.ts` made: builds and publishes what the registry lacks, then asks the
 * registry to trust the release workflow for every public package.
 *
 * @remarks
 *   Nothing runs without `--yes`, so a run without it prints the plan and stops. The publish runs
 *   through pnpm in the package directory, which resolves the workspace ranges. The trust runs
 *   through npm 11.15 or later and needs a login with two-factor authentication. Both ask for a
 *   one-time password or a browser login, which npm writes to a terminal alone, so both run on
 *   this one. npm refuses to run inside this workspace because the root manifest names pnpm under
 *   devEngines, so the plan's questions and the trust pass run from one scratch directory outside
 *   it.
 */

import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { FILE, type Planned, planned, printed, REPO } from "./plan.ts";
import { attended, type Ran, run, type Runner } from "./run.ts";

/**
 * Ends the run at the first command that fails.
 *
 * @remarks
 *   The command wrote its own output to the terminal, so the error names the step and the code.
 * @throws {@link Error} When the command ended with a code other than zero.
 */
function ended(ran: Ran, what: string): void {
  if (ran.code !== 0) throw new Error(`${what} failed with exit code ${String(ran.code)}.`);
}

/**
 * Publishes one member, building it first where it declares a build.
 */
async function publishes(acting: Runner, one: Planned): Promise<void> {
  if (one.member.builds) ended(await acting("pnpm", ["run", "build"], one.member.path), "build");

  ended(
    await acting("pnpm", ["publish", "--access", "public", "--no-git-checks"], one.member.path),
    `publish ${one.member.name}`,
  );
}

/**
 * Asks the registry to trust the workflow for one member, from outside the workspace.
 */
async function trusts(acting: Runner, one: Planned, scratch: string): Promise<void> {
  const args = ["trust", "github", one.member.name, "--file", FILE, "--repo", REPO];

  ended(
    await acting("npm", [...args, "--allow-publish", "--yes"], scratch),
    `trust ${one.member.name}`,
  );
}

/**
 * Prints the plan for a root and runs it where the caller asked for it.
 *
 * @param asking - The runner the plan's questions to the registry go through.
 * @param acting - The runner each publish and trust goes through.
 * @param root - The workspace root.
 * @param yes - Whether to run the plan after printing it.
 * @returns The plan that was printed.
 */
export async function applied(
  asking: Runner,
  acting: Runner,
  root: string,
  yes: boolean,
): Promise<readonly Planned[]> {
  const scratch = mkdtempSync(join(tmpdir(), "stealth-trust-"));

  try {
    const plan = await planned(asking, root, scratch);

    console.log(printed(plan));

    if (yes) {
      for (const one of plan) {
        if (one.publish) await publishes(acting, one);
        if (one.trust) await trusts(acting, one, scratch);
      }
    }

    return plan;
  } finally {
    rmSync(scratch, { force: true, recursive: true });
  }
}

/**
 * The workspace root, two directories above this file.
 */
const ROOT = join(import.meta.dirname, "..", "..");

/**
 * The result of `pnpm whoami`, which every question to the registry needs to succeed.
 */
const login = await run("pnpm", ["whoami"], ROOT);

if (login.code !== 0) {
  console.error("not logged in to the registry: run npm login first");
  process.exit(1);
}

await applied(run, attended, ROOT, process.argv.includes("--yes"));
