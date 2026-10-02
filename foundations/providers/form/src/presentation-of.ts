/**
 * Reads how a form is rendered out of a schema's own keywords, merges what a caller states beside
 * it, checks every member against the paths the schema can produce, and reads the members and
 * steps back out of a presentation.
 */

import {
  type Field,
  type FieldWidth,
  type Group,
  isGroup,
  type Member,
  type Presentation,
  type Step,
  WIDTHS,
} from "#presentation.ts";
import { type Schema } from "#schema.ts";
import { isSchema, walk } from "#walk.ts";

/**
 * The keyword at the root that contains the form's identifier, members and steps.
 */
export const FORM = "x-form";

/**
 * Maps each per-field keyword to the member of a field it reads into.
 */
export const KEYWORDS = {
  autocomplete: "x-autocomplete",
  control: "x-control",
  description: "x-description",
  label: "x-label",
  options: "x-options",
  placeholder: "x-placeholder",
  span: "x-span",
  width: "x-width",
} as const;

/**
 * The identifier a form has where neither the schema nor the caller states one.
 */
export const UNNAMED = "form";

/**
 * Describes the members and the steps of a presentation, whichever source stated them.
 *
 * @typeParam Values - The form's values, or `unknown` for a form without a type.
 */
type Layout<Values> = Pick<Presentation<Values>, "of" | "steps">;

/**
 * Reports whether a keyword's value names one of the widths a control takes.
 */
function isWidth(value: unknown): value is FieldWidth {
  return WIDTHS.some((width) => width === value);
}

/**
 * Reads the settings of one field out of a property's keywords.
 *
 * @returns The field, or nothing where the property writes none of the keywords.
 */
function fieldOf(node: Schema): Field | undefined {
  const autocomplete = node[KEYWORDS.autocomplete];
  const control = node[KEYWORDS.control];
  const description = node[KEYWORDS.description];
  const label = node[KEYWORDS.label];
  const options = node[KEYWORDS.options];
  const placeholder = node[KEYWORDS.placeholder];
  const span = node[KEYWORDS.span];
  const width = node[KEYWORDS.width];
  const field: Field = {
    ...(typeof autocomplete === "string" && { autocomplete }),
    ...(typeof control === "string" && { control }),
    ...(typeof description === "string" && { description }),
    ...(typeof label === "string" && { label }),
    ...(isSchema(options) && { options }),
    ...(typeof placeholder === "string" && { placeholder }),
    ...(typeof span === "number" && { span }),
    ...(isWidth(width) && { width }),
  };

  return Object.keys(field).length === 0 ? undefined : field;
}

/**
 * Reads the settings of every field the schema's properties write, by path.
 */
function fieldsOf(schema: Schema): Record<string, Field> {
  const fields: Record<string, Field> = {};

  walk(schema, (path, node) => {
    const field = fieldOf(node);

    if (field !== undefined) fields[path] ??= field;
  });

  return fields;
}

/**
 * Reads the members and the steps the root's `x-form` keyword states, as data.
 *
 * @remarks
 *   The keyword arrives as JSON, so its members are strings and groups, which is what
 *   `Presentation<unknown>` admits. Nothing here checks them against the schema. The check is
 *   {@link validatePresentation}, run once the two sources are merged.
 */
function rootOf(schema: Schema): Partial<Presentation> {
  const root = schema[FORM];

  if (!isSchema(root)) return {};

  const { id, of, steps } = root;
  const stepped = isSchema(steps) && Array.isArray(steps["of"]);
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a manifest's members are strings and groups, which is the untyped presentation, and validatePresentation checks each one against the schema
  const listed = Array.isArray(of) ? (of as readonly Member[]) : undefined;
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the same, for the steps
  const walked = stepped ? (steps as unknown as Presentation["steps"]) : undefined;

  return {
    ...(typeof id === "string" && { id }),
    ...(listed !== undefined && { of: listed }),
    ...(walked !== undefined && { steps: walked }),
  };
}

/**
 * Picks the members and the steps the caller states, and the schema's where the caller states
 * none.
 *
 * @typeParam Values - The form's values, or `unknown` for a form without a type.
 */
function layoutOf<Values>(
  given: Presentation<Values> | undefined,
  root: Partial<Presentation>,
): Layout<Values> {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the schema's members are untyped strings and groups, admitted where the caller's presentation is typed because validatePresentation checks each one against the schema
  const of = (given?.of ?? root.of) as ReadonlyArray<Member<Values>> | undefined;
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the same, for the steps
  const steps = (given?.steps ?? root.steps) as Presentation<Values>["steps"];

  return {
    ...(of !== undefined && { of }),
    ...(steps !== undefined && { steps }),
  };
}

/**
 * Reads how a form is rendered: the schema's own keywords, with whatever the caller states beside
 * it taking precedence per field.
 *
 * @remarks
 *   A field stated at the call site replaces the schema's settings for that field as a whole. The
 *   members and the steps come from the call site where it states them and from the schema
 *   otherwise. The identifier is `form` where neither states one.
 * @typeParam Values - The form's values, or `unknown` for a form without a type.
 */
