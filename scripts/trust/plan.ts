/**
 * Works out which public packages of this workspace need publishing and which need the release
 * workflow trusted, and runs neither step.
 *
 * @remarks
 *   The members come from `pnpm ls`, so a package added under any workspace glob is planned
 *   without this file changing. Only a definite answer from the registry decides whether a package
 *   is published: a registry that does not respond, or that refuses the question, ends the plan.
 *   Every npm command runs from a directory outside the workspace, because npm refuses to run
 *   inside it: the root manifest names pnpm under `devEngines`. `apply.ts` prints the plan and runs
 *   it with `--yes`.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { type Runner } from "./run.ts";

/**
 * Identifies the repository whose release workflow the registry is asked to trust.
 */
export const REPO = "stealth-scale/scale";

/**
 * Identifies the workflow file the registry is asked to trust, under the repository's
 * `.github/workflows`.
 */
export const FILE = "release.yml";

/**
 * Describes one workspace member, as the package manager lists it and its manifest declares it.
 */
export interface Member {
  /**
   * Reports whether the manifest declares a `build` script, which a publication runs first.
   */
  readonly builds: boolean;

  /**
   * Gives the package name.
   */
  readonly name: string;

  /**
   * Gives the absolute path of the package directory.
   */
  readonly path: string;

  /**
   * Reports whether the manifest marks the package private, which keeps it off the registry.
   */
  readonly private: boolean;
}

/**
 * Records the plan's decision for one public member.
 */
export interface Planned {
  /**
   * Gives the member the decision applies to.
   */
  readonly member: Member;

  /**
   * Reports whether the package has to be published first, because the registry does not have it.
   */
  readonly publish: boolean;

  /**
   * Reports whether the registry still has to be asked to trust the workflow.
   */
  readonly trust: boolean;
}

/**
 * Describes one row of the package manager's listing.
 */
interface Listed {
  /**
   * Gives the package name, absent for a directory whose manifest declares none.
   */
  readonly name?: string | undefined;

  /**
   * Gives the absolute path of the package directory.
   */
  readonly path: string;
}

/**
 * Returns true when a parsed value has the path a listing row needs, and narrows it to
 * {@link Listed}.
 */
function isListed(one: unknown): one is Listed {
  return typeof one === "object" && one !== null && typeof Reflect.get(one, "path") === "string";
}

/**
 * Lists the two facts a member's manifest adds to its listing row.
 */
interface Declared {
  /**
   * Reports whether the manifest declares a `build` script.
   */
  readonly builds: boolean;

  /**
   * Reports whether the manifest marks the package private.
   */
  readonly private: boolean;
}

/**
 * Reads package.json in a directory for its `build` script and its `private` flag.
 */
function manifestOf(path: string): Declared {
  const manifest: unknown = JSON.parse(readFileSync(join(path, "package.json"), "utf8"));
  const scripts: unknown =
    typeof manifest === "object" && manifest !== null
      ? Reflect.get(manifest, "scripts")
      : undefined;

  return {
    builds: typeof scripts === "object" && scripts !== null && "build" in scripts,
    private:
      typeof manifest === "object" &&
      manifest !== null &&
      Reflect.get(manifest, "private") === true,
  };
}

/**
 * Builds a member from one listing row and the manifest at its path.
 */
function memberOf(one: Listed): Member {
  const declared = manifestOf(one.path);

  return {
    builds: declared.builds,
    name: one.name ?? "",
    path: one.path,
    private: declared.private,
  };
}

/**
 * Lists every named workspace member except the root, as `pnpm ls` reports them.
 *
 * @throws {@link Error} When `pnpm ls` exits non-zero, with its code and its standard error.
 */
export async function members(run: Runner, root: string): Promise<readonly Member[]> {
  const ran = await run("pnpm", ["ls", "-r", "--depth", "-1", "--json"], root);

  if (ran.code !== 0) throw new Error(`pnpm ls failed (${String(ran.code)}): ${ran.stderr}`);

  const listed: unknown = JSON.parse(ran.stdout);

  return (Array.isArray(listed) ? listed : [])
    .filter((one) => isListed(one))
    .filter((one) => typeof one.name === "string" && one.path !== root)
    .map((one) => memberOf(one));
}

