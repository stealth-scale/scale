/**
 * Collects the named types a prop refers to, so a table shows what is in them rather than their
 * names.
 *
 * @remarks
 *   A change handler takes a details object, and its name tells a reader nothing. Every variant is
 *   worse: `size` prints as `Scale`, so the eight steps it accepts are only reachable by expanding
 *   the union behind the name. These are gathered once, by name, and a table links a prop's type to
 *   the shape rather than repeating it on every row.
 */

import { type Settled } from "#anatomy/reading.ts";
import { worthListing } from "#anatomy/reading.ts";
import {
  type Checker,
  type Symbol as Named,
  type Program,
  type Type,
  type UnionType,
} from "#anatomy/types.ts";
import { type Member } from "#contract.ts";

/**
 * Matches the last package a path names, scoped or not.
 *
 * @remarks
 *   The last rather than the first, because a package manager nests them: pnpm keeps its store at
 *   `node_modules/.pnpm/<package>/node_modules/<package>`, so reading the first returns `.pnpm` for
 *   everything and every type of one name collides into it.
 */
const INSTALLED = /node_modules\/(?<named>(?:@[^/]+\/)?[^/]+)(?!.*node_modules)/u;

/**
 * The prefix of the name the compiler gives a class's ES private member, as in `__#30@#secret`.
 *
 * @remarks
 *   A caller cannot reach a private member, and the number in the name is a counter that changes
 *   with the order the compiler binds files in.
 */
const PRIVATE = "__#";

/**
 * Describes the compiler enumerations the walk reads, which exist only once it has loaded.
 */
export interface Enumerated {
  /**
   * The flag of a symbol that is an alias of another, as a re-export is.
   */
  alias: number;

  /**
   * The kind of signature a call is.
   */
  call: number;

  /**
   * The flag of a property a caller may leave out.
   */
  optional: number;

  /**
   * The flags of a symbol that is a value rather than a type alone.
   */
  value: number;
}

/**
 * Describes the state of one walk through a page's types.
 */
export interface Walk {
  /**
   * The project's checker.
   */
  checker: Checker;

  /**
   * The compiler's enumerations.
   */
  enumerated: Enumerated;

  /**
   * The named types the current prop referred to.
   */
  found: Set<string>;

  /**
   * Where the collected shapes are gathered.
   */
  into: Record<string, Member[]>;

  /**
   * The project's program, which reports whether a declaration is the compiler's own.
   */
  program: Program;

  /**
   * The reading the walk follows, with every default filled in.
   */
  stated: Settled;
}

/**
 * Returns the package a declaration belongs to, which keeps two types of one name apart.
 *
 * @returns The installed package's name without its scope, and `kit` for a file in the workspace.
 */
export function declaringPackage(file: string): string {
  const named = INSTALLED.exec(file)?.groups?.["named"];

  if (named === undefined) return "kit";

  return named.startsWith("@") ? named.slice(named.indexOf("/") + 1) : named;
}

/**
 * Returns the opening paragraph of a doc comment on one line.
 *
 * @remarks
 *   A paragraph rather than a line, because a doc comment is wrapped at the margin and its first
 *   line ends wherever the wrapping fell.
 */
export function opening(said: string): string {
  const at = said.indexOf("\n\n");

  return (at === -1 ? said : said.slice(0, at)).replaceAll("\n", " ");
}

/**
 * Returns a type as a table prints it, without the `undefined` of an optional prop, which the
 * prop's `required` flag shows.
 */
export function printed(checker: Checker, type: Type): string {
  return checker.typeToString(type).replaceAll(" | undefined", "");
}

/**
 * Returns a value the compiler's API types as optional and, in practice, always returns.
 *
 * @remarks
 *   Every property has a type and every union has a non-nullable form. Read through this, a missing
 *   one fails the read naming what was missing, rather than being papered over with an empty table.
 *   `what` names the thing asked for and opens the error.
 * @throws {@link Error} When the compiler returned nothing.
 */
export function sure<Answer>(answer: Answer | undefined, what: string): Answer {
  if (answer === undefined) throw new Error(`specimen: the compiler returned nothing for ${what}`);

  return answer;
}

/**
 * Returns the key a collected type is gathered under.
 *
 * @remarks
 *   A type declared in one of the compiler's default libraries gets no key. `ReadonlyArray` is
 *   behind every `readonly Entry[]` and tells a reader nothing. The program reports whether a file
 *   is a default library, so no path is matched.
 * @returns The package and the name, or undefined where the type is anonymous or the compiler's.
 */
