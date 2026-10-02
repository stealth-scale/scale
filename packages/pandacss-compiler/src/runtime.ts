/**
 * Patches the generated runtime so the class names the browser writes match the scheme the
 * stylesheet was renamed to.
 *
 * @remarks
 *   The compiler generates its runtime from templates and offers no hook into the names, so each
 *   template line is matched exactly as the installed compiler writes it and swapped for a call
 *   into the naming package. The slot binding's `data-slot` attribute only repeats the slot the
 *   part's class already names, so that line is deleted outright. A compiler release that moves any
 *   of these lines breaks the rewrite loudly, which is why this package pins the compiler version.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { type Separator } from "@stealthscale/pandacss-naming";

/**
 * The package a rewritten runtime imports the scheme from.
 */
const NAMING = "@stealthscale/pandacss-naming";

/**
 * The extensions codegen writes the runtime under, in the order they are tried.
 */
const EXTENSIONS = ["mjs", "js"];

/**
 * The placeholder in a replacement that takes the configured separator, as a literal.
 */
const MARK = "<separator>";

/**
 * The opening line of a rewritten file that imports nothing, so a second run recognises it.
 */
const REWRITTEN = "// rewritten by @stealthscale/pandacss-compiler\n";

/**
 * The directive a generated JSX file opens with, which has to stay its first statement.
 */
const DIRECTIVE = /^"use client";\n/u;

/**
 * The directory codegen writes the JSX bindings into, present only where the compiler was
 * configured with a JSX framework.
 */
const JSX = "jsx";

/**
 * One line to find a fixed number of times, and what to write in its place.
 */
interface Edit {
  /**
   * The line as the compiler emits it. A pattern rather than a string, because the recipe runtime's
   * variant line carries the configured separator.
   */
  anchor: RegExp;
  /**
   * The line in readable form, for the error a moved line raises.
   */
  line: string;
  /**
   * The line to write in its place, carrying the separator's mark wherever the scheme needs it.
   */
  replacement: string;
  /**
   * How many times the anchor has to turn up. One unless stated.
   */
  times?: number | undefined;
}

/**
 * One generated file to patch: what it imports from the naming package, and which of its lines are
 * replaced.
 */
interface Rewrite {
  /**
   * The edits, applied in order.
   */
  edits: readonly Edit[];
  /**
   * The file's path under the runtime directory, without its extension.
   */
  file: string;
  /**
   * The names the rewritten file imports from the naming package. Empty where it needs none.
   */
  names: readonly string[];
}

/**
 * The `helpers` rewrite: put the joined class through the scheme, and keep an empty name out of the
 * element's class list, an empty name being a boolean axis at `false`.
 */
const HELPERS: Rewrite = {
  edits: [
    {
      anchor: /parts\.join\(":"\)/gu,
      line: 'parts.join(":")',
      replacement: `atomicClass(parts.join(":"), ${MARK})`,
    },
    {
      anchor: /set\.add\(name\)/gu,
      line: "set.add(name)",
      replacement: 'if (name !== "") set.add(name)',
    },
  ],
  file: "helpers",
  names: ["atomicClass"],
};

/**
 * The recipe runtime rewrite: take the variant class from the scheme, and put a compound's class
 * through it the same way the stylesheet's went.
 */
const RECIPES: Rewrite = {
  edits: [
    {
      anchor: /`\$\{className\}--\$\{prop\}[-_=]\$\{withoutSpace\(value\)\}`/gu,
      line: "`${className}--${prop}<separator>${withoutSpace(value)}`",
      replacement: "variantClass(className, prop, value)",
    },
    {
      anchor: /return classPrefix \? `\$\{classPrefix\}-\$\{next\}` : next/gu,
      line: "return classPrefix ? `${classPrefix}-${next}` : next",
      replacement: `return atomicClass(classPrefix ? \`\${classPrefix}-\${next}\` : next, ${MARK})`,
    },
  ],
  file: join("recipes", "runtime"),
  names: ["atomicClass", "variantClass"],
};

