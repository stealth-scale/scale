/**
 * Builds the lint overrides a repository adds on top of a preset.
 *
 * @remarks
 *   Every factory here takes a `because` string and none has an overload
 *   without one. Each returns a contribution appended to the block's override
 *   list, so two packages covering the same glob both keep their entry rather
 *   than one replacing the other.
 */

import { type UserConfig } from "vite";

import { contribute, type Contribution, named } from "@stealthscale/vite-config-core";

import { docblocksOff } from "#lint/rules/docblock.ts";
import { SPEC_SIZE } from "#lint/rules/size.ts";
import { SPEC } from "#lint/rules/spec.ts";

/**
 * The `lint` block of a Vite config with its optional wrapper removed.
 */
type LintBlock = NonNullable<UserConfig["lint"]>;

/**
 * One entry of a lint block's override list.
 */
export type LintOverride = NonNullable<LintBlock["overrides"]>[number];

/**
 * The path in the config that every override here is appended to.
 */
const AT = "lint.overrides";

/**
 * A refusal to import one set of packages from one set of files.
 *
 * @remarks
 *   The reason is written in two places. The layer records it, where it
 *   explains why the override exists. The linter prints it, where an author
 *   whose import breaks the rule reads it without opening the config.
 */
export interface Forbidden {
  /**
   * Why the import is refused.
   */
  because: string;

  /**
   * Packages matched by `packages` that the files may still import.
   */
  except?: readonly string[] | undefined;

  /**
   * The globs the refusal covers.
   */
  files: readonly string[];

  /**
   * The package name patterns those files may not import.
   */
  packages: readonly string[];
}

/**
 * A change to the rules one set of files is held to.
 *
 * @remarks
 *   Both the globs and the rules are copied into the override, so a caller may
 *   reuse or mutate the object it passed. Nothing checks that a rule name
 *   exists, since a plugin's names are in no map the linter publishes.
 */
export interface Ruled {
  /**
   * Why these files are not held to what the rest of the package is.
   */
  because: string;

  /**
   * The globs the change covers.
   */
  files: readonly string[];

  /**
   * Each rule name, with the severity and options to apply to it.
   */
  rules: Readonly<Record<string, unknown>>;
}

/**
 * Refuses a set of packages to the files that match a set of globs.
 *
 * @remarks
 *   A name in `except` becomes a negated pattern in the same group, so it only
 *   has an effect where one of the patterns in `packages` already matched it.
 *   A name that no pattern matches has no effect.
 */
export function forbid(stated: Forbidden): Contribution {
  const group = [...stated.packages, ...(stated.except ?? []).map((name) => `!${name}`)];

  return contribute({
    at: AT,
    because: stated.because,
    item: {
      files: [...stated.files],
      rules: {
        "no-restricted-imports": ["error", { patterns: [{ group, message: stated.because }] }],
      },
    },
    name: `lint.forbid(${stated.files.join(", ")})`,
  });
}

/**
 * Wraps a rule change as a contribution under the name the caller picked.
 *
 * @remarks
 *   The name ends in the globs the override covers, which is what a repository
 *   targets to remove one layer out of a preset. Two overrides covering
 *   different globs are therefore never confused for each other.
 */
function changing(stated: Ruled, name: string): Contribution {
  return contribute({
    at: AT,
    because: stated.because,
    item: { files: [...stated.files], rules: { ...stated.rules } },
    name: `${name}(${stated.files.join(", ")})`,
  });
}

/**
 * Loosens the rules a set of files is held to.
 *
 * @remarks
 *   The layer is named `lint.relax(...)`, and {@link enforce} builds the same
 *   shape under the opposite name. Only the name separates them, and the name
 *   is what a repository removes a layer by.
 */
export function relax(stated: Ruled): Contribution {
  return changing(stated, "lint.relax");
}

/**
 * Tightens the rules a set of files is held to.
 *
 * @remarks
 *   The layer is named `lint.enforce(...)`. See {@link relax} for the same
 *   shape under the name used when rules come off instead of on.
 */
