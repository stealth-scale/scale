/**
 * Checks a value against the shape a type states, with combinators that each check one form of
 * value and record every fault under the value's dotted path.
 *
 * @remarks
 *   An object shape refuses a member it does not list, so a misspelt member of an untyped caller
 *   is a fault rather than a member every reader ignores.
 */

import { WORDS } from "#assemble.ts";
import { type ReferenceKind } from "#reference.ts";
import { type Report } from "#resolve/problem.ts";

/**
 * Checks one value, and records each fault under the value's path.
 */
export type Shape = (value: unknown, path: string, report: Report) => void;

/**
 * Lists the shape of each member an object states, by name.
 */
export type Members = Readonly<Record<string, Shape>>;

/**
 * Matches a date in the form `2026-12-31`.
 */
const DATE = /^\d{4}-\d{2}-\d{2}$/u;

/**
 * Returns true for a plain object: neither null, an array nor a function.
 *
 * @param value - Any value.
 */
export function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Returns true for an array.
 *
 * @param value - Any value.
 */
export function isList(value: unknown): value is readonly unknown[] {
  return Array.isArray(value);
}

/**
 * Builds a shape from a test and the reason a value that fails it is reported with.
 *
 * @param test - Returns true for a value of the shape.
 * @param reason - The reason of the fault.
 */
export function tested(test: (value: unknown) => boolean, reason: string): Shape {
  return (value, path, report) => {
    if (!test(value)) report.problem(path, reason);
  };
}

/**
 * Takes any value.
 */
export function anything(): void {}

/**
 * Takes a string.
 */
export const text = tested((value) => typeof value === "string", "must be a string");

/**
 * Takes a finite number.
 */
export const numeric = tested(
  (value) => typeof value === "number" && Number.isFinite(value),
  "must be a number",
);

/**
 * Takes a whole number of 1 or more.
 */
export const count = tested(
  (value) => typeof value === "number" && Number.isInteger(value) && value > 0,
  "must be a whole number of 1 or more",
);

/**
 * Takes true or false.
 */
export const binary = tested((value) => typeof value === "boolean", "must be a boolean");

/**
 * Takes a function.
 */
export const callable = tested((value) => typeof value === "function", "must be a function");

/**
 * Takes a date in the form `2026-12-31`.
 */
export const date = tested(
  (value) => typeof value === "string" && DATE.test(value),
  "must be a date in the form 2026-12-31",
);

/**
 * Joins words as a list in running text: `a`, `a or b`, `a, b or c`.
 *
 * @param words - The words, in order.
 */
export function either(words: readonly string[]): string {
  return words.length < 2 ? words.join("") : `${words.slice(0, -1).join(", ")} or ${words.at(-1)}`;
}

/**
 * Returns a word with its indefinite article: `a route`, `an extension`.
 *
 * @param word - A noun in the singular.
 */
export function article(word: string): string {
  return `${/^[aeiou]/u.test(word) ? "an" : "a"} ${word}`;
}

/**
 * Takes one of the values given, compared strictly.
 *
 * @param values - The values the shape takes.
 */
export function exactly(...values: ReadonlyArray<boolean | number | string>): Shape {
  return tested(
    (value) => values.some((one) => one === value),
    `must be ${either(values.map((value) => JSON.stringify(value)))}`,
  );
}

/**
 * Takes undefined, or a value of the shape given.
 *
 * @param shape - The shape of a value that is present.
 */
export function optional(shape: Shape): Shape {
  return (value, path, report) => {
    if (value !== undefined) shape(value, path, report);
  };
}

/**
 * Takes an array whose every item has the shape given.
 *
 * @param shape - The shape of each item.
 */
export function list(shape: Shape): Shape {
  return (value, path, report) => {
    if (!isList(value)) {
      report.problem(path, "must be a list");

      return;
    }

    for (const [index, item] of value.entries()) shape(item, `${path}.${String(index)}`, report);
  };
}

/**
 * Takes an object whose every member has the shape given, whatever its name.
 *
 * @param shape - The shape of each member.
 */
export function record(shape: Shape): Shape {
  return (value, path, report) => {
    if (!isRecord(value)) {
      report.problem(path, "must be an object");

      return;
    }

    for (const [name, member] of Object.entries(value)) shape(member, `${path}.${name}`, report);
  };
}

/**
 * Takes an object with the members given, each of its shape, and no other member.
 *
 * @param members - The shape of each member, by name.
 */
export function object(members: Members): Shape {
  return (value, path, report) => {
    if (!isRecord(value)) {
      report.problem(path, "must be an object");

      return;
    }

    for (const [name, shape] of Object.entries(members))
      shape(value[name], `${path}.${name}`, report);

    for (const [name, member] of Object.entries(value)) {
      if (member !== undefined && !Object.hasOwn(members, name)) {
        report.problem(`${path}.${name}`, "is not a member the type states");
      }
    }
  };
}

/**
 * Takes a reference to a name of one of the kinds given: an object with a qualified id and the
 * kind. Every other member is the declaring contract's, which its own shape checks.
 *
 * @param kinds - The kinds the reference may name.
 */
export function reference(...kinds: readonly ReferenceKind[]): Shape {
  return tested(
    (value) =>
      isRecord(value) &&
      typeof value["id"] === "string" &&
      value["id"].includes("/") &&
      kinds.some((kind) => kind === value["kind"]),
    `must be a reference to ${either(kinds.map((kind) => article(WORDS[kind])))}`,
  );
}
