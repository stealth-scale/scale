/**
 * Lints the two packages of a plugin: the contract package, which loads in Node, and the web
 * package, whose manifest entry loads in Node and whose components read the host through
 * `sdk-plugin`.
 *
 * @remarks
 *   Each layer refuses imports through `no-restricted-imports`. An override replaces the options a
 *   rule has for its files, so each override states the house's refusal of the toolchain package
 *   beside its own. The rule refuses a dynamic `import()` too, except where a pattern names the
 *   imported bindings, which a dynamic import has none of (measured on oxlint 1.85.0).
 */

import { contribute, type Contribution, type Layer } from "@stealthscale/vite-config";

/**
 * Lists the options of the contract package's lint layer.
 */
export interface ContractLinting {
  /**
   * The Standard Schema libraries a contract may import. `arktype`, `valibot` and `zod` where left
   * out.
   */
  readonly schemas?: readonly string[] | undefined;
}

/**
 * Lists the options of the web package's lint layer.
 */
export interface WebLinting {
  /**
   * Path of the manifest entry from the package's root. `src/manifest.ts` where left out.
   */
  readonly manifest?: string | undefined;
}

/**
 * Describes one pattern of `no-restricted-imports`.
 */
interface Pattern {
  /**
   * Specifiers the pattern refuses, gitignore style, a `!` re-admitting one.
   */
  readonly group: readonly string[];

  /**
   * Refuses only an import that binds a name this expression matches.
   */
  readonly importNamePattern?: string | undefined;

  /**
   * The text the linter prints beside a refused import.
   */
  readonly message: string;
}

/**
 * The key every override is appended to.
 */
const AT = "lint.overrides";

/**
 * The files every layer covers: the package's sources.
 */
const SOURCES = ["**/src/**"];

/**
 * The files every layer leaves out: specifications and their fixtures.
 */
const APART = ["**/*.spec.ts", "**/*.spec.tsx", "**/*.fixtures.ts", "**/*.fixtures.tsx"];

/**
 * The Standard Schema libraries a contract may import where the options name none.
 */
const SCHEMAS = ["arktype", "valibot", "zod"];

/**
 * The manifest entry where the options name none.
 */
const MANIFEST = "src/manifest.ts";

/**
 * Why a contract imports what it does.
 */
const CONTRACT =
  "A contract imports sdk-core, other contract packages, its package manifest and a Standard " +
  "Schema library alone. The build loads it in Node, and so does every product that installs it.";

/**
 * The house's refusal of the toolchain package, which an override would otherwise drop.
 */
const TOOLCHAIN: Pattern = {
  group: ["vite-plus", "vite-plus/*"],
  message:
    "Import vite or vitest. The toolchain is named in the tsconfig types and the vp scripts alone.",
};

/**
 * The refusal of the host package to a plugin's sources.
 */
const HOST: Pattern = {
  group: ["@stealthscale/sdk-host", "@stealthscale/sdk-host/*"],
  message:
    "A plugin reads the host through sdk-plugin. sdk-host belongs to the product that installs it.",
};

/**
 * The refusal of a component module to the manifest entry, which passes a lazy `import()`.
 */
const COMPONENT: Pattern = {
  group: ["*.tsx"],
  importNamePattern: ".*",
  message:
    "The build loads the manifest entry in Node. A component module loads through a lazy " +
    "importer, () => import(...), alone.",
};

/**
 * Returns the rules of one override: `no-restricted-imports` with the patterns given.
 */
function refusing(patterns: readonly Pattern[]): Readonly<Record<string, unknown>> {
  return { "no-restricted-imports": ["error", { patterns }] };
}

/**
 * Refuses every import of a contract package's sources but `sdk-core`, `@standard-schema/spec`,
 * another contract package, the package's own modules and the Standard Schema libraries named.
 *
 * @remarks
 *   A contract package is named `*-contract`, which is the name this layer re-admits. A deep import
 *   of another contract package is refused.
 * @param options - The Standard Schema libraries a contract may import.
 */
export function contract(options: ContractLinting = {}): Contribution {
  const schemas = (options.schemas ?? SCHEMAS).flatMap((name) => [`!${name}`, `!${name}/*`]);
  const admitted = [
    "!@stealthscale/sdk-core",
    "!@standard-schema/spec",
    "!*-contract",
    "!#*",
    "!#*/**",
    "!./*",
    "!./**",
    ...schemas,
  ];

  return contribute({
    at: AT,
    because: CONTRACT,
    item: {
      excludeFiles: APART,
      files: SOURCES,
      rules: refusing([{ group: ["*", ...admitted], message: CONTRACT }]),
    },
    name: "product.lint.plugin.contract",
  });
}

/**
 * Refuses `sdk-host` to a web package's sources, and a static import of a component module to its
 * manifest entry.
 *
 * @remarks
 *   The manifest entry's override restates the sources' refusals, because an override replaces
 *   the options the rule has for the files it covers.
 * @param options - The manifest entry's path.
 * @returns The sources' override, then the manifest entry's.
 */
export function web(options: WebLinting = {}): readonly Layer[] {
  const manifest = options.manifest ?? MANIFEST;

  return [
    contribute({
      at: AT,
      because: HOST.message,
      item: { excludeFiles: APART, files: SOURCES, rules: refusing([TOOLCHAIN, HOST]) },
      name: "product.lint.plugin.web.sources",
    }),
    contribute({
      at: AT,
      because: COMPONENT.message,
      item: { files: [`**/${manifest}`], rules: refusing([TOOLCHAIN, HOST, COMPONENT]) },
      name: "product.lint.plugin.web.manifest",
    }),
  ];
}