export function enforce(stated: Ruled): Contribution {
  return changing(stated, "lint.enforce");
}

/**
 * Excuses the files a tool reads through their default export.
 *
 * @remarks
 *   A config file and a story file each have one export and nowhere else to put
 *   it. Only `no-default-export` is turned off, and every other rule still
 *   applies to them.
 */
export function defaultExported(files: readonly string[]): Contribution {
  return named(
    `lint.defaultExported(${files.join(", ")})`,
    relax({
      because: "read by its default export, so it has nowhere else to put one",
      files,
      rules: { "no-default-export": "off" },
    }),
  );
}

/**
 * Excuses a specification from doc comments and cast safety, and applies a specification's size
 * limits to it in place of a source file's.
 *
 * @remarks
 *   A case title already states what the case checks, and a doc comment above
 *   it would say the same thing again. The cast rule comes off beside them
 *   because a specification narrows the config value it has read back. The
 *   size limits are the ones {@link SPEC_SIZE} states.
 */
export function undocumented(files: readonly string[]): Contribution {
  return named(
    `lint.undocumented(${files.join(", ")})`,
    relax({
      because:
        "a specification is documented by its own test names, and narrows what it reads back",
      files,
      rules: {
        ...docblocksOff(),
        ...SPEC_SIZE,
        "typescript/no-unsafe-type-assertion": "off",
      },
    }),
  );
}

/**
 * Applies the house grammar to the case titles of a specification.
 *
 * @remarks
 *   These titles contain the documentation that {@link undocumented} removes
 *   from the same files. Apply both to the same globs, or a specification ends
 *   up with neither a doc comment nor a checked title.
 */
export function specified(files: readonly string[]): Contribution {
  return named(
    `lint.specified(${files.join(", ")})`,
    enforce({
      because:
        "a specification documents itself by its case names, so the names are held to a grammar",
      files,
      rules: SPEC,
    }),
  );
}

/**
 * Excuses a barrel from the cap on dependencies.
 *
 * @remarks
 *   A barrel names every module its directory publishes and nothing else, so
 *   its dependency count is the size of the directory rather than a sign that
 *   one module does too much. Only `import/max-dependencies` is turned off,
 *   and every other rule still applies to it.
 */
export function barrelled(files: readonly string[]): Contribution {
  return named(
    `lint.barrelled(${files.join(", ")})`,
    relax({
      because:
        "a barrel names every module its directory publishes, so its dependency count is the size of the directory",
      files,
      rules: { "import/max-dependencies": "off" },
    }),
  );
}

/**
 * Excuses a preset from the cap on dependencies.
 *
 * @remarks
 *   A preset registers every recipe its package publishes, so its dependency
 *   count is the number of recipes rather than a sign that one module does too
 *   much. Only `import/max-dependencies` is turned off, and every other rule
 *   still applies to it.
 */
export function registered(files: readonly string[]): Contribution {
  return named(
    `lint.registered(${files.join(", ")})`,
    relax({
      because:
        "a preset registers every recipe its package publishes, so its dependency count is the number of recipes",
      files,
      rules: { "import/max-dependencies": "off" },
    }),
  );
}

/**
 * Excuses a fixture from the cap on dependencies.
 *
 * @remarks
 *   A fixture builds the component its specifications measure, so it imports
 *   every part that component is composed of. Its dependency count is the size
 *   of the component rather than a sign that one module does too much, and a
 *   fixture held to the cap pushes the composition back into the specifications
 *   that were meant to share it. Only `import/max-dependencies` is turned off,
 *   and every other rule still applies to it.
 */
export function composed(files: readonly string[]): Contribution {
  return named(
    `lint.composed(${files.join(", ")})`,
    relax({
      because:
        "a fixture imports every part of the component it builds, so its dependency count is the size of the component",
      files,
      rules: { "import/max-dependencies": "off" },
    }),
  );
}