/**
 * The slot binding rewrite: drop the line that writes `data-slot` on a part, once in the provider
 * and once in the part, since the slot's class already names it.
 */
const SLOTS: Rewrite = {
  edits: [
    {
      anchor: /'data-slot': slot,\n\s*/gu,
      line: "'data-slot': slot,",
      replacement: "",
      times: 2,
    },
  ],
  file: join("jsx", "create-slot-recipe-context"),
  names: [],
};

/**
 * Builds the opening line of a rewritten file, which doubles as the mark that it has been
 * rewritten: an import of the names it needs, or a bare comment where it needs none.
 */
function header(names: readonly string[]): string {
  return names.length === 0 ? REWRITTEN : `import { ${names.join(", ")} } from "${NAMING}";\n`;
}

/**
 * Spells a count the way the error message about a moved line reads it.
 */
function expected(times: number): string {
  return times === 1 ? "once" : `${String(times)} times`;
}

/**
 * Applies one edit to a file's text, with the separator written in as a literal.
 *
 * @remarks
 *   The replacement is passed as a function so that a `$` in it is written through literally rather
 *   than read as a substitution pattern.
 * @throws {@link Error} When the anchor turns up any number of times other than the one the edit
 *   states.
 */
function applied(file: string, text: string, edit: Edit, separator: Separator): string {
  const found = text.match(edit.anchor)?.length ?? 0;
  const times = edit.times ?? 1;

  if (found !== times) {
    throw new Error(
      `${file} contains ${edit.line} ${String(found)} times where the rewrite needs it ${expected(times)}`,
    );
  }

  const replacement = edit.replacement.replaceAll(MARK, JSON.stringify(separator));

  return text.replaceAll(edit.anchor, () => replacement);
}

/**
 * Applies a rewrite to one file, leaving a file that already carries it alone.
 *
 * @remarks
 *   The header goes after the `"use client"` directive where a file opens with one: a directive
 *   only counts as a directive while it is the module's first statement.
 */
function rewrite(file: string, rewriting: Rewrite, separator: Separator): void {
  const source = readFileSync(file, "utf8");
  const opening = header(rewriting.names);
  const directive = DIRECTIVE.exec(source)?.[0] ?? "";
  const body = source.slice(directive.length);

  if (body.startsWith(opening)) return;

  writeFileSync(
    file,
    `${directive}${opening}${rewriting.edits.reduce((text, edit) => applied(file, text, edit, separator), body)}`,
  );
}

/**
 * Rewrites the generated runtime in a directory so the browser writes the scheme.
 *
 * @remarks
 *   The runtime is read under its `mjs` extension, falling back to `js` where the compiler was
 *   configured for that. The slot binding is only rewritten where the runtime has a `jsx`
 *   directory, which it has only where the compiler was configured with a JSX framework. Running
 *   this twice over the same runtime changes nothing the second time.
 * @param dir - The directory codegen wrote the runtime into, holding `helpers`, `recipes/runtime`
 *   and, with a JSX framework, `jsx/create-slot-recipe-context`.
 * @param separator - The separator the compiler was configured with, which the scheme reads at
 *   run time.
 * @throws {@link Error} When the directory contains no runtime, or a template line is not found
 *   in its file as many times as the rewrite needs it.
 */
export function rewriteRuntime(dir: string, separator: Separator): void {
  const extension = EXTENSIONS.find((each) => existsSync(join(dir, `helpers.${each}`)));

  if (extension === undefined) {
    throw new Error(`${dir} contains no generated runtime: neither helpers.mjs nor helpers.js`);
  }

  rewrite(join(dir, `${HELPERS.file}.${extension}`), HELPERS, separator);
  rewrite(join(dir, `${RECIPES.file}.${extension}`), RECIPES, separator);
  if (existsSync(join(dir, JSX)))
    rewrite(join(dir, `${SLOTS.file}.${extension}`), SLOTS, separator);
}
