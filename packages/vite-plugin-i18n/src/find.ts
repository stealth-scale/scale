/**
 * Locates every `locales/<language>/<namespace>.json` an application and its dependencies ship.
 *
 * @remarks
 *   A namespace is the first path segment under the language. `menu.json` and
 *   `menu/sections/billing.json` both belong to the namespace `menu`, and the second contributes
 *   its keys under `sections.billing`. A namespace is fetched as one module whatever it is split
 *   into.
 */

import { existsSync, globSync } from "node:fs";
import { basename, join } from "node:path";
import { normalizePath } from "vite";

import { type Manifest, manifestAt, packageAt, text } from "@stealthscale/vite-plugin-base";

/**
 * One catalogue file, with the language, namespace and package it belongs to.
 */
export interface Catalogue {
  /**
   * The absolute path of the file, with forward slashes.
   */
  readonly file: string;

  /**
   * The BCP 47 tag the directory is named after, such as `en` or `nl-BE`.
   */
  readonly language: string;

  /**
   * The first path segment under the language, without its extension. `menu.json` and
   * `menu/sections.json` both give `menu`.
   */
  readonly namespace: string;

  /**
   * True when the application owns the file, false when a package ships it.
   *
   * @remarks
   *   The root is the application where its manifest is `private`. A package built or tested on
   *   its own is the root too, and ships its files the way any package does, so they are not an
   *   application's.
   */
  readonly own: boolean;

  /**
   * The name of the package the file came from.
   */
  readonly owner: string;

  /**
   * The path below the namespace, joined with dots. `menu/sections/billing.json` gives
   * `sections.billing`, and a file that is the namespace itself gives an empty string.
   */
  readonly prefix: string;
}

/**
 * The directory a package keeps its catalogues in.
 */
export const LOCALES = "locales";

/**
 * Matches the extensions a catalogue may use: `.json`, `.yaml` and `.yml`.
 */
export const EXTENSION = /\.(?:json|ya?ml)$/u;

/**
 * Returns the namespace a file belongs to.
 *
 * @remarks
 *   The first path segment, with the extension stripped when the file is the namespace itself.
 * @param relative - The file's path under the language directory.
 */
export function namespaceOf(relative: string): string {
  const at = relative.indexOf("/");

  return at === -1 ? relative.replace(EXTENSION, "") : relative.slice(0, at);
}

/**
 * Returns the prefix a file's keys are nested under.
 *
 * @remarks
 *   The path below the namespace with the extension stripped and each separator replaced by a dot.
 * @param relative - The file's path under the language directory.
 * @returns The prefix, or an empty string when the file is the namespace itself.
 */
export function prefixOf(relative: string): string {
  const at = relative.indexOf("/");

  return at === -1
    ? ""
    : relative
        .slice(at + 1)
        .replace(EXTENSION, "")
        .replaceAll("/", ".");
}

/**
 * Lists every catalogue file under one directory's `locales`, at any depth.
 *
 * @param directory - The package or application directory to search.
 * @param owner - The package name to record on each result.
 * @param own - True when the directory is the application's own.
 * @returns The catalogues sorted by path, so the result is stable between runs.
 */
function cataloguesIn(directory: string, owner: string, own: boolean): readonly Catalogue[] {
  const root = join(directory, LOCALES);

  if (!existsSync(root)) return [];

  return globSync("*/**/*.{json,yaml,yml}", { cwd: root })
    .map((relative) => normalizePath(relative))
    .toSorted()
    .map((relative) => {
      const at = relative.indexOf("/");
      const rest = relative.slice(at + 1);

      return {
        file: normalizePath(join(root, relative)),
        language: relative.slice(0, at),
        namespace: namespaceOf(rest),
        own,
        owner,
        prefix: prefixOf(rest),
      };
    });
}

/**
 * Returns the scope a package name carries.
 *
 * @param name - The package name, or undefined when the manifest declares none.
 * @returns The scope such as `@stealthscale`, or undefined for an unscoped name.
 */
function scopeOf(name: string | undefined): string | undefined {
  return name?.startsWith("@") === true ? name.slice(0, name.indexOf("/")) : undefined;
}

/**
 * Lists the package names the walk follows out of one manifest.
 *
 * @remarks
 *   `dependencies` and `peerDependencies` both count, because a component package declares its
 *   siblings as peers. The root's `devDependencies` count too, because an example declares the
 *   packages it demonstrates there, and a package the siblings its specimens draw.
 * @param manifest - The parsed package.json.
 * @param starting - True for the manifest the search starts from.
 */
function namesIn(manifest: Manifest, starting: boolean): readonly string[] {
  const fields = ["dependencies", "peerDependencies", ...(starting ? ["devDependencies"] : [])];

  return fields.flatMap((field) => {
    const declared = manifest[field];

    return typeof declared === "object" && declared !== null ? Object.keys(declared) : [];
  });
}

/**
 * The state one walk carries: the scopes it follows and the directories it has visited.
 */
interface Walk {
  /**
   * The scopes whose packages the walk descends into.
   */
  readonly scopes: ReadonlySet<string>;

  /**
   * The directories already visited, so a package reached twice is read once.
   */
  readonly seen: Set<string>;
}

/**
 * One package the walk reached.
 */
interface Walked {
  /**
   * The absolute path of the package directory.
   */
  readonly at: string;

  /**
   * The parsed package.json, which the walk read to follow the package at all.
   */
  readonly manifest: Manifest;
}

/**
 * Visits a directory's dependencies depth first, so a package precedes whatever depends on it.
 *
 * @remarks
 *   Only packages under one of the scopes are followed. Following every dependency of a rendering
 *   engine would read hundreds of manifests and find no catalogue in any of them.
 * @param directory - The directory to start from.
 * @param walk - The scopes to follow and the directories already visited.
 * @param starting - True for the directory the search starts from, whose development dependencies
 *   are followed.
 * @returns Each package with its manifest, the starting directory last.
 */
function walked(directory: string, walk: Walk, starting: boolean): readonly Walked[] {
  if (walk.seen.has(directory)) return [];
  walk.seen.add(directory);

  const manifest = manifestAt(directory);

  if (manifest === undefined) return [];

  const below = namesIn(manifest, starting)
    .filter((name) => walk.scopes.has(scopeOf(name) ?? ""))
    .map((name) => packageAt(name, directory))
    .filter((at) => at !== undefined)
    .flatMap((at) => walked(at, walk, false));

  return [...below, { at: directory, manifest }];
}

/**
 * Returns every catalogue a root can reach, its dependencies' first and its own last.
 *
 * @remarks
 *   When two packages declare the same language and namespace, the one later in the result wins the
 *   merge, which puts the root last. Each package is resolved the way an import of it resolves, so
 *   a workspace link and an installed copy are found alike. The root's files are the application's
 *   own where the root's manifest is `private`. A package built or tested on its own is a package,
 *   and its files count as what it ships.
 * @param root - The application or package directory.
 * @param scopes - The scopes to follow. Defaults to the root's own scope.
 * @returns The catalogues in merge order.
 */
export function found(root: string, scopes?: readonly string[]): readonly Catalogue[] {
  const manifest = manifestAt(root);
  const named = manifest === undefined ? undefined : text(manifest, "name");
  const application = manifest?.["private"] === true;
  const walk: Walk = {
    scopes: new Set(scopes ?? [scopeOf(named)].filter((scope) => scope !== undefined)),
    seen: new Set(),
  };

  return walked(root, walk, true).flatMap((one) =>
    cataloguesIn(
      one.at,
      text(one.manifest, "name") ?? basename(one.at),
      application && one.at === root,
    ),
  );
}
