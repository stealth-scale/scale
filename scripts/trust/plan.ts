/**
 * Plans what publishing and trusting every package of this workspace would take, and does nothing.
 *
 * @remarks
 *   The plan is read from the workspace itself, through the package manager's own listing, so a
 *   package added under any workspace glob is planned without this file changing. Only an answer
 *   the registry gives outright decides whether a package is published: a registry that cannot be
 *   reached, or refuses the question, ends the plan rather than counting the package as absent.
 *   `apply.ts` prints the plan and, with `--yes`, runs it.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { type Runner } from "./run.ts";

/**
 * The repository whose release workflow the registry is asked to trust.
 */
export const REPO = "stealth-scale/config";

/**
 * The workflow file the registry is asked to trust, under the repository's `.github/workflows`.
 */
export const FILE = "release.yml";

/**
 * One member of the workspace, as the package manager lists it.
 */
export interface Member {
  /**
   * Whether the manifest declares a `build` script, which a publication runs first.
   */
  readonly builds: boolean;

  /**
   * The package name.
   */
  readonly name: string;

  /**
   * The package directory, absolute.
   */
  readonly path: string;

  /**
   * Whether the manifest marks the package private, which keeps it off the registry.
   */
  readonly private: boolean;
}

/**
 * The plan's decision for one public member.
 */
export interface Planned {
  /**
   * The member.
   */
  readonly member: Member;

  /**
   * Whether the package has to be published first, because the registry does not have it.
   */
  readonly publish: boolean;

  /**
   * Whether the registry has to be asked to trust the workflow, because it does not yet.
   */
  readonly trust: boolean;
}

/**
 * One row of the package manager's listing.
 */
interface Listed {
  /**
   * The package name, absent for a directory with no manifest name.
   */
  readonly name?: string | undefined;

  /**
   * The package directory, absolute.
   */
  readonly path: string;
}

/**
 * Reports whether a parsed value is a row of the listing.
 */
function isListed(one: unknown): one is Listed {
  return typeof one === "object" && one !== null && typeof Reflect.get(one, "path") === "string";
}

/**
 * The two facts a member's manifest adds to the listing.
 */
interface Declared {
  /**
   * Whether the manifest declares a `build` script.
   */
  readonly builds: boolean;

  /**
   * Whether the manifest marks the package private.
   */
  readonly private: boolean;
}

/**
 * Reads whether a parsed manifest marks the package private, and whether it declares a build.
 */
function manifestOf(path: string): Declared {
  const held: unknown = JSON.parse(readFileSync(join(path, "package.json"), "utf8"));
  const scripts: unknown =
    typeof held === "object" && held !== null ? Reflect.get(held, "scripts") : undefined;

  return {
    builds: typeof scripts === "object" && scripts !== null && "build" in scripts,
    private: typeof held === "object" && held !== null && Reflect.get(held, "private") === true,
  };
}

/**
 * Joins one row of the listing with what its manifest declares.
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
 * Lists every member of the workspace, through the package manager's own listing.
 *
 * @throws {@link Error} When the listing cannot be read.
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
 * Asks the registry whether it has a package under a name.
 *
 * @remarks
 *   Only a `404` is read as absence. Any other failure, an expired login, a network the registry
 *   cannot be reached over, a rate limit, is not an answer, and the question ends the plan.
 * @throws {@link Error} When the registry gives no answer either way.
 */
export async function published(run: Runner, name: string): Promise<boolean> {
  const ran = await run("npm", ["view", name, "name", "--json"]);

  if (ran.code === 0) return true;
  if (/E404|code E404|404 Not Found/u.test(`${ran.stdout}\n${ran.stderr}`)) return false;

  throw new Error(`npm view ${name} gave no answer (${String(ran.code)}): ${ran.stderr.trim()}`);
}

/**
 * Reports whether one record the registry listed trusts the repository's workflow.
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
 * Reads whether the registry already trusts the repository's workflow for a package.
 *
 * @remarks
 *   The records are read as the registry's own JSON, and a listing that is not JSON ends the
 *   plan: a line grepped out of prose would read a record that mentions the repository as one
 *   that trusts it.
 * @throws {@link Error} When the listing cannot be read as records.
 */
export async function trusted(run: Runner, name: string): Promise<boolean> {
  const ran = await run("npm", ["trust", "list", name, "--json"]);

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
 * Plans every public member: whether it has to be published, and whether the registry has to be
 * asked to trust the workflow.
 *
 * @throws {@link Error} When a question to the registry gets no answer.
 */
export async function planned(run: Runner, root: string): Promise<readonly Planned[]> {
  const found = (await members(run, root)).filter((one) => !one.private);
  const held: Planned[] = [];

  for (const member of found) {
    const already = await published(run, member.name);

    held.push({
      member,
      publish: !already,
      trust: already ? !(await trusted(run, member.name)) : true,
    });
  }

  return held;
}

/**
 * Writes the plan as one line per member.
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
