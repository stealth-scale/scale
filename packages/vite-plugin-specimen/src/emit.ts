/**
 * Generates the modules a catalogue imports: the page index, and one page's scenes as source.
 */

import { relative } from "node:path";

import { manifestAt, owning, text } from "@stealthscale/vite-plugin-base";

import { type Anatomy, type Read, type Source } from "#contract.ts";
import { FRAGMENTS, PROPS, UPDATED } from "#options.ts";
import { isRefused, read } from "#read.ts";

/**
 * Describes the two fields the plugin reads from a resolved configuration.
 *
 * @remarks
 *   Narrower than Vite's own type, so a specification supplies two fields instead of building a
 *   whole configuration.
 */
export interface Resolved {
  /**
   * Whether the bundler is building or serving.
   */
  readonly command: "build" | "serve";

  /**
   * The project root the patterns resolve against.
   */
  readonly root: string;
}

/**
 * Describes one file's generated listing and the identifier it is addressed by.
 */
export interface Listed {
  /**
   * The page identifier, or undefined when the reader refused the file.
   */
  id: string | undefined;

  /**
   * The listing, as generated source.
   */
  listing: string;
}

/**
 * Converts an absolute path into the path a catalogue displays.
 *
 * @remarks
 *   Relative to the root whether or not the file sits under it, because a catalogue shows the
 *   components of the packages beside it, and the listing is shipped: an absolute path would put
 *   the machine the catalogue was built on into what a reader downloads.
 * @returns The path relative to the root, with forward slashes.
 */
function shown(path: string, root: string): string {
  return relative(root, path).replaceAll("\\", "/");
}

/**
 * Maps a directory to the name of the package it belongs to, for the files of one index build.
 *
 * @remarks
 *   An index build reads every specimen, and the specimens of one package share every directory
 *   above them. Each directory is read once per build and never across builds, so a package
 *   renamed while the server runs is read again on the next build.
 */
export type Owners = Map<string, string>;

/**
 * Resolves the name of the package a file belongs to.
 *
 * @remarks
 *   The nearest manifest above the file that declares a name, which is the specifier a reader
 *   imports the page's components from. The search continues past a manifest that declares none,
 *   such as one written only to mark a directory as ESM. Every directory the search walks is
 *   recorded in `owners` under the name it found, so the next file under any of them stops there.
 * @returns The package name, or an empty string when no manifest above the file declares one.
 */
export function ownerOf(path: string, owners: Owners = new Map()): string {
  const walked: string[] = [];
  let found = "";

  for (let directory = owning(path); directory !== undefined; directory = owning(directory)) {
    const known = owners.get(directory);

    if (known !== undefined) {
      found = known;
      break;
    }

    walked.push(directory);

    const name = text(manifestAt(directory) ?? {}, "name");

    if (name !== undefined && name !== "") {
      found = name;
      break;
    }
  }

  for (const directory of walked) owners.set(directory, found);

  return found;
}

/**
 * Generates the loader properties of one listing.
 *
 * @remarks
 *   A refused file loads a rejection carrying the reason, and carries neither a fragments nor a
 *   props loader. `propped` states whether the index was asked to read props at all.
 */
function loaders(result: Read, propped: boolean): readonly string[] {
  if (isRefused(result)) {
    return [`    load: () => Promise.reject(new Error(${JSON.stringify(result.wrong)})),`];
  }

  return [
    `    fragments: () => import(${JSON.stringify(`${FRAGMENTS}${result.id}`)}),`,
    `    load: () => import(${JSON.stringify(result.path)}),`,
    ...(propped ? [`    props: () => import(${JSON.stringify(`${PROPS}${result.id}`)}),`] : []),
  ];
}

/**
 * Generates the metadata properties of one listing, one property per line.
 */
function metadata(result: Read, root: string, owners: Owners): readonly string[] {
  const path = shown(result.path, root);
  const fields = isRefused(result)
    ? {
        about: result.wrong,
        group: "",
        id: path,
        namespace: "",
        package: "",
        path,
        title: path.slice(path.lastIndexOf("/") + 1),
      }
    : {
        about: result.about,
        group: result.group,
        id: result.id,
        namespace: result.namespace,
        package: ownerOf(result.path, owners),
        path,
        title: result.title,
      };

  return Object.entries(fields).map(([key, value]) => `    ${key}: ${JSON.stringify(value)},`);
}