export function presentationOf<Values>(
  schema: Schema,
  given?: Presentation<Values>,
): Presentation<Values> {
  const root = rootOf(schema);
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the schema's fields are keyed by the paths it has, which is what the caller's typed presentation keys by
  const fields = { ...fieldsOf(schema), ...given?.fields } as Presentation<Values>["fields"];

  return {
    fields,
    id: given?.id ?? root.id ?? UNNAMED,
    ...layoutOf(given, root),
  };
}

/**
 * Lists every path a run of members names, groups walked.
 *
 * @typeParam Values - The form's values, or `unknown` for a form without a type.
 */
export function memberPaths<Values>(run: ReadonlyArray<Member<Values>>): readonly string[] {
  return run.flatMap((member) => (isGroup(member) ? memberPaths(member.of) : [member]));
}

/**
 * Lists every path the members name, groups and steps walked.
 *
 * @typeParam Values - The form's values, or `unknown` for a form without a type.
 */
export function members<Values>(presentation: Presentation<Values>): readonly string[] {
  return [
    ...memberPaths(presentation.of ?? []),
    ...(presentation.steps?.of ?? []).flatMap((step) => memberPaths(step.of)),
  ];
}

/**
 * Keys a member for React: a path by itself, and a group by its name or by the members it contains.
 *
 * @typeParam Values - The form's values, or `unknown` for a form without a type.
 */
export function memberKey<Values>(member: Member<Values>): string {
  if (!isGroup(member)) return member;

  return member.name ?? JSON.stringify(member.of);
}

/**
 * Reads one step of a presentation by its name.
 *
 * @typeParam Values - The form's values, or `unknown` for a form without a type.
 * @throws {@link Error} When the presentation has no step of that name.
 */
export function stepOf<Values>(presentation: Presentation<Values>, name: string): Step<Values> {
  const step = presentation.steps?.of.find((candidate) => candidate.name === name);

  if (step === undefined) {
    throw new Error(`The presentation "${presentation.id}" has no step "${name}"`);
  }

  return step;
}

/**
 * Lists every array path a repeat group names.
 */
function repeats<Values>(run: ReadonlyArray<Member<Values> | Step<Values>>): readonly string[] {
  return run.flatMap((member) => {
    if (typeof member === "string") return [];

    const own: Group<Values> | Step<Values> = member;
    const below = repeats(own.of);

    return "repeat" in own && own.repeat !== undefined ? [own.repeat, ...below] : below;
  });
}

/**
 * Checks a presentation against the paths the schema can produce, and refuses what no branch of
 * the schema has.
 *
 * @remarks
 *   A member the schema cannot produce is a typo, and a typo that rendered nothing in silence would
 *   be the mistake the data design refuses in `rowsAt`. A member absent from the resolved schema
 *   and present in the full one is a field this branch does not ask for, which `Fields` skips and
 *   this never sees. The paths are those of every property any branch can produce, from the
 *   engine.
 * @throws {@link Error} When `of` and `steps` are both present, or when a member, a field
 *   setting or a repeat names a path no branch of the schema has.
 */
export function validatePresentation<Values>(
  presentation: Presentation<Values>,
  paths: readonly string[],
): void {
  if (presentation.of !== undefined && presentation.steps !== undefined) {
    throw new Error(
      `The presentation "${presentation.id}" states both of and steps, which is two lists of members`,
    );
  }

  const known = new Set(paths);
  const named = [
    ...members(presentation),
    ...Object.keys(presentation.fields ?? {}),
    ...repeats(presentation.of ?? []),
    ...repeats(presentation.steps?.of ?? []),
  ];

  for (const path of named) {
    if (!known.has(path)) {
      throw new Error(
        `The presentation "${presentation.id}" names "${path}", which no branch of the schema has`,
      );
    }
  }
}

/**
 * Reports whether a path is a field rather than an object or an array of fields.
 */
function isLeaf(path: string, paths: readonly string[]): boolean {
  return !paths.some((other) => other.startsWith(`${path}.`) || other.startsWith(`${path}[]`));
}

/**
 * Lists the paths a form renders where its presentation states no members: every field outside an
 * array, in schema order.
 *
 * @remarks
 *   An array's items are left out, because a repeat group renders them and a presentation states
 *   one.
 */
export function leafPaths(paths: readonly string[]): readonly string[] {
  return paths.filter((path) => !path.includes("[]") && isLeaf(path, paths));
}

/**
 * Lists the fields the schema states and no member names, which a form leaves out on purpose or
 * by accident.
 *
 * @remarks
 *   An empty list where the presentation states no members, because then every field renders.
 *   The paths are those of every property any branch can produce, from the engine.
 */
export function unplaced<Values>(
  presentation: Presentation<Values>,
  paths: readonly string[],
): readonly string[] {
  if (presentation.of === undefined && presentation.steps === undefined) return [];

  const placed = new Set(members(presentation));

  return paths.filter((path) => isLeaf(path, paths) && !placed.has(path));
}
