/**
 * Runs the plan `plan.ts` made: builds and publishes what the registry lacks, then asks the
 * registry to trust the release workflow for every public package.
 *
 * @remarks
 *   The plan is printed first and nothing runs without `--yes`, so a run without it is a dry run.
 *   The publish runs through pnpm in the package directory, which resolves the workspace ranges
 *   and asks for the one-time password where the account requires one. The trust runs through npm,
 *   which needs the package on the registry, a login with two-factor authentication and npm 11.15
 *   or later. npm refuses to run inside this workspace because the root manifest names pnpm under
 *   devEngines, so the trust pass runs from a scratch directory outside it.
 *   Usage: `pnpm trust:plan`, or `pnpm trust:apply -- --yes` to run what it printed.
 */

import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { FILE, type Planned, planned, printed, REPO } from "./plan.ts";
import { type Ran, run, type Runner } from "./run.ts";

/**
 * Ends the run at the first command that fails.
 *
 * @throws {@link Error} When the command ended with a code other than zero.
 */
function ended(ran: Ran, what: string): void {
  if (ran.code !== 0) throw new Error(`${what} failed (${String(ran.code)}): ${ran.stderr}`);
}

/**
 * Publishes one member, building it first where it declares a build.
 */
async function publishes(through: Runner, one: Planned): Promise<void> {
  if (one.member.builds) ended(await through("pnpm", ["run", "build"], one.member.path), "build");

  ended(
    await through("pnpm", ["publish", "--access", "public", "--no-git-checks"], one.member.path),
    `publish ${one.member.name}`,
  );
}

/**
 * Asks the registry to trust the workflow for one member, from outside the workspace.
 */
async function trusts(through: Runner, one: Planned, scratch: string): Promise<void> {
  const args = ["trust", "github", one.member.name, "--file", FILE, "--repo", REPO];

  ended(
    await through("npm", [...args, "--allow-publish", "--yes"], scratch),
    `trust ${one.member.name}`,
  );
}

/**
 * Runs the plan for a root, publishing and trusting what it says.
 *
 * @param through - The runner the commands go through.
 * @param root - The workspace root.
 * @param yes - Whether to run the plan rather than print it.
 * @returns The plan that was printed, and run where asked.
 */
export async function applied(
  through: Runner,
  root: string,
  yes: boolean,
): Promise<readonly Planned[]> {
  const plan = await planned(through, root);

  console.log(printed(plan));

  if (!yes) return plan;

  const scratch = mkdtempSync(join(tmpdir(), "stealth-trust-"));

  try {
    for (const one of plan) {
      if (one.publish) await publishes(through, one);
      if (one.trust) await trusts(through, one, scratch);
    }
  } finally {
    rmSync(scratch, { force: true, recursive: true });
  }

  return plan;
}

/**
 * The workspace root, two directories above this file.
 */
const ROOT = join(import.meta.dirname, "..", "..");

/**
 * Whether the account is logged in to the registry, which every question and every mutation needs.
 */
const login = await run("pnpm", ["whoami"], ROOT);

if (login.code !== 0) {
  console.error("not logged in to the registry: run npm login first");
  process.exit(1);
}

await applied(run, ROOT, process.argv.includes("--yes"));
