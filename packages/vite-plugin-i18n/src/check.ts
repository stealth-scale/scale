/**
 * Validates every catalogue against the fallback language.
 *
 * @remarks
 *   An undefined key, a dropped placeholder and a key one package declares twice all reach the page
 *   as a wrong string. The build reports them rather than shipping them.
 */

import { type CatalogueIndex, nested, type Words } from "#emit.ts";
import { type Catalogue } from "#find.ts";

/**
 * One fault found in a catalogue.
 */
export interface Problem {
  /**
   * Absolute path of the file the fault is in.
   */
  readonly file: string;

  /**
   * The dotted key, or an empty string when the fault is about the whole file.
   */
  readonly key: string;

  /**
   * The fault, phrased as a clause that follows the key in the reported line.
   */
  readonly says: string;
}

/**
 * Pattern for an i18next placeholder, `{{name}}` or `{{name, format}}`, capturing the name.
 */
const PLACEHOLDER = /\{\{\s*([^,}\s]+)/gu;

/**
 * Pattern for a plural suffix, one of the six categories CLDR defines.
 */
const PLURAL = /_(?:zero|one|two|few|many|other)$/u;

/**
 * Flattens nested contents to the dotted keys i18next addresses them by.
 *
 * @param words - Contents, nested as the file stores them.
 * @param prefix - Path down to these contents. Empty at the top level.
 */
function flattened(words: Words, prefix = ""): ReadonlyMap<string, string> {
  const flat = new Map<string, string>();

  for (const [key, value] of Object.entries(words)) {
    const at = prefix === "" ? key : `${prefix}.${key}`;

    if (typeof value === "string") flat.set(at, value);
    else for (const [inner, word] of flattened(value, at)) flat.set(inner, word);
  }

  return flat;
}

/**
 * Lists the placeholder names one string contains.
 *
 * @param word - A translated string.
 * @returns Each name once, sorted.
 */
function placeholdersOf(word: string): readonly string[] {
  return [
    ...new Set([...word.matchAll(PLACEHOLDER)].flatMap((match) => match.slice(1, 2))),
  ].toSorted();
}

/**
 * Strips a plural or context suffix, so `pages_one` can be checked against any `pages_*`.
 *
 * @remarks
 *   Everything after the last underscore is taken as the suffix, whether or not it is one. A key
 *   whose own name carries an underscore loses its tail here and matches more broadly than it
 *   should.
 * @param key - A dotted key, with or without a suffix.
 */
function stem(key: string): string {
  const at = key.lastIndexOf("_");

  return at === -1 ? key : key.slice(0, at);
}

/**
 * Lists the placeholders a translation is required to carry.
 *
 * @remarks
 *   A plural form drops `count` from the requirement. Some languages spell the number out in one of
 *   their forms, so `één pagina` is valid against `{{count}} page`.
 * @param key - The translated key.
 * @param against - The fallback string for that key.
 */
function wanted(key: string, against: string): readonly string[] {
  const names = placeholdersOf(against);

  return PLURAL.test(key) ? names.filter((name) => name !== "count") : names;
}

/**
 * Reports the placeholders an overriding string drops.
 *
 * @param file - The file that overrides the key.
 * @param key - The key being overridden.
 * @param word - The string the overriding file gives the key.
 * @param against - The string already defined for the key.
 * @returns One problem, or an empty array when the string carries every placeholder.
 */
function placeholdersChecked(
  file: Catalogue,
  key: string,
  word: string,
  against: string,
): readonly Problem[] {
  const carried = placeholdersOf(word);
  const missing = wanted(key, against).filter((name) => !carried.includes(name));

  return missing.length === 0
    ? []
    : [
        {
          file: file.file,
          key,
          says: `leaves out the placeholder ${missing.map((name) => `{{${name}}}`).join(", ")}`,
        },
      ];
}

/**
 * Validates one translation against the fallback's definition of its namespace.
 *
 * @remarks
 *   A key with no exact match falls back to the `_other` form of its stem, so a language carrying
 *   more plural categories than the fallback is checked against the fallback's plural string rather
 *   than reported as undefined.
 * @param file - The translation to check.
 * @param defined - The fallback's contents for that namespace, flattened.
 */
function checked(file: Catalogue, defined: ReadonlyMap<string, string>): readonly Problem[] {
  const stems = new Set([...defined.keys()].map((key) => stem(key)));
  const found: Problem[] = [];

  for (const [key, word] of flattened(nested(file))) {
    const against = defined.get(key) ?? defined.get(`${stem(key)}_other`);

    if (against === undefined) {
      if (!stems.has(stem(key))) {
        found.push({ file: file.file, key, says: "names a key the fallback does not define" });
      }
      continue;
    }

    found.push(...placeholdersChecked(file, key, word, against));
  }

  return found;
}

/**
 * One key as the merge has defined it so far.
 */
interface Defined {
  /**
   * The file that defined the key most recently.
   */
  readonly file: Catalogue;

  /**
   * The string that file gave the key.
   */
  readonly word: string;
}

/**
 * Merges the fallback's files for one namespace and collects the faults the merge exposes.
 *
 * @remarks
 *   A package defines whatever keys it ships and another package may override one. An application
 *   may override a key too, but a key it adds to a namespace a package owns is reported as a typo.
 *   One owner declaring a key in two files is a fault wherever it happens, because the merge picks
 *   one of them silently.
 * @param files - The fallback files of the namespace, in merge order.
 * @param found - Array the faults are pushed onto.
 * @returns The namespace's contents, flattened.
 */
function definition(files: readonly Catalogue[], found: Problem[]): ReadonlyMap<string, string> {
  const defined = new Map<string, Defined>();
  const packaged = files.some((file) => !file.own);

  for (const file of files) {
    for (const [key, word] of flattened(nested(file))) {
      const earlier = defined.get(key);

      if (earlier === undefined) {
        if (file.own && packaged && ![...defined.keys()].some((by) => stem(by) === stem(key))) {
          found.push({ file: file.file, key, says: "names a key the fallback does not define" });
          continue;
        }
      } else if (earlier.file.owner === file.owner) {
        found.push({ file: file.file, key, says: `is also declared in ${earlier.file.file}` });
      } else {
        found.push(...placeholdersChecked(file, key, word, earlier.word));
      }

      defined.set(key, { file, word });
    }
  }

  return new Map([...defined].map(([key, { word }]) => [key, word]));
}

/**
 * Validates the fallback's files against each other, then every translation against the fallback.
 *
 * @remarks
 *   An index with no entry for the fallback language reports nothing, on the grounds that there is
 *   nothing to check against.
 * @param index - The indexed catalogues.
 * @param fallback - The language that defines every key.
 * @returns Every fault, the fallback's first and the rest in file order.
 */
export function problems(index: CatalogueIndex, fallback: string): readonly Problem[] {
  const defining = index.get(fallback);

  if (defining === undefined) return [];

  const found: Problem[] = [];
  const definitions = new Map(
    [...defining].map(([namespace, files]) => [namespace, definition(files, found)]),
  );

  for (const [language, byNamespace] of index) {
    if (language === fallback) continue;

    for (const [namespace, files] of byNamespace) {
      const words = definitions.get(namespace);

      if (words === undefined) {
        found.push(
          ...files.map((file) => ({
            file: file.file,
            key: "",
            says: `names a namespace the ${fallback} catalogues do not define`,
          })),
        );
        continue;
      }

      for (const file of files) found.push(...checked(file, words));
    }
  }

  return found;
}
