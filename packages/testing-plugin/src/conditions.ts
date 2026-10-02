/**
 * Searches every context a condition reads for both of its values, and for the first context that
 * gives it one of them.
 *
 * @remarks
 *   An atom is one thing a condition reads: whether somebody is signed in, a permission, an
 *   entitlement, a boolean flag, a plugin, a matched route, an experiment, or a value of the slot's
 *   record. A boolean atom takes two values. An experiment takes each variant the condition names
 *   and one variant it names none of. A record's value takes each value the condition compares it
 *   with, a value it compares it with none of, and no value. A context is one value per atom. The
 *   search evaluates the contexts through `evaluateWhen` in mixed radix, from every boolean atom
 *   true and every other atom at its first value, up to 65,536.
 */

import { type ConditionContext, evaluateWhen, type When } from "@stealthscale/sdk-core";

/**
 * The most contexts one search evaluates.
 */
export const BOUND = 65_536;

/**
 * Describes what a search found: the number of contexts, and the values the condition took.
 */
export interface Sides {
  /**
   * The number of contexts the condition's atoms make.
   */
  readonly contexts: number;

  /**
   * True where some context makes the condition false. False where the search stopped at the bound.
   */
  readonly falseSide: boolean;

  /**
   * True where some context makes the condition true. False where the search stopped at the bound.
   */
  readonly trueSide: boolean;
}

/**
 * Describes the atoms a condition reads.
 */
interface Atoms {
  /**
   * The boolean atoms, by key: `authenticated`, `permission:<id>`, `entitlement:<id>`,
   * `flag:<id>`, `plugin:<id>` and `route:<id>`.
   */
  readonly booleans: Set<string>;

  /**
   * Each experiment's variants the condition names, by flag id.
   */
  readonly experiments: Map<string, Set<string>>;

  /**
   * Each value the condition compares a record's value with, by the value's path.
   */
  readonly fields: Map<string, Set<unknown>>;
}

/**
 * Lists the values each atom takes, by the atom's key, in search order.
 */
type Choices = ReadonlyArray<readonly [string, readonly unknown[]]>;

/**
 * A variant no condition names: the experiment serves another variant.
 */
export const OTHER_VARIANT = "\u0000other";

/**
 * A present value no condition compares a record's value with.
 */
const OTHER_VALUE = Symbol("other");

/**
 * The boolean atom each member names, in the order a condition lists the members.
 */
const BOOLEANS: ReadonlyArray<(when: When) => string | undefined> = [
  ({ authenticated }) => (authenticated === undefined ? undefined : "authenticated"),
  ({ entitlement }) => (entitlement === undefined ? undefined : `entitlement:${entitlement.id}`),
  ({ featureFlag }) => (featureFlag === undefined ? undefined : `flag:${featureFlag.id}`),
  ({ permission }) => (permission === undefined ? undefined : `permission:${permission.id}`),
  ({ plugin }) => (plugin === undefined ? undefined : `plugin:${plugin.pluginId}`),
  ({ route }) => (route === undefined ? undefined : `route:${route.id}`),
];

/**
 * Registers a key, and adds a value to the set kept under it where one is given.
 */
function added<K, V>(map: Map<K, Set<V>>, key: K, value?: V): void {
  const values = map.get(key) ?? new Set<V>();

  if (value !== undefined) values.add(value);

  map.set(key, values);
}

/**
 * Adds every atom a condition reads, through its nested conditions, to the atoms.
 */
function collect(when: When, atoms: Atoms): void {
  for (const atom of BOOLEANS.map((member) => member(when))) {
    if (atom !== undefined) atoms.booleans.add(atom);
  }

  if (when.variant !== undefined) added(atoms.experiments, when.variant.flag, when.variant.is);

  if (when.field !== undefined) added(atoms.fields, when.field.path, when.field.equals);

  const negated = when.not === undefined ? [] : [when.not];

  for (const nested of [...(when.allOf ?? []), ...(when.anyOf ?? []), ...negated]) {
    collect(nested, atoms);
  }
}

/**
 * Returns the values each atom of a condition takes: true then false per boolean atom, then each
 * experiment's and each value's choices.
 */
function choicesOf(when: When): Choices {
  const atoms: Atoms = { booleans: new Set(), experiments: new Map(), fields: new Map() };

  collect(when, atoms);

  return [
    ...[...atoms.booleans].map((key) => [key, [true, false]] as const),
    ...[...atoms.experiments].map(
      ([id, named]) => [`variant:${id}`, [...named, OTHER_VARIANT]] as const,
    ),
    ...[...atoms.fields].map(
      ([path, named]) => [`field:${path}`, [...named, OTHER_VALUE, undefined]] as const,
    ),
  ];
}

/**
 * Returns the condition context of one combination of the atoms' values.
 *
 * @param values - The value of each atom, by the atom's key.
 */
function contextOf(values: ReadonlyMap<string, unknown>): ConditionContext {
  /**
   * Returns true where a boolean atom is true in the combination.
   */
  const on = (key: string): boolean => values.get(key) === true;
  const matched = new Set(
    [...values].flatMap(([key, value]) =>
      key.startsWith("route:") && value === true ? [key.slice("route:".length)] : [],
    ),
  );

  return {
    authenticated: on("authenticated"),
    entitled: (id) => on(`entitlement:${id}`),
    field: (path) => values.get(`field:${path}`),
    flag: (id) => {
      const variant = values.get(`variant:${id}`);

      return typeof variant === "string" ? variant : on(`flag:${id}`);
    },
    matched,
    on: (id) => on(`plugin:${id}`),
    permitted: (id) => on(`permission:${id}`),
  };
}

/**
 * Returns the combination of the atoms' values a context index names, in mixed radix.
 */
function valuesAt(choices: Choices, index: number): ReadonlyMap<string, unknown> {
  const values = new Map<string, unknown>();
  let rest = index;

  for (const [key, options] of choices) {
    values.set(key, options[rest % options.length]);
    rest = Math.floor(rest / options.length);
  }

  return values;
}

/**
 * Returns the number of contexts the atoms' values make.
 */
function countOf(choices: Choices): number {
  return choices.reduce((product, [, options]) => product * options.length, 1);
}

/**
 * Returns the first context, in search order, in which a condition takes the value given.
 *
 * @param when - The condition.
 * @param value - The value the context gives the condition.
 * @returns The value of each atom by its key, such as `authenticated`, `permission:<id>` or
 *   `variant:<flag id>`. Undefined where no context gives the value, or where the atoms make more
 *   contexts than the bound.
 */
export function firstWhere(when: When, value: boolean): ReadonlyMap<string, unknown> | undefined {
  const choices = choicesOf(when);
  const contexts = countOf(choices);
  const indices = contexts > BOUND ? [] : Array.from({ length: contexts }, (_, index) => index);
  const found = indices.find(
    (index) => evaluateWhen(when, contextOf(valuesAt(choices, index))) === value,
  );

  return found === undefined ? undefined : valuesAt(choices, found);
}

/**
 * Evaluates a condition in the contexts its atoms make, up to the bound, and reports which values
 * it took.
 *
 * @param when - The condition.
 * @returns The number of contexts, and whether a context made the condition false or true.
 */
export function sidesOf(when: When): Sides {
  return {
    contexts: countOf(choicesOf(when)),
    falseSide: firstWhere(when, false) !== undefined,
    trueSide: firstWhere(when, true) !== undefined,
  };
}
