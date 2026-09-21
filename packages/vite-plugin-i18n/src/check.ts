/**
 * Validates every catalogue against the fallback language.
 *
 * @remarks
 *   An undefined key, a dropped placeholder and a key one package declares twice are all invisible
 *   to a translator, so the build reports them instead.
 */

import { type CatalogueIndex, nested, type Words } from "#emit.ts";
import { type Catalogue } from "#find.ts";

/**
 * One fault found in a catalogue.
 */
export interface Problem {
  /**
   * The absolute path of the file holding the fault.
   */
  readonly file: string;

  /**
   * The dotted key, or an empty string when the fault is about the whole file.
   */
  readonly key: string;

  /**
   * The fault, phrased as a clause that follows the key.
   */
  readonly says: string;
}

/**
 * Matches an i18next placeholder, `{{name}}` or `{{name, format}}`.
 */
const PLACEHOLDER = /\{\{\s*([^,}\s]+)/gu;

/**
 * Matches a plural suffix, which is one of the six categories CLDR defines.
 */
const PLURAL = /_(?:zero|one|two|few|many|other)$/u;

/**
 * Flattens nested contents to the dotted keys i18next addresses them by.
 *
 * @param words - The contents, nested as the file stores them.
 * @param prefix - The path down to these contents, empty at the top level.
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
 * Lists the placeholder names one string carries.
 *
 * @param word - One translated string.
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
 * @param key - A dotted key, with or without a suffix.
 */
function stem(key: string): string {
  const at = key.lastIndexOf("_");

  return at === -1 ? key : key.slice(0, at);
}

/**
 * Lists the placeholders a translation has to carry.
 *
 * @remarks
 *   Every placeholder the fallback carries, except `count` in a plural form. Some languages spell
 *   the number out for one of their forms, so `één pagina` is valid against `{{count}} page`.
 * @param key - The translated key.
 * @param against - The fallback string for that key.
 */
function wanted(key: string, against: string): readonly string[] {
  const names = placeholdersOf(against);

  return PLURAL.test(key) ? names.filter((name) => name !== "count") : names;
}

/**
 * Reports a placeholder a restated key drops.
 *
 * @param file - The file restating the key.
 * @param key - The key being restated.
 * @param word - The string this file gives it.
 * @param against - The string the fallback gives it.
 * @returns One problem, or an empty array when every placeholder survives.
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
 * One key as the fallback has defined it so far in the merge.
 */
interface Defined {
  /**
   * The file that defined it last.
   */
  readonly file: Catalogue;

  /**
   * The string that file gave it.
   */
  readonly word: string;
}

/**
 * Builds the fallback's definition of one namespace, collecting faults as it merges.
 *
 * @remarks
 *   A package defines whatever keys it ships. Another package may override one, and the override is
 *   checked for placeholders. The application may override too, but may not add a key to a
 *   namespace a package owns, because a key nobody else defines is a typo. Which files are the
 *   application's own is the search's call, and a package under its own root has none: what it
 *   adds to a namespace is what it ships. One owner declaring a key in two files is a fault
 *   wherever it happens, because the merge would silently pick one.
 * @param files - The fallback files of the namespace, in merge order.
 * @param found - The array faults are pushed onto.
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
 * Validates every catalogue: the fallback's files against each other, then each translation against
 * the fallback.
 *
 * @param index - The indexed catalogues.
 * @param fallback - The language that defines every key.
 * @returns Every fault, the fallback's first, then in file order.
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
