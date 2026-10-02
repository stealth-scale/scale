/**
 * Builds the manifest text and the file entries a scratch workspace is written from.
 *
 * @remarks
 *   Nothing here writes to disk. Each function returns file contents keyed by path, and a
 *   specification passes the merged object to a scratch workspace.
 */

import { type ScratchFiles } from "#scratch.ts";

/**
 * The fields a generated manifest declares.
 *
 * @remarks
 *   The index signature passes any further field through unread. A misspelled `dependencies`
 *   reaches the manifest, and the package manager reports nothing.
 */
export interface ManifestFields {
  /**
   * The name the package resolves under.
   */
  readonly name: string;

  /**
   * Any further manifest field, serialised as it is given.
   */
  readonly [field: string]: unknown;
}

/**
 * Serialises manifest fields as the JSON text a package manager reads.
 *
 * @remarks
 *   The version is `0.0.0` unless `fields` declares one, so a specification states a version only
 *   where it asserts on one. The text ends in a newline, so a specification can compare it to a
 *   file a formatter wrote.
 */
export function manifest(fields: ManifestFields): string {
  return `${JSON.stringify({ version: "0.0.0", ...fields }, null, 2)}\n`;
}

/**
 * Returns a package's manifest and the rest of its files, each keyed under one directory.
 *
 * @remarks
 *   Every key in `files` is a path inside the package. A key that repeats the directory name nests
 *   the file twice and raises no error.
 * @param directory - Where the package sits below the workspace root, without a trailing slash.
 * @param fields - The manifest fields for this package.
 * @param files - Further file contents, keyed by a path inside the package.
 * @returns Each file keyed by its path from the workspace root, the manifest first.
 */
export function packageFiles(
  directory: string,
  fields: ManifestFields,
  files: ScratchFiles = {},
): ScratchFiles {
  const entries: Array<[string, string]> = [
    [`${directory}/package.json`, manifest(fields)],
    ...Object.entries(files).map(([path, content]): [string, string] => [
      `${directory}/${path}`,
      content,
    ]),
  ];
  return Object.fromEntries(entries);
}

/**
 * Returns the manifest of a workspace root declaring the globs its packages live under.
 *
 * @remarks
 *   The root is named `root` and marked private, so a specification cannot publish it by accident.
 *   `fields` is merged over both, so a caller can rename the root or add a catalog.
 */
export function workspaceFiles(
  workspaces: readonly string[],
  fields: Readonly<Record<string, unknown>> = {},
): ScratchFiles {
  return {
    "package.json": manifest({
      name: "root",
      private: true,
      workspaces: [...workspaces],
      ...fields,
    }),
  };
}