/**
 * Generates one listing.
 *
 * @remarks
 *   The import specifier stays absolute, because that is what the bundler resolves. Only the
 *   displayed path is made relative to the root.
 */
function listing(result: Read, root: string, propped: boolean, owners: Owners): string {
  return ["  {", ...metadata(result, root, owners), ...loaders(result, propped), "  }"].join("\n");
}

/**
 * Reads the files and generates a listing for each.
 *
 * @remarks
 *   A build throws on the first set of unreadable files and names all of them. A dev server lists
 *   each one with a rejecting loader instead, so the rest of the catalogue keeps working while a
 *   file is half-written.
 * @returns Each file's listing, keyed by absolute path, in the order the files were given.
 * @throws {@link Error} When the command is not `serve` and a file could not be read.
 */
export function listings(
  resolved: Resolved,
  files: readonly Source[],
  propped = false,
): ReadonlyMap<string, Listed> {
  const results = read(files);
  const refused = results.filter((result) => isRefused(result));
  const owners: Owners = new Map();

  if (refused.length > 0 && resolved.command !== "serve") {
    const named = refused.map((result) => `  ${result.path}: ${result.wrong}`).join("\n");

    throw new Error(
      `specimen: could not index ${refused.length} of ${results.length} files:\n${named}`,
    );
  }

  return new Map(
    results.map((result) => [
      result.path,
      {
        id: isRefused(result) ? undefined : result.id,
        listing: listing(result, resolved.root, propped, owners),
      },
    ]),
  );
}

/**
 * Generates the module a catalogue imports the pages from.
 *
 * @param listed - Every listing under its file's path, in the order the pages are shown.
 */
export function written(listed: ReadonlyMap<string, Listed>): string {
  const pages = [...listed.values()].map((held) => held.listing);

  return `export const pages = [\n${pages.join(",\n")},\n];\n`;
}

/**
 * Generates the statement that makes a module accept its own hot update and tell the catalogue
 * what replaced it.
 *
 * @remarks
 *   A specimen file exports scenes and constants beside its components, so the refresh runtime
 *   cannot accept an edit to it, and the index that imports it is reached through a dynamic
 *   import, which a server that bundles registers under another identifier than the one an
 *   accepting importer would name. Each module therefore accepts itself: the bundler runs the
 *   new module and hands it to the callback, and the callback dispatches {@link UPDATED} on the
 *   window with the page's identifier and the module, under the key the catalogue reads it by.
 * @param page - The page's identifier.
 * @param key - The key the module is reported under: `module` for the page's own, `fragments`
 *   for its sources.
 * @returns The statement, on one line, ending in a newline.
 */
export function accepting(page: string, key: "fragments" | "module"): string {
  const detail = `{ ${key}: replaced, id: ${JSON.stringify(page)} }`;

  return (
    "if (import.meta.hot) import.meta.hot.accept((replaced) => { if (replaced !== undefined) " +
    `window.dispatchEvent(new CustomEvent(${JSON.stringify(UPDATED)}, { detail: ${detail} })); });\n`
  );
}

/**
 * Generates the module a catalogue imports one page's scenes as source from, beside the names the
 * page imports from its own package, accepting its own hot update.
 *
 * @param snippets - Each scene's source, keyed by title.
 * @param names - The components the page imports from its own package.
 * @param page - The page's identifier, which the module reports its replacement under.
 */
export function fragmented(
  snippets: Readonly<Record<string, string>>,
  names: readonly string[],
  page: string,
): string {
  return (
    `export const fragments = ${JSON.stringify(snippets)};\nexport const imported = ${JSON.stringify(names)};\n` +
    accepting(page, "fragments")
  );
}

/**
 * Generates the module a catalogue imports one page's props from.
 *
 * @param anatomy - The page's parts, what each accepts, and what was dropped.
 */
export function anatomised(anatomy: Anatomy): string {
  return [
    `export const dropped = ${JSON.stringify(anatomy.dropped)};`,
    `export const parts = ${JSON.stringify(anatomy.parts)};`,
    `export const shapes = ${JSON.stringify(anatomy.shapes)};`,
    "",
  ].join("\n");
}
