/**
 * Keeps each page's anatomy on disk under a key its inputs hash to, so a build or a dev server that
 * finds a page unchanged starts no compiler.
 *
 * @remarks
 *   A page's anatomy is read from the files of its package and of every workspace package that
 *   package depends on or peers on, from the installed packages the lockfile pins, through the
 *   compiler options its tsconfig extends, and with the reader's own code and settings. The key
 *   hashes each of these inputs. An edit to a component changes the keys of its own pages and of
 *   the pages of the packages built on it, and no others.
 */

import { createHash } from "node:crypto";
import { globSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join, sep } from "node:path";

import { manifestAt, owning, packageAt } from "@stealthscale/vite-plugin-base";

import { type Settled } from "#anatomy/reading.ts";
import { type Anatomy } from "#contract.ts";

/**
 * The lockfiles a workspace pins its installed packages in, in the order they are looked for.
 */
const LOCKFILES = ["pnpm-lock.yaml", "bun.lock", "package-lock.json", "yarn.lock"];

/**
 * The directories a package's hash leaves out: installed packages, build output and coverage.
 */
const SKIPPED = new Set(["coverage", "dist", "node_modules"]);

/**
 * The files a package's hash reads: source, declarations and manifests.
 */
const HASHED = /\.(?:[cm]?[jt]sx?|json)$/u;

/**
 * The manifest fields that name the packages a package's published types are built on.
 */
const BUILT_ON = ["dependencies", "optionalDependencies", "peerDependencies"];

/**
 * The manifest field that lists the packages a package develops against, such as the configuration
 * its tsconfig extends.
 */
const DEVELOPED = "devDependencies";

/**
 * Keeps page anatomies on disk.
 */
export interface Store {
  /**
   * Returns a page's anatomy from the disk where its key is unchanged, or reads it and keeps it.
   *
   * @param page - The page's identifier, which the file's name is built from.
   * @param specimen - The page's absolute path, which its package is found from.
   * @param read - Reads the anatomy through the compiler.
   */
  anatomyOf: (page: string, specimen: string, read: () => Promise<Anatomy>) => Promise<Anatomy>;

  /**
   * Drops every hash taken, so the next key reads the files again.
   */
  forget: () => void;
}

/**
 * Describes one page's anatomy as the store writes it.
 */
interface Kept {
  /**
   * The anatomy.
   */
  readonly anatomy: Anatomy;

  /**
   * The key the anatomy was read under.
   */
  readonly key: string;
}

/**
 * Returns the SHA-256 of the parts, each ended by a null byte, so two splits of one text differ.
 */
function digest(parts: readonly string[]): string {
  const hash = createHash("sha256");

  for (const part of parts) hash.update(part).update("\0");

  return hash.digest("hex");
}

/**
 * Returns a file's text, or undefined where the file cannot be read.
 */
function textAt(file: string): string | undefined {
  try {
    return readFileSync(file, "utf8");
  } catch {
    return undefined;
  }
}

/**
 * Returns the text of the nearest lockfile at or above a directory, or an empty string where
 * there is none.
 */
function lockfileAt(directory: string): string {
  for (const name of LOCKFILES) {
    const text = textAt(join(directory, name));

    if (text !== undefined) return text;
  }

  const above = dirname(directory);

  return above === directory ? "" : lockfileAt(above);
}

/**
 * Returns the workspace packages one field of a package's manifest names.
 *
 * @remarks
 *   An installed package is left out, because the lockfile pins its version and the lockfile is in
 *   the key.
 */
function workspaceNamed(at: string, field: string): string[] {
  const named = manifestAt(at)?.[field];

  if (typeof named !== "object" || named === null) return [];

  return Object.keys(named).flatMap((name) => {
    const found = packageAt(name, at);

    return found === undefined || found.split(sep).includes("node_modules") ? [] : [found];
  });
}

/**
 * Returns a package, every workspace package its types are built on, directly or through another,
 * and the workspace packages it develops against, sorted.
 */
function packagesOf(at: string): readonly string[] {
  const found = new Set([at]);
  const pending = [at];

  for (let next = pending.pop(); next !== undefined; next = pending.pop()) {
    for (const field of BUILT_ON) {
      for (const reached of workspaceNamed(next, field)) {
        if (!found.has(reached)) pending.push(reached);

        found.add(reached);
      }
    }
  }

  for (const developed of workspaceNamed(at, DEVELOPED)) found.add(developed);

  return [...found].toSorted();
}

/**
 * Returns the hash of every source, declaration and manifest file under a package, by path.
 */
function contentOf(directory: string): string {
  const files = globSync("**/*", {
    cwd: directory,
    exclude: (entry) => SKIPPED.has(entry.name),
    withFileTypes: true,
  })
    .filter((entry) => entry.isFile() && HASHED.test(entry.name))
    .map((entry) => join(entry.parentPath, entry.name))
    .toSorted();

  return digest(
    files.flatMap((file) => [file.slice(directory.length), readFileSync(file, "utf8")]),
  );
}

/**
 * Returns the anatomy a file keeps under a key, or undefined where the file is absent, does not
 * parse, or was written under another key.
 */
function keptIn(file: string, key: string): Anatomy | undefined {
  try {
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the store writes nothing but its own records into its directory
    const kept = JSON.parse(readFileSync(file, "utf8")) as Kept;

    return kept.key === key ? kept.anatomy : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Opens the store under a cache directory, for one reading.
 *
 * @remarks
 *   The store takes each hash once and keeps it until `forget`, so a build hashes each package
 *   once. The reader's code is every file beside this module: the reader's modules in the source,
 *   and every chunk the packer wrote them into in a build. A file is written under another name and
 *   renamed into place, so a process reading it never reads half of it.
 * @param cache - Vite's cache directory. The store writes into `specimen/props` under it.
 * @param stated - The reading, which is part of every key.
 */
export function store(cache: string, stated: Settled): Store {
  const directory = join(cache, "specimen", "props");
  const reader = digest([contentOf(import.meta.dirname), JSON.stringify(stated)]);
  const contents = new Map<string, string>();
  const packages = new Map<string, readonly string[]>();
  let locked: string | undefined;

  /**
   * Returns the key of a page: the reader, the lockfile, and the content of every package the
   * page's package builds on.
   */
  function keyOf(specimen: string): string {
    const at = owning(specimen) ?? dirname(specimen);
    const reached = packages.get(at) ?? packagesOf(at);

    locked ??= digest([lockfileAt(at)]);
    packages.set(at, reached);

    return digest([
      reader,
      locked,
      ...reached.map((one) => {
        const content = contents.get(one) ?? contentOf(one);

        contents.set(one, content);

        return content;
      }),
    ]);
  }

  return {
    anatomyOf: async (page, specimen, read) => {
      const key = keyOf(specimen);
      const file = join(directory, `${encodeURIComponent(page)}.json`);
      const kept = keptIn(file, key);

      if (kept !== undefined) return kept;

      const anatomy = await read();
      const writing = `${file}.${String(process.pid)}`;

      mkdirSync(directory, { recursive: true });
      writeFileSync(writing, JSON.stringify({ anatomy, key }));
      renameSync(writing, file);

      return anatomy;
    },

    forget: () => {
      contents.clear();
      packages.clear();
      locked = undefined;
    },
  };
}