/**
 * Asks the registry whether a package exists under a name.
 *
 * @remarks
 *   Only a `404` counts as absence. An expired login, an unreachable network and a rate limit
 *   leave the question open, and the plan ends there rather than plan a publish over a package
 *   the registry already has.
 * @param run - The runner the command goes through.
 * @param name - The package name.
 * @param outside - A directory outside the workspace, which npm runs from.
 * @throws {@link Error} When the registry gives no answer either way.
 */
export async function published(run: Runner, name: string, outside: string): Promise<boolean> {
  const ran = await run("npm", ["view", name, "name", "--json"], outside);

  if (ran.code === 0) return true;
  if (/E404|code E404|404 Not Found/u.test(`${ran.stdout}\n${ran.stderr}`)) return false;

  throw new Error(`npm view ${name} gave no answer (${String(ran.code)}): ${ran.stderr.trim()}`);
}

/**
 * Returns true when one record from the registry names this repository and its release workflow.
 */
function trusts(one: unknown): boolean {
  if (typeof one !== "object" || one === null) return false;

  const workflow: unknown = Reflect.get(one, "workflow");

  return (
    Reflect.get(one, "repository") === REPO &&
    typeof workflow === "string" &&
    (workflow === FILE || workflow.endsWith(`/${FILE}`))
  );
}

/**
 * Asks the registry whether it already trusts the repository's workflow for a package.
 *
 * @remarks
 *   A command that exits non-zero counts as no trust. A listing that is not JSON ends the plan
 *   instead, because matching the repository name against prose would count a record that merely
 *   mentions the repository as trust.
 * @param run - The runner the command goes through.
 * @param name - The package name.
 * @param outside - A directory outside the workspace, which npm runs from.
 * @throws {@link Error} When the listing is not JSON, with the first 200 characters of it.
 */
export async function trusted(run: Runner, name: string, outside: string): Promise<boolean> {
  const ran = await run("npm", ["trust", "list", name, "--json"], outside);

  if (ran.code !== 0) return false;

  let records: unknown;

  try {
    records = JSON.parse(ran.stdout);
  } catch (error) {
    throw new Error(`npm trust list ${name} wrote no JSON: ${ran.stdout.slice(0, 200)}`, {
      cause: error,
    });
  }

  return Array.isArray(records) && records.some((one) => trusts(one));
}

/**
 * Decides for every public member whether to publish it and whether to ask the registry to trust
 * the workflow.
 *
 * @remarks
 *   A package the registry does not have is planned for both steps, since trust is granted on a
 *   name the registry already knows.
 * @param run - The runner the commands go through.
 * @param root - The workspace root, which pnpm lists the members from.
 * @param outside - A directory outside the workspace, which npm runs from.
 * @throws {@link Error} When a question to the registry gets no answer.
 */
export async function planned(
  run: Runner,
  root: string,
  outside: string,
): Promise<readonly Planned[]> {
  const found = (await members(run, root)).filter((one) => !one.private);
  const plan: Planned[] = [];

  for (const member of found) {
    const already = await published(run, member.name, outside);

    plan.push({
      member,
      publish: !already,
      trust: already ? !(await trusted(run, member.name, outside)) : true,
    });
  }

  return plan;
}

/**
 * Formats the plan as one line per member, naming the steps it needs or that it needs none.
 */
export function printed(plan: readonly Planned[]): string {
  return plan
    .map((one) => {
      const steps = [
        one.publish ? (one.member.builds ? "build, publish" : "publish") : "",
        one.trust ? "trust" : "",
      ].filter((step) => step !== "");

      return `${one.member.name}: ${steps.length === 0 ? "nothing to do" : steps.join(", ")}`;
    })
    .join("\n");
}