export function keyOf(walk: Walk, type: Type): string | undefined {
  const symbol = type.getAliasSymbol() ?? type.getSymbol();
  const name = symbol?.name;
  const declared = symbol?.declarations[0]?.path;

  if (name === undefined || name.startsWith("__") || declared === undefined) return undefined;
  if (walk.program.getSourceFileMetadata(declared)?.isDefaultLibrary === true) return undefined;

  return `${declaringPackage(declared)}.${name}`;
}

/**
 * Reads one member of a collected type, and walks whatever it refers to in turn.
 */
function memberOf(member: Named, walk: Walk, depth: number): Member {
  const held = sure(walk.checker.getTypeOfSymbol(member), `the type of ${member.name}`);

  shapesIn(held, walk, depth + 1);

  return {
    accepts: printed(walk.checker, held),
    name: member.name,
    says: opening(walk.checker.getDocumentationCommentOfSymbol(member)),
  };
}

/**
 * Records a union written under a name as a shape whose members are its options.
 *
 * @remarks
 *   `Scale` is recorded as its eight steps, so the name in a table opens on what may be passed. An
 *   option has no type of its own, which tells the catalogue to list the options rather than
 *   tabulate them.
 */
function optionsOf(type: UnionType, walk: Walk): void {
  const key = keyOf(walk, type);

  if (key === undefined) return;

  walk.found.add(key);
  walk.into[key] ??= type
    .getTypes()
    .map((option) => ({ accepts: "", name: printed(walk.checker, option), says: "" }));
}

/**
 * Walks a union: the one under a name is recorded as its options, and every member is walked.
 *
 * @remarks
 *   A prop a caller may leave out is typed `Scale | undefined`, one union flattened into another,
 *   so the name is only found again once the `undefined` is taken off.
 */
function unionIn(type: UnionType, walk: Walk, depth: number): void {
  const held = sure(walk.checker.getNonNullableType(type), "the union without undefined");

  if (!held.isUnionType()) {
    shapesIn(held, walk, depth);

    return;
  }

  optionsOf(held, walk);

  for (const member of held.getTypes()) shapesIn(member, walk, depth);
}

/**
 * Walks what a handler is called with, its shape being in its parameter rather than in itself.
 *
 * @remarks
 *   A literal and an intrinsic type have no call signature, so the walk asks the compiler about
 *   neither. The walk visits every option of every union, and each question is a round trip to the
 *   compiler's process.
 */
function parametersIn(type: Type, walk: Walk, depth: number): void {
  if (type.isLiteralType() || type.isIntrinsicType()) return;

  for (const signature of walk.checker.getSignaturesOfType(type, walk.enumerated.call)) {
    for (const parameter of signature.getParameters()) {
      const held = sure(walk.checker.getTypeOfSymbol(parameter), `the type of ${parameter.name}`);

      shapesIn(held, walk, depth + 1);
    }
  }
}

/**
 * Walks what a type is made of: `readonly Crumb[]` refers to an array of `Crumb`, and `Crumb` is
 * the shape worth showing.
 */
function argumentsIn(type: Type, walk: Walk, depth: number): void {
  const held = type.isTypeReference() ? walk.checker.getTypeArguments(type) : [];

  for (const argument of [...held, ...type.getAliasTypeArguments()]) {
    shapesIn(argument, walk, depth + 1);
  }
}

/**
 * Collects the named types a prop refers to.
 *
 * @remarks
 *   `depth` counts how far the walk has gone, because a type can refer to itself. A type is
 *   claimed in the collection before its members are read, for the same reason. A class's private
 *   members are left out of its shape.
 */
export function shapesIn(type: Type, walk: Walk, depth: number): void {
  if (depth > walk.stated.depth) return;

  if (type.isUnionType()) {
    unionIn(type, walk, depth);

    return;
  }

  if (type.isIntersectionType()) {
    for (const member of type.getTypes()) shapesIn(member, walk, depth);

    return;
  }

  parametersIn(type, walk, depth);
  argumentsIn(type, walk, depth);

  const key = keyOf(walk, type);

  if (key === undefined || key in walk.into) {
    if (key !== undefined) walk.found.add(key);

    return;
  }

  walk.found.add(key);

  const members = walk.checker
    .getPropertiesOfType(type)
    .filter((member) => !member.name.startsWith(PRIVATE));

  if (!worthListing(members.length, walk.stated.members)) return;

  walk.into[key] = [];
  walk.into[key] = members.map((member) => memberOf(member, walk, depth));
}
