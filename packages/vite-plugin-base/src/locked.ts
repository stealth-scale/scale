/**
 * Reads the bun or pnpm lockfile for a directory and reports the version, registry and digest it
 * pinned for each installed package.
 *
 * @remarks
 *   An installed package under node_modules keeps no record of where it was fetched from or what
 *   digest was checked on install, so the lockfile is the only source for either. Nothing here
 *   throws: a lockfile that is missing, unparseable or in a third format yields an empty map,
 *   because no build should fail over a file the rest of the build ignores.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { parseAllDocuments } from "yaml";

/**
 * Records the origin and digest one lockfile entry pinned for an installed package version.
 *
 * @remarks
 *   Every field is optional, and a record with none of them set is a valid answer. bun and pnpm
 *   write different fields, and a package taken from the default registry at a plain version has
 *   neither an origin nor a reference to record.
 */
export interface Installed {
  /**
   * Gives the digest the download was checked against, with its algorithm in front, such as
   * `sha512-`.
   */
  integrity?: string;

  /**
   * Gives the address the package was fetched from. An install from the default registry leaves it
   * unset.
   */
  registry?: string;

  /**
   * Gives the version, or the git reference or alias the lockfile wrote in place of one.
   */
  resolution?: string;
}

/**
 * Reads one lockfile format from a directory, and returns undefined where that format is absent.
 *
 * @remarks
 *   An empty map and undefined mean different things to the caller. Undefined sends the search one
 *   directory further up. An empty map stops it, because a lockfile that pins nothing still marks
 *   the workspace root.
 */
type Reader = (root: string) => ReadonlyMap<string, Installed> | undefined;

/**
 * Reads a file and parses it as JSON, after dropping the trailing commas bun writes.
 *
 * @remarks
 *   A bun lockfile is JSONC, and no parser installed in this tree accepts that dialect. A comma
 *   before a closing bracket or brace is the only deviation bun emits in practice, so a comment
 *   anywhere in the file still fails the parse.
 * @returns The parsed document, or undefined when the file cannot be read or does not parse.
 */
function relaxed(at: string): unknown {
  try {
    return JSON.parse(readFileSync(at, "utf8").replaceAll(/,(?=\s*[\]}])/gu, ""));
  } catch {
    return undefined;
  }
}

/**
 * Returns true when a value carries a `sha` prefix and its digest length, and narrows it to string.
 *
 * @remarks
 *   One slot in each format takes a digest, a registry address or an empty string. The prefix is
 *   the only thing that tells them apart, so a digest written without one is dropped rather than
 *   stored as an integrity value nothing can check.
 */
function integral(held: unknown): held is string {
  return typeof held === "string" && /^sha\d{3}-/u.test(held);
}

/**
 * Converts one bun lockfile row into its map key and the installation the row pins.
 *
 * @remarks
 *   A row reads `[name@resolution, registry, metadata, integrity]`. The key is the whole first
 *   field, so two installed versions of one name stay apart. The search for `@` starts at index 1,
 *   because a scoped name opens with one. An empty registry field means the default registry.
 * @returns The key and the installation, or undefined when the first field is not a string or
 *   carries nothing after the name.
 */
function entry(held: readonly unknown[]): readonly [string, Installed] | undefined {
  const first = held[0];

  if (typeof first !== "string") return undefined;

  const at = first.indexOf("@", 1);

  if (at < 1) return undefined;

  const last = held.at(-1);
  const second = held[1];

  return [
    first,
    {
      ...(integral(last) ? { integrity: last } : {}),
      ...(typeof second === "string" && second !== "" && !integral(second)
        ? { registry: second }
        : {}),
      resolution: first.slice(at + 1),
    },
  ];
}

/**
 * Reads bun.lock in a directory and maps every package row to the installation it pins.
 *
 * @returns One record per row that parses, an empty map where bun.lock lists no packages, or
 *   undefined where the directory has no bun.lock.
 */
function bun(root: string): ReadonlyMap<string, Installed> | undefined {
  const at = join(root, "bun.lock");

  if (!existsSync(at)) return undefined;

  const held = relaxed(at);
  const packages: unknown =
    typeof held === "object" && held !== null ? Reflect.get(held, "packages") : undefined;

  if (typeof packages !== "object" || packages === null) return new Map();

  const found = new Map<string, Installed>();

  for (const one of Object.values<unknown>(Object.fromEntries(Object.entries(packages)))) {
    const read = Array.isArray(one) ? entry(one) : undefined;

    if (read !== undefined) found.set(read[0], read[1]);
  }

  return found;
}

/**
 * Splits a pnpm packages key at the `@` that ends the package name.
 *
 * @remarks
 *   A scoped name starts with `@`, so the split is the first `@` after index 0. Every `@` after
 *   that one stays on the version side, which keeps an alias such as `npm:real@1.0.0` intact.
 * @returns The name and the text after it, or undefined for a key with nothing after the name.
 */
function divided(key: string): readonly [string, string] | undefined {
  const at = key.indexOf("@", 1);

  if (at <= 0) return undefined;

  return [key.slice(0, at), key.slice(at + 1)];
}

/**
 * Builds the record for one pnpm entry from its version and its resolution block.
 *
 * @remarks
 *   The resolution is set only where it adds something the key does not already carry: a reference
 *   instead of a version, or an archive the entry points at. A plain registry version is left
 *   unset.
 * @param version - The text after the `@` that ends the name: a version for a registry install, a
 *   reference for anything else.
 * @param resolution - The entry's resolution block. Both `tarball` and `url` give a download
 *   address, and a registry install has neither.
 */
