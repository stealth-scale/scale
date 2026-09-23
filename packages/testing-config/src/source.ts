/**
 * Checks that each source file under `src` has a spec, declares its imports and carries the right
 * suffix.
 *
 * @remarks
 *   Specs are paired with sources by path, not by what they import. A source tested only through a
 *   sibling's spec counts as uncovered. The pairing is deliberate: the cases of each source have
 *   one predictable location, and an untested file is visible in the file tree.
 */

import { existsSync, globSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

import { type Published } from "#manifest.ts";

/**
 * Glob matching the source files of a package.
 */
const SOURCES = "src/**/*.{ts,tsx}";

/**
 * File suffixes excluded from the source checks.
 *
 * @remarks
 *   Spec, fixtures, specimen and example files run in the workspace, under a test runner or in the
 *   catalogue. They resolve imports through the workspace root and ship no behaviour. Declaration
 *   files compile to nothing.
 */
const APART = [
  ".spec.ts",
  ".spec.tsx",
  ".fixtures.ts",
  ".fixtures.tsx",
  ".specimen.tsx",
  ".example.tsx",
  ".d.ts",
];

/**
 * Barrel file names. A barrel re-exports other modules and declares nothing.
 */
const BARRELS = new Set(["index.ts", "index.tsx"]);

/**
 * Accepted spec suffixes, independent of the suffix of the source.
 */
const BESIDE = [".spec.ts", ".spec.tsx"];

/**
 * Matches a line that starts with an export.
 */
const EXPORTS = /^export\b/mu;

/**
 * Matches a line that exports only a type or an interface.
 */
const EXPORTS_TYPE = /^export (?:interface|type)\b/mu;

/**
 * Capture the specifier of each import and re-export in a file.
 *
 * @remarks
 *   Both patterns anchor at the start of a line and never cross a quote or a semicolon. The anchors
 *   exclude imports inside template literals, such as code a generator emits for another package.
 */
const SPECIFIERS = [
  /^\s*(?:import|export)\b[^"';]*?\bfrom\s*"([^"]+)"/gmu,
  /^\s*import\s+"([^"]+)"/gmu,
];

/**
 * Matches a closing or self-closing JSX tag.
 */
const TAGS = /<\/[A-Za-z][\w.]*>|\/>/u;

/**
 * Returns true for a published source file. A barrel counts only when `barrels` is true.
 */
function named(path: string, barrels: boolean): boolean {
  const file = basename(path);

  return !APART.some((one) => file.endsWith(one)) && (barrels || !BARRELS.has(file));
}

/**
 * Returns true when the file exports a runtime value or exports nothing.
 *
 * @remarks
 *   A module that exports only types and interfaces compiles to nothing, so it has no behaviour to
 *   test. The check scans text lines instead of the AST, which is sufficient because every other
 *   export form emits a value.
 */
function declares(at: string, path: string): boolean {
  const held = readFileSync(join(at, path), "utf8");
  const exported = held.split("\n").filter((line) => EXPORTS.test(line));

  return exported.length === 0 || !exported.every((line) => EXPORTS_TYPE.test(line));
}

/**
 * Reports every source file without a spec beside it.
 *
 * @remarks
 *   Barrels are skipped unless `barrels` is true, because the conformance spec of the package
 *   already covers them. Component packages set `barrels`, because their barrels define the public
 *   surface of each component. Fixtures, declaration files and type-only modules are always
 *   skipped.
 * @param at - Directory containing the package manifest.
 * @param barrels - Whether barrels also require a spec.
 * @returns One violation per source file without a spec, or an empty array.
 */
export function specs(at: string, barrels = false): readonly string[] {
  const found = globSync(SOURCES, { cwd: at }).filter(
    (path) => named(path, barrels) && declares(at, path),
  );

  return found
    .filter((path) => !BESIDE.some((one) => existsSync(join(at, path.replace(/\.tsx?$/u, one)))))
    .toSorted()
    .map((path) => `${path} has no specification beside it`);
}

/**
 * Matches a specifier with a URL scheme, such as `node:path` or `virtual:i18n`.
 *
 * @remarks
 *   Builtins come from the runtime and virtual modules from bundler plugins, so neither belongs in
 *   a manifest. A package name cannot contain a colon, so no installed package matches.
 */
const SCHEME = /^[a-z][a-z\d+.-]*:/u;

/**
 * Returns the package name of a specifier, or undefined for a relative path, a `#` subpath, a
 * builtin or a virtual module.
 *
 * @remarks
 *   Subpaths are dropped, so `@acme/theme/authoring` resolves to `@acme/theme`. A manifest declares
 *   packages, not entry points.
 */
function packageOf(specifier: string): string | undefined {
  if (specifier.startsWith(".") || specifier.startsWith("#") || SCHEME.test(specifier)) {
    return undefined;
  }

  const parts = specifier.split("/");

  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

/**
 * Reports every package a source file imports without the manifest declaring it.
 *
 * @remarks
 *   A published source runs in the consumer's install, so every import must be a dependency or a
 *   peer dependency. Files matching {@link APART} are skipped. `publint` and `attw` do not read
 *   imports, so an undeclared import installs cleanly and fails at runtime.
 * @param at - Directory containing the package manifest.
 * @param published - Parsed manifest.
 * @returns One violation per undeclared package, naming the importing file.
 */
export function declared(at: string, published: Published): readonly string[] {
  const allowed = new Set([
    ...Object.keys(published.dependencies ?? {}),
    ...Object.keys(published.peerDependencies ?? {}),
  ]);
  const found = globSync(SOURCES, { cwd: at }).filter((path) => named(path, true));

  return found
    .flatMap((path) => {
      const held = readFileSync(join(at, path), "utf8");

      return SPECIFIERS.flatMap((pattern) =>
        Array.from(held.matchAll(pattern)).flatMap((match) => match.slice(1)),
      )
        .map((specifier) => packageOf(specifier))
        .filter((name) => name !== undefined && !allowed.has(name))
        .map((name) => `${path} imports ${String(name)}, which the manifest does not declare`);
    })
    .toSorted();
}

/**
 * Reports every `.tsx` file that contains no JSX.
 *
 * @remarks
 *   The `.tsx` suffix promises JSX. The reverse needs no check, because the compiler rejects JSX in
 *   a `.ts` file.
 * @param at - Directory containing the package manifest.
 * @returns One violation per `.tsx` file without JSX, or an empty array.
 */
export function jsx(at: string): readonly string[] {
  return globSync(SOURCES, { cwd: at })
    .filter((path) => path.endsWith(".tsx") && !TAGS.test(readFileSync(join(at, path), "utf8")))
    .toSorted()
    .map((path) => `${path} writes no JSX, so its suffix is ts`);
}
