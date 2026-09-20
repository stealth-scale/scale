/**
 * Parses a specimen file and extracts the metadata its default export declares.
 *
 * @remarks
 *   The metadata is string literals, which the source text holds. The scenes are components, which
 *   it does not, and which are the reason the index exists: a navigation rail lists every page
 *   without evaluating any of their modules.
 */

import { type ESTree, parseSync } from "vite";

import { type Read, type Refused, type Source } from "#contract.ts";

/**
 * Returns true when the result carries a reason instead of a page, and narrows it accordingly.
 */
export function isRefused(result: Read): result is Refused {
  return "wrong" in result;
}

/**
 * Returns the single object literal a call expression takes, and undefined for any other argument
 * list.
 *
 * @remarks
 *   `satisfies` and `as` are unwrapped. Both annotate the object without changing it, and a
 *   specimen is commonly written with one.
 */
function argumentOf(call: ESTree.CallExpression): ESTree.ObjectExpression | undefined {
  let argument = call.arguments[0];

  while (argument?.type === "TSSatisfiesExpression" || argument?.type === "TSAsExpression") {
    argument = argument.expression;
  }

  return argument?.type === "ObjectExpression" && call.arguments.length === 1
    ? argument
    : undefined;
}

/**
 * Returns the object literal a program's default export is called with, or the reason it has none.
 *
 * @remarks
 *   Neither the callee's name nor the module it was imported from is checked. The two conditions
 *   below reject everything the index cannot use, and requiring a name would mean configuring the
 *   plugin with the one to expect.
 */
export function declaredIn(program: ESTree.Program): ESTree.ObjectExpression | string {
  const exported = program.body.find((node) => node.type === "ExportDefaultDeclaration");

  if (exported === undefined) return "states no default export";
  if (exported.declaration.type !== "CallExpression") {
    return "states a default export that is not a call";
  }

  return argumentOf(exported.declaration) ?? "calls with something other than one object";
}

/**
 * Parses a file and returns the object literal its default export is called with, or the reason it
 * has none.
 *
 * @remarks
 *   The path selects the parser's dialect, so a `.ts` specimen is not parsed as JSX.
 */
function declaredAt(path: string, text: string): ESTree.ObjectExpression | string {
  const parsed = parseSync(path, text);

  if (parsed.errors.length > 0) {
    return `could not be parsed: ${parsed.errors.map((error) => error.message).join("; ")}`;
  }

  return declaredIn(parsed.program);
}

/**
 * Returns the name a property is declared under, and undefined when the key is computed.
 */
function keyOf(property: ESTree.ObjectProperty): string | undefined {
  const { computed, key } = property;

  if (key.type === "Identifier" && !computed) return key.name;
  if (key.type === "Literal" && typeof key.value === "string") return key.value;

  return undefined;
}

/**
 * Returns every string literal an object declares, keyed by the property name.
 *
 * @remarks
 *   A property holding anything but a string literal is omitted rather than evaluated. An absent
 *   `id` and a computed one therefore produce the same result.
 */
export function stated(object: ESTree.ObjectExpression): Record<string, string> {
  const fields: Record<string, string> = {};

  for (const property of object.properties) {
    if (property.type !== "Property") continue;

    const key = keyOf(property);

    if (key !== undefined && property.value.type === "Literal") {
      const { value } = property.value;

      if (typeof value === "string") fields[key] = value;
    }
  }

  return fields;
}

/**
 * Converts the last segment of an identifier into a display title.
 *
 * @returns The segment with hyphens replaced by spaces and the first letter capitalised.
 */
export function headingOf(segment: string): string {
  const words = segment.replaceAll("-", " ");

  return words.slice(0, 1).toUpperCase() + words.slice(1);
}

/**
 * Reads one file into the page it declares, or the reason it declares none.
 */
function entryOf(file: Source): Read {
  const object = declaredAt(file.path, file.text);

  if (typeof object === "string") return { path: file.path, wrong: object };

  const fields = stated(object);
  const id = fields["id"];

  if (id === undefined) {
    return { path: file.path, wrong: "states no id the source holds as a literal" };
  }

  return {
    about: fields["about"] ?? "",
    group: fields["group"] ?? "",
    id,
    namespace: fields["namespace"] ?? "",
    path: file.path,
    title: fields["title"] ?? headingOf(id.slice(id.lastIndexOf("/") + 1)),
  };
}

/**
 * Reads every specimen file into the page it declares or the reason it declares none.
 *
 * @remarks
 *   Reading continues past a file it rejects, so a build reports every bad file in one run. Two
 *   files declaring one identifier are rejected the same way: the second is refused and names the
 *   first, because the second would otherwise be unreachable with nothing to say so.
 * @returns One result per file, in the order the files were given.
 */
export function read(files: readonly Source[]): readonly Read[] {
  const owners = new Map<string, string>();

  return files.map((file) => {
    const result = entryOf(file);

    if (isRefused(result)) return result;

    const owner = owners.get(result.id);

    if (owner !== undefined) {
      return { path: file.path, wrong: `states the id ${result.id}, which ${owner} states too` };
    }

    owners.set(result.id, file.path);

    return result;
  });
}