function resolved(version: string, resolution: Readonly<Record<string, unknown>>): Installed {
  const integrity = resolution["integrity"];
  const tarball = resolution["tarball"];
  const url = resolution["url"];
  const from = typeof tarball === "string" ? tarball : url;
  const held: Installed = {};

  if (integral(integrity)) held.integrity = integrity;
  if (typeof from === "string") held.registry = from;
  if (!/^\d/u.test(version) || typeof from === "string") held.resolution = version;

  return held;
}

/**
 * Converts one pnpm packages key and its entry into a map key and the record it pins.
 *
 * @remarks
 *   An entry can declare platform constraints and nothing else. It pins no download, so it is
 *   dropped here rather than recorded with every field empty.
 * @returns The key and its record, or undefined where the key does not split or the entry has no
 *   resolution block.
 */
function record(key: string, one: unknown): readonly [string, Installed] | undefined {
  const split = divided(key);
  const resolution: unknown =
    typeof one === "object" && one !== null ? Reflect.get(one, "resolution") : undefined;

  if (split === undefined) return undefined;
  if (typeof resolution !== "object" || resolution === null) return undefined;

  return [key, resolved(split[1], Object.fromEntries(Object.entries(resolution)))];
}

/**
 * Merges the package entries of one parsed pnpm document into the records collected so far.
 *
 * @remarks
 *   A later document overwrites a key an earlier one set. pnpm-lock.yaml can hold several YAML
 *   documents, and pnpm lists the packages of its own installation before the repository's
 *   dependency set, so the dependency set is the one left standing.
 */
function gathered(held: unknown, found: Map<string, Installed>): void {
  const packages: unknown =
    typeof held === "object" && held !== null ? Reflect.get(held, "packages") : undefined;

  if (typeof packages !== "object" || packages === null) return;

  for (const [key, one] of Object.entries<unknown>(Object.fromEntries(Object.entries(packages)))) {
    const read = record(key, one);

    if (read !== undefined) found.set(read[0], read[1]);
  }
}

/**
 * Reads pnpm-lock.yaml in a directory and maps every package entry to the installation it pins.
 *
 * @returns One record per entry that parses across every document in the file, or undefined where
 *   the directory has no pnpm-lock.yaml.
 */
function pnpm(root: string): ReadonlyMap<string, Installed> | undefined {
  const at = join(root, "pnpm-lock.yaml");

  if (!existsSync(at)) return undefined;

  const found = new Map<string, Installed>();

  for (const document of parseAllDocuments(readFileSync(at, "utf8"))) {
    const held: unknown = document.toJS();

    gathered(held, found);
  }

  return found;
}

/**
 * Orders the lockfile readers a directory is tried against.
 *
 * @remarks
 *   A repository holding both lockfiles is read by bun, and pnpm-lock.yaml is ignored rather than
 *   merged into the result.
 */
const READERS: readonly Reader[] = [bun, pnpm];

/**
 * Walks up from a directory to the first one where a reader recognises a lockfile.
 *
 * @remarks
 *   The nearest directory with a lockfile wins, not the outermost. A repository checked out inside
 *   another workspace is therefore read against its own lockfile.
 * @returns The directory holding the lockfile, or undefined when the walk reaches the filesystem
 *   root.
 */
function rooted(from: string): string | undefined {
  for (let at = from; ;) {
    if (READERS.some((read) => read(at) !== undefined)) return at;

    const up = dirname(at);

    if (up === at) return undefined;

    at = up;
  }
}

/**
 * Reads the workspace lockfile and reports what it pins for every package installed under a
 * directory.
 *
 * @remarks
 *   A record is keyed by the whole lockfile key, `name@version`, where the version is whatever the
 *   lockfile wrote after the name: a version for a registry install, a reference for anything else.
 *   Two installed versions of one package are two records, and {@link installedOf} picks between
 *   them.
 * @param from - A directory inside the workspace. The walk up to the lockfile starts here.
 * @returns One record per installed package version, and an empty map where no lockfile was found
 *   or none could be read.
 */
export function locked(from: string): ReadonlyMap<string, Installed> {
  const root = rooted(from);

  for (const read of READERS) {
    const held = root === undefined ? undefined : read(root);

    if (held !== undefined) return held;
  }

  return new Map();
}

/**
 * Selects every record for one package name, rekeyed by the text that follows the name.
 *
 * @remarks
 *   A key matches only where the `@` ending the name given is the first one past index 0. That is
 *   the same split the key was recorded under, so a name carrying an `@` of its own never matches a
 *   shorter name.
 */
function under(
  pinned: ReadonlyMap<string, Installed>,
  name: string,
): ReadonlyArray<readonly [string, Installed]> {
  return [...pinned]
    .filter(([key]) => key.startsWith(`${name}@`) && key.indexOf("@", 1) === name.length)
    .map(([key, held]) => [key.slice(name.length + 1), held]);
}

/**
 * Looks up the record {@link locked} kept for one installation of a package.
 *
 * @remarks
 *   The exact `name@version` key is tried first. A sole record under the name is taken instead when
 *   the installation declares no version, or when that record is keyed by a reference rather than a
 *   version, because a reference stands in for the version of a package fetched from a repository.
 *   Any other outcome yields undefined rather than a digest belonging to a different copy.
 * @returns The record the lockfile pinned, or undefined where no record can be matched to this
 *   installation.
 */
export function installedOf(
  pinned: ReadonlyMap<string, Installed>,
  name: string,
  version?: string,
): Installed | undefined {
  const exact = version === undefined ? undefined : pinned.get(`${name}@${version}`);

  if (exact !== undefined) return exact;

  const found = under(pinned, name);
  const only = found[0];

  if (found.length !== 1 || only === undefined) return undefined;

  return version === undefined || !/^\d/u.test(only[0]) ? only[1] : undefined;
}
