/**
 * Rewrites an import from the icon set's root into one import per icon file, so a document loads
 * the icons it draws and not the two thousand the root exports.
 *
 * @remarks
 *   A build tree-shakes the root down to the icons a page draws, but a dev server does not: in
 *   middleware mode the root is pre-bundled whole, five megabytes for every document that imports
 *   one icon, and in full bundle mode the vendor chunk carries every icon, because that mode does
 *   not shake. The set publishes one module per icon under `dist/esm/icons`, named in kebab case,
 *   and every alias the root exports has a file of its own, so the file an identifier stands for
 *   is a spelling rule rather than a table. The rewrite runs on the source before anything else
 *   reads it, keeps the line count, and leaves an identifier alone where no icon file answers to
 *   it, which is how the root's own helpers and its types stay on the root import.
 */

import { type Plugin } from "vite";

import { contribute, type Contribution } from "@stealthscale/vite-config";

/**
 * The package the icons are imported from.
 */
const ROOT = "lucide-react";

/**
 * Where the package keeps one module per icon.
 */
const ICONS = `${ROOT}/dist/esm/icons/`;

/**
 * Matches one named import from the root, with everything between its braces.
 */
const IMPORTED = /import\s*\{([^}]*)\}\s*from\s*["']lucide-react["'];?/gu;

/**
 * The file kinds the rewrite reads.
 */
const SOURCE = /\.[jt]sx?(?:$|\?)/u;

/**
 * The files the rewrite leaves alone.
 */
const UNTOUCHED = /\/node_modules\//u;

/**
 * Where the rewrite is contributed.
 */
const AT = "plugins";

/**
 * One name an import binds: what the root exports it as, and what the file binds it to.
 */
interface Bound {
  /**
   * The name the root exports.
   */
  readonly exported: string;

  /**
   * The name the importing file binds, which is the exported name unless the import renames it.
   */
  readonly local: string;
}

/**
 * Reports whether a character is a capital letter.
 */
function isCapital(character: string): boolean {
  return /^[A-Z]$/u.test(character);
}

/**
 * Reports whether a character is a small letter.
 */
function isSmall(character: string): boolean {
  return /^[a-z]$/u.test(character);
}

/**
 * Reports whether a character is a digit.
 */
function isDigit(character: string): boolean {
  return /^[0-9]$/u.test(character);
}

/**
 * Spells the icon file an exported name stands for.
 *
 * @remarks
 *   The root exports every icon under three names, `Smartphone`, `SmartphoneIcon` and
 *   `LucideSmartphone`, and every one of them spells the same file once the affix is dropped. The
 *   file's name is the icon's, in parts joined by hyphens, and the exported name is those parts
 *   with the first letter of each raised. So a part starts at a capital that follows a small
 *   letter or a digit, or that is followed by a small letter, which is what tells `AArrowDown`
 *   apart from `Axis3D`. A part starts at a digit that follows a letter, unless the part it is in
 *   started with a digit, which is what keeps `2x2` together in `Grid2x2` while `Grid2X2` spells
 *   `grid-2-x-2`. The set publishes a file under every one of those spellings.
 * @param exported - The name the root exports.
 * @returns The file's name, without its extension.
 */
export function fileOf(exported: string): string {
  const bare = exported.replace(/^Lucide/u, "").replace(/Icon$/u, "");
  let file = "";
  let digital = false;

  for (let index = 0; index < bare.length; index += 1) {
    const character = bare.charAt(index);
    const before = bare.charAt(index - 1);
    const after = bare.charAt(index + 1);

    if (isCapital(character)) {
      file += startsAtCapital(before, after)
        ? `-${character.toLowerCase()}`
        : character.toLowerCase();
      digital = false;
    } else if (isDigit(character) && !digital && before !== "" && !isDigit(before)) {
      file += `-${character}`;
      digital = true;
    } else {
      file += character;
    }
  }

  return file;
}

/**
 * Reports whether a capital starts a part: it follows a small letter or a digit, or a small
 * letter follows it, and it is not the first letter.
 */
function startsAtCapital(before: string, after: string): boolean {
  return before !== "" && (isSmall(before) || isDigit(before) || isSmall(after));
}

/**
 * The names one import binds to values, with its type-only specifiers left out.
 */
interface Read {
  /**
   * The names the import binds to values.
   */
  readonly values: Bound[];
}

/**
 * Reads the names one import binds to values, leaving its type-only specifiers out.
 */
function bound(specifiers: string): Read {
  const values: Bound[] = [];

  for (const specifier of specifiers.split(",")) {
    const written = specifier.trim();

    if (written === "" || written.startsWith("type ")) continue;

    const [exported = "", local = exported] = written.split(/\s+as\s+/u);

    values.push({ exported, local });
  }

  return { values };
}

/**
 * Writes the statements that replace one import: an import per icon, and the root import for
 * whatever value stays on it, on one line, padded to the lines the original took. An import that
 * binds no icon is left as written.
 *
 * @remarks
 *   A type-only specifier is dropped rather than kept, because what is rewritten here is what the
 *   bundler runs and never what the type checker reads, and an import left with types alone is
 *   kept by the transform as an import of the root for its side effects, which loads the whole
 *   set again.
 */
function rewritten(
  original: string,
  specifiers: string,
  answers: (exported: string) => boolean,
): string {
  const { values } = bound(specifiers);
  const kept = values.filter((one) => !answers(one.exported)).map((one) => spelled(one));
  const statements = values
    .filter((one) => answers(one.exported))
    .map((one) => `import ${one.local} from "${ICONS}${fileOf(one.exported)}.mjs";`);

  if (statements.length === 0) return original;
  if (kept.length > 0) statements.push(`import { ${kept.join(", ")} } from "${ROOT}";`);

  return statements.join(" ") + "\n".repeat(original.split("\n").length - 1);
}

/**
 * Spells one bound name the way the import wrote it.
 */
function spelled(one: Bound): string {
  return one.exported === one.local ? one.exported : `${one.exported} as ${one.local}`;
}

/**
 * Rewrites every named import from the root in one file's source.
 *
 * @param code - The source.
 * @param answers - Says whether an exported name has an icon file of its own.
 * @returns The rewritten source, or null where the file imports nothing from the root.
 */
export function iconized(code: string, answers: (exported: string) => boolean): null | string {
  if (!code.includes(ROOT)) return null;

  const written = code.replaceAll(IMPORTED, (original, specifiers: string) =>
    rewritten(original, specifiers, answers),
  );

  return written === code ? null : written;
}

/**
 * Builds the plugin that rewrites the imports.
 *
 * @remarks
 *   Whether a name has a file is asked of the bundler's resolver once per name and remembered,
 *   so a file that imports three icons costs three resolutions the first time and none after.
 */
function plugin(): Plugin {
  const answered = new Map<string, boolean>();

  return {
    enforce: "pre",
    name: "react.plugin.icons",

    /**
     * Rewrites the imports of a source file that imports from the root, having asked the
     * resolver about each name it has not met before.
     */
    async transform(code, id) {
      if (!SOURCE.test(id) || UNTOUCHED.test(id) || !code.includes(ROOT)) return null;

      const names = [...code.matchAll(IMPORTED)].flatMap(
        ([, specifiers = ""]) => bound(specifiers).values,
      );
      const unmet = [...new Set(names.map((one) => one.exported))].filter(
        (exported) => !answered.has(exported),
      );

      await Promise.all(
        unmet.map(async (exported) => {
          const resolved = await this.resolve(`${ICONS}${fileOf(exported)}.mjs`, id);

          answered.set(exported, resolved !== null);
        }),
      );

      const written = iconized(code, (exported) => answered.get(exported) === true);

      return written === null ? null : { code: written, map: null };
    },
  };
}

/**
 * Imports each icon a file draws from the icon file that publishes it rather than from the root.
 *
 * @returns The contribution, under the name of the call that produced it.
 */
export function icons(): Contribution {
  return contribute({
    at: AT,
    because:
      "a dev server serves the icon set whole to every document that imports one icon, " +
      "and one import per icon file is what a build would have shaken it down to",
    item: plugin(),
    name: "react.plugin.icons",
  });
}
