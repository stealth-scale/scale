/**
 * Builds the context object every configuration layer receives.
 *
 * @remarks
 *   Both exports parse `package.json` files while walking up the tree, so a manifest that exists
 *   and is not valid JSON throws out of either one. A directory with no manifest is not an error.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { type ConfigEnv, loadEnv } from "vite";

import { workspaces } from "#workspace.ts";

/**
 * The subset of `package.json` this package reads.
 *
 * @remarks
 *   Every field is optional, because a directory with no manifest reaches a layer as an empty
 *   object rather than as undefined. The parsed object keeps the other fields the file declared;
 *   this interface types only the ones something here looks at.
 */
export interface Manifest {
  /**
   * The declared range for each run-time dependency.
   */
  readonly dependencies?: Readonly<Record<string, string>>;

  /**
   * The export map as written, with no specifier resolved.
   */
  readonly exports?: Readonly<Record<string, unknown>>;

  /**
   * The package name. A private workspace root usually has none.
   */
  readonly name?: string;

  /**
   * The exact version, never a range.
   */
  readonly version?: string;

  /**
   * The workspace globs, whichever package manager declared them.
   */
  readonly workspaces?: readonly string[];
}

/**
 * The package under configuration and where it sits on disk.
 *
 * @remarks
 *   Resolved once per composition and passed to every layer, so no layer touches the file system to
 *   work out where it is. Extends Vite's `ConfigEnv`, so `command` and `mode` are on it too.
 */
export interface Context extends ConfigEnv {
  /**
   * The directory being configured. Equal to `root` for a workspace-wide run.
   */
  readonly at: string;

  /**
   * The environment variables in scope: everything prefixed `STEALTH_` or `VITE_` from the root's
   * env files, the package's env files and the shell, plus the CI and revision variables by name.
   */
  readonly env: Readonly<Record<string, string>>;

  /**
   * The manifest at `at`, or an empty object when there is none.
   */
  readonly manifest: Manifest;

  /**
   * The workspace root. Equal to `at` for a standalone package.
   */
  readonly root: string;
}

/**
 * Parses the `package.json` in a directory and fills in its workspace globs.
 *
 * @remarks
 *   A missing file, and a file that parses to something other than an object, both give back an
 *   empty manifest. {@link workspaces} finds the globs wherever the package manager put them, so a
 *   pnpm repository gets a `workspaces` array its `package.json` never declared.
 * @throws {@link SyntaxError} When the file exists and holds invalid JSON.
 */
function read(at: string): Manifest {
  const path = join(at, "package.json");

  if (!existsSync(path)) return {};

  const held: unknown = JSON.parse(readFileSync(path, "utf8"));

  if (typeof held !== "object" || held === null) return {};

  const stated = workspaces(at, Object.fromEntries(Object.entries(held)));

  return stated === undefined ? held : { ...held, workspaces: stated };
}

/**
 * Walks up from a directory to the workspace root above it.
 *
 * @remarks
 *   The first directory that declares workspace globs wins, including one that declares an empty
 *   array. When nothing above declares any, the starting directory comes back, which is the answer
 *   a standalone package wants.
 */
export function rooted(from: string): string {
  for (let at = from; ;) {
    if (read(at).workspaces !== undefined) return at;

    const up = dirname(at);

    if (up === at) return from;

    at = up;
  }
}

/**
 * Picks the directory to configure: the one the config declared, or the one the command ran in.
 *
 * @remarks
 *   Running inside a package that has no config of its own configures that package, even though
 *   the file Vite executes is the root config. A package that has its own config is left alone,
 *   since that config declares its own directory when it runs.
 */
function configured(declared: string, root: string, from: string): string {
  if (declared !== root || from === root) return declared;

  return existsSync(join(from, "package.json")) && !configures(from) ? from : declared;
}

/**
 * The config filenames Vite accepts, in the order it looks for them.
 */
const CONFIGS = ["js", "mjs", "cjs", "ts", "mts", "cts"].map(
  (extension) => `vite.config.${extension}`,
);

/**
 * Checks a directory for a Vite config of its own.
 */
function configures(at: string): boolean {
  return CONFIGS.some((name) => existsSync(join(at, name)));
}

/**
 * The prefixes a variable needs to reach a layer, from an env file or from the shell.
 *
 * @remarks
 *   This repository prefixes its own variables `STEALTH_`, and Vite exposes `VITE_` to client
 *   code. A variable with neither prefix belongs to the shell, and a session path or a package
 *   manager flag differs between two shells that build the same output. The task runner
 *   fingerprints what a configuration read, so admitting one would miss the cache on every run.
 */
const PREFIXES = ["STEALTH_", "VITE_"];

/**
 * The unprefixed variables read from the shell by name.
 *
 * @remarks
 *   A build embeds the commit revision, and `CI` switches a default. Both belong in the
 *   fingerprint of a build that reads them.
 */
const NAMED = ["CI", "CI_COMMIT_SHA", "GITHUB_SHA"];

/**
 * Reads whichever of {@link NAMED} the shell set, and skips the rest.
 */
function named(): Record<string, string> {
  return Object.fromEntries(
    NAMED.flatMap((name) => {
      const held = process.env[name];

      return held === undefined ? [] : [[name, held]];
    }),
  );
}

/**
 * Loads the environment variables in scope for one directory.
 *
 * @remarks
 *   The root's env files load first and the package's merge over them, so a package can override a
 *   root variable and inherits the ones it leaves out. The shell beats both, because `loadEnv`
 *   merges `process.env` last. Only the prefixed variables and {@link NAMED} are read, so an
 *   unprefixed shell variable reaches no layer and no fingerprint.
 */
function varied(mode: string, at: string, root: string): Record<string, string> {
  const shared = loadEnv(mode, root, PREFIXES);
  const own = at === root ? {} : loadEnv(mode, at, PREFIXES);

  return { ...shared, ...own, ...named() };
}

/**
 * Builds the {@link Context} a composition passes to each of its layers.
 *
 * @remarks
 *   The caller declares the directory rather than letting this discover it, because Vite bundles a
 *   config to a temporary file outside its own package before running it. `import.meta.dirname` is
 *   the only expression that survives that move.
 * @param env - The command and mode Vite is invoking the config for.
 * @param declared - The directory the config declares for itself.
 * @param from - The directory the command ran in, which picks the package for a root-level config.
 * @throws {@link SyntaxError} When a manifest parsed on the way up to the root holds invalid JSON.
 */
export function contextOf(env: ConfigEnv, declared: string, from: string = process.cwd()): Context {
  const root = rooted(declared);
  const at = configured(declared, root, from);

  return { ...env, at, env: varied(env.mode, at, root), manifest: read(at), root };
}
