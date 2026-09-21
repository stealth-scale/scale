/**
 * Recovers the integrity and the origin of each installed package from the workspace lockfile.
 *
 * @remarks
 *   A package manager writes little into an installed package and bun writes nothing at all, so the
 *   lockfile is the only surviving record of what was actually fetched. Nothing here throws: a
 *   lockfile that is missing, unparseable or in an unrecognised format yields no records, and a
 *   build is never failed over a file nothing else in it reads.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { parseAllDocuments } from "yaml";

/**
 * Preserves what a lockfile pinned for one installed package.
 *
 * @remarks
 *   Every field is optional because the formats disagree over what is worth keeping, and because a
 *   package taken from the default registry at an ordinary version has no origin worth recording.
 */
export interface Installed {
  /**
   * The subresource integrity string the manager checked the download against.
   */
  integrity?: string;

  /**
   * The address the package was fetched from, where that was not the default registry.
   */
  registry?: string;

  /**
   * The version, or the reference such as a git commit that stands where a version would.
   */
  resolution?: string;
}

/**
 * A function that reads one lockfile format out of a candidate workspace root.
 *
 * @remarks
 *   Undefined means the format is absent from that directory, which is how the upward search tells
 *   a workspace root from any directory above the package. An empty map means the lockfile is
 *   present and pins nothing, and ends the search where it stands.
 */
type Reader = (root: string) => ReadonlyMap<string, Installed> | undefined;

/**
 * Parses a document that JSON almost describes, dropping the trailing commas bun writes.
 *
 * @remarks
 *   The bun lockfile is JSONC by choice, and no parser already in this tree reads it. Removing a
 *   comma before a closing bracket covers the one deviation bun actually produces; a comment in the
 *   file would still defeat this.
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
 * Reports whether a value is a digest, narrowing it to the string an algorithm prefix opens.
 *
 * @remarks
 *   Both formats put the digest in a slot that also carries registry addresses and empty strings.
 *   The prefix is the only thing separating them, so a digest written without one is passed over
 *   rather than stored as an integrity nothing can verify.
 */
function integral(held: unknown): held is string {
  return typeof held === "string" && /^sha\d{3}-/u.test(held);
}

/**
 * Turns one bun lockfile row into the key it installs under and what it pins under that key.
 *
 * @remarks
 *   A row's first field packs the name and the resolution together as `name@resolution`, which is
 *   the key every record is kept under. The split for the resolution takes the last `@` so that a
 *   scoped name survives it. The digest is looked for in the final field and the registry in the
 *   second, since bun leaves the second empty for a default registry install.
 * @returns The key and what the row pins, or undefined for a row whose first field names no
 *   resolution.
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
 * Gathers what bun.lock pins for each package listed in it.
 *
 * @remarks
 *   A file present but holding no packages returns an empty map rather than undefined, which stops
 *   the upward search at a workspace root whose lockfile has simply been emptied.
 * @returns One record per readable row, or undefined where the directory holds no bun.lock.
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
 * Cuts a pnpm package key into the name and whatever stands where its version would.
 *
 * @remarks
 *   The cut is made at the first `@` past the opening character, so `@types/node@26.5.1` keeps
 *   its scope and a resolution carrying an `@` of its own, an address with a credential or an
 *   alias such as `npm:real@1.0.0`, stays whole on the version's side. A key holding no `@` past
 *   its first character pins no version, and describes nothing this can record.
 */
function divided(key: string): readonly [string, string] | undefined {
  const at = key.indexOf("@", 1);

  if (at <= 0) return undefined;

  return [key.slice(0, at), key.slice(at + 1)];
}

/**
 * Combines a pnpm key's version with its resolution block into the record kept for that package.
 *
 * @remarks
 *   An ordinary version from the default registry is already carried by the package URL, so it is
 *   left out here and recorded only where the key holds a reference instead of a version, or where
 *   the entry names an archive of its own.
 * @param version - The text after the last `@` in the key, which is a version for a registry
 *   install and a reference for anything else.
 * @param resolution - The entry's resolution block, whose fields differ by how it was installed.
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
 * Reads one pnpm packages entry from its key and the value written under it.
 *
 * @remarks
 *   An entry is kept only where the key divides and a resolution block sits beneath it. An entry
 *   carrying platform fields and nothing else pins no download, and is left out of the result. The
 *   key, `name@version`, is what the record is kept under.
 * @returns The key and what the entry pins, or undefined where either half is missing.
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
 * Adds every readable entry of one parsed document to the records collected so far.
 *
 * @remarks
 *   A key met twice keeps whatever the later document said about it. pnpm puts the packages that
 *   make up its own installation in a document ahead of the dependency set, and this ordering is
 *   what lets the real set win.
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
 * Gathers what pnpm-lock.yaml pins, across every document the file holds.
 *
 * @remarks
 *   The file can carry more than one YAML document and a `packages` key can appear in each of them.
 *   A reader stopping at the first document would describe the packages pnpm is installed from
 *   rather than the ones the repository depends on.
 * @returns One record per readable entry, or undefined where the directory holds no pnpm-lock.yaml.
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
 * The lockfile formats that can be read, in the order they are tried.
 */
const READERS: readonly Reader[] = [bun, pnpm];

/**
 * Climbs from a directory to the nearest ancestor holding a lockfile one reader recognises.
 *
 * @remarks
 *   A package inside a workspace keeps no lockfile of its own, and the climb stops at the first
 *   directory that has one rather than at the outermost.
 * @returns The directory holding the lockfile, or undefined when the climb reaches the filesystem
 *   root without finding one.
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
 * Collects what the workspace lockfile pins for every package installed under it.
 *
 * @remarks
 *   A repository holding two lockfiles is read by whichever reader comes first, and the other is
 *   ignored rather than merged into it. A record is keyed by `name@version`, where the version is
 *   what the lockfile wrote after the name: a version for a registry install and a reference for
 *   anything else. So two installed versions of one package are two records, and
 *   {@link installedOf} picks the one an installation matches.
 * @param from - A directory inside the workspace. The search for a lockfile climbs from here.
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
 * Lists the records kept under one name, each with the text the lockfile wrote after the name.
 *
 * @remarks
 *   The `@` that ends the name is the first one past the key's opening character, which keeps a
 *   scoped name whole and leaves whatever follows the name, an alias or an address with an `@`
 *   of its own, on the version's side.
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
 * Finds what the lockfile pinned for one installation.
 *
 * @remarks
 *   The exact `name@version` is read first. Where no version is given, or the lockfile keys the one
 *   record under the name by a reference rather than a version, that one record is taken, because
 *   a reference is what stands in for the version of a package fetched from a repository. Anything
 *   else is a package the lockfile cannot vouch for, and nothing is returned rather than a digest
 *   that belongs to another copy.
 * @param pinned - The records {@link locked} collected.
 * @param name - The package's name.
 * @param version - The version the installed manifest states, where it states one.
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
