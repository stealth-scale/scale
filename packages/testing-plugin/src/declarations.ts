/**
 * Derives the cases of each route, extension and command: the module its code imports, and the
 * condition it states.
 */

import { type PluginCode, type When } from "@stealthscale/sdk-core";

import { type Check } from "#check.ts";
import { BOUND, sidesOf } from "#conditions.ts";
import { checking } from "#resolution.ts";
import { type Subject } from "#subject.ts";

/**
 * Lists the kinds of declaration whose code a case imports.
 */
type Kind = "command" | "extension" | "route";

/**
 * Describes one declaration a case checks.
 */
interface Declared {
  /**
   * Qualified id of the declaration.
   */
  readonly id: string;

  /**
   * Imports the declaration's module. Absent where the manifest maps no code to it.
   */
  readonly importer?: (() => Promise<Readonly<Record<string, unknown>>>) | undefined;

  /**
   * The kind of the declaration.
   */
  readonly kind: Kind;

  /**
   * The condition the contract states.
   */
  readonly when?: undefined | When;
}

/**
 * Describes the words a kind's cases state.
 */
interface Wording {
  /**
   * The kind of value the declaration's module exports.
   */
  readonly exports: string;

  /**
   * The consequence of a condition that is false in every context.
   */
  readonly never: string;
}

/**
 * Lists each kind's words.
 */
const WORDS: Readonly<Record<Kind, Wording>> = {
  command: { exports: "function", never: "never runs" },
  extension: { exports: "component", never: "never shows" },
  route: { exports: "component", never: "is never routed" },
};

/**
 * Returns the importer of a route's page, whether the code states the page alone or an entry.
 */
function pageOf(code: NonNullable<PluginCode["routes"]>[string] | undefined): Declared["importer"] {
  return typeof code === "function" ? code : code?.component;
}

/**
 * Returns every route, extension and command the contract declares, with its code and condition.
 */
function declaredOf({ contract, manifest }: Subject): readonly Declared[] {
  const { commands = {}, extensions = {}, routes = {} } = manifest.code;

  return [
    ...Object.entries(contract.routes).map(([name, { id, when }]) => ({
      id,
      importer: pageOf(routes[name]),
      kind: "route" as const,
      when,
    })),
    ...Object.entries(contract.extensions).map(([name, { id, when }]) => ({
      id,
      importer: extensions[name]?.component,
      kind: "extension" as const,
      when,
    })),
    ...Object.entries(contract.commands).map(([name, { id, when }]) => ({
      id,
      importer: commands[name]?.run,
      kind: "command" as const,
      when,
    })),
  ];
}

/**
 * Returns the case that fails where a declaration's module exports no function or more than one.
 */
function importCase({ id, importer, kind }: Declared): Check {
  const { exports } = WORDS[kind];

  return {
    name: `${kind} ${id} imports one ${exports}`,
    run: async () => {
      if (importer === undefined) throw new Error(`${kind} ${id} has no code in the manifest.`);

      const found = Object.values(await importer()).filter((value) => typeof value === "function");

      if (found.length !== 1) {
        throw new Error(
          `${kind} ${id} imports a module that exports ${String(found.length)} functions, and the host takes one.`,
        );
      }
    },
  };
}

/**
 * Returns the case that fails where a condition is true in every context or false in every one, or
 * makes more contexts than the search evaluates.
 */
function conditionCase({ id, kind }: Declared, when: When): Check {
  return {
    name: `${kind} ${id}'s condition is not constant`,
    run: () =>
      checking(() => {
        const { contexts, falseSide, trueSide } = sidesOf(when);
        const named = `${kind} ${id} has a condition`;

        if (contexts > BOUND) {
          throw new Error(
            `${named} of ${String(contexts)} contexts, and the search stops at 65,536.`,
          );
        }

        if (!trueSide) {
          throw new Error(`${named} that is false in every context, so it ${WORDS[kind].never}.`);
        }

        if (!falseSide) {
          throw new Error(`${named} that is true in every context, so it gates nothing.`);
        }
      }),
  };
}

/**
 * Returns the cases of every route, extension and command: its import, and its condition where it
 * states one.
 */
export function declarationCases(subject: Subject): readonly Check[] {
  return declaredOf(subject).flatMap((declared) =>
    declared.when === undefined
      ? [importCase(declared)]
      : [importCase(declared), conditionCase(declared, declared.when)],
  );
}
