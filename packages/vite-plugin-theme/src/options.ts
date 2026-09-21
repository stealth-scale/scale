/**
 * Resolves the plugin's options against its defaults, and fixes the name and location of every
 * generated file.
 *
 * @remarks
 *   Only the three options differ between one repository and the next. Names and locations are
 *   conventions, so they stay constants. Making one configurable would give a repository two ways
 *   to spell the same thing.
 */

import { scratchDir as scratchOf } from "@stealthscale/vite-plugin-base";

import { type StylesheetLayers } from "#pandacss.ts";

/**
 * Directory under the system temporary directory that holds every package's generated files.
 */
const SCRATCH = "stealth-theme";

/**
 * File under a package's scratch that a generation holds while it renders a configuration, runs the
 * compiler and publishes the result.
 *
 * @remarks
 *   One per package directory. A dev server, a type check and a test run in the same checkout all
 *   generate on start. The lock stops one process reading a configuration another is writing, or
 *   deleting files another is publishing.
 */
export const LOCK = "lock";

/**
 * Returns the directory a package generates into, holding its rendered configurations, the runtime
 * before it is published, and the lock.
 *
 * @remarks
 *   The directory sits under the system temporary directory rather than under the package. A task
 *   runner fingerprints what a build reads and writes inside the workspace and refuses to cache a
 *   build that did both to one file, and the plugin writes a configuration the compiler then reads.
 * @param root - Absolute path to the package directory.
 */
export function scratchDir(root: string): string {
  return scratchOf(SCRATCH, root);
}

/**
 * Filename an application declares its themes in.
 */
export const STATEMENT = "theme.config.ts";

/**
 * Directory inside the system package that the generated runtime is written into.
 *
 * @remarks
 *   The house lint excludes `generated/` from formatting and coverage, so the emitted runtime needs
 *   no configuration of its own.
 */
export const GENERATED = "generated";

/**
 * Export subpath a package publishes its preset under.
 */
export const PRESET_SUBPATH = "./theme";

/**
 * Attribute the compiled stylesheet switches themes on, set on the document root or on any element
 * to scope a subtree.
 *
 * @remarks
 *   The compiler emits every theme under an attribute of its own naming and the plugin rewrites it
 *   to this one, so nothing the page sees names the compiler. The design-system package publishes
 *   the same constant for a provider to set.
 */
export const THEME_ATTRIBUTE = "data-theme";

/**
 * Character the compiler writes between an axis and its value, and between a property's class and
 * its value, inside a class name.
 *
 * @remarks
 *   The compiler's own default. No axis or value contains an underscore, so the first one marks the
 *   boundary, and a negative value keeps its sign where a hyphen would run into it. No class on a
 *   page carries it, because the naming scheme parses on it and emits a hyphen.
 */
export const SEPARATOR = "_";

/**
 * Cascade layers in the order the compiler writes them, under whatever names they are given.
 *
 * @remarks
 *   The compiler assigns each kind of rule to a layer by role. A stylesheet declaring a different
 *   order would resolve rules in a cascade the compiler did not write them for.
 */
const LAYER_ORDER: ReadonlyArray<keyof StylesheetLayers> = [
  "reset",
  "base",
  "tokens",
  "recipes",
  "utilities",
];

/**
 * Package that publishes the foundation and generates the runtime in this workspace.
 */
const SYSTEM = "@stealthscale/theme";

/**
 * Value used for every option a repository leaves unset.
 */
const DEFAULTS: Omit<Resolved, "stylesheet"> = {
  include: ["src/**/*.{ts,tsx}"],
  layers: {
    base: "base",
    recipes: "recipes",
    reset: "reset",
    tokens: "tokens",
    utilities: "utilities",
  },
  systemPackage: SYSTEM,
};

/**
 * Per-repository overrides for the plugin's defaults.
 */
export interface Options {
  /**
   * Globs the compiler scans, relative to the application. The source of every workspace package
   * the application depends on is scanned as well.
   *
   * @defaultValue `["src/**\/*.{ts,tsx}"]`
   */
  include?: readonly string[] | undefined;

  /**
   * Name of each cascade layer.
   *
   * @remarks
   *   One setting drives two things that must agree: the layer the compiler writes each kind of
   *   rule into, and the layer the stylesheet declares. An application embedded in a page that
   *   already uses one of these names renames it here and both follow.
   * @defaultValue Each role's own name
   */
  layers?: Partial<StylesheetLayers> | undefined;

  /**
   * Package that publishes the foundation and generates the runtime.
   *
   * @defaultValue `@stealthscale/theme`
   */
  systemPackage?: string | undefined;
}

/**
 * The subset of options the design-system package itself can set, which is the layer names alone.
 *
 * @remarks
 *   The runtime is generated from the package's own preset, so the globs an application scans and
 *   the name of the system package have no meaning there.
 */
export type RuntimeOptions = Pick<Options, "layers">;

/**
 * Options with every default filled in.
 */
export interface Resolved {
  /**
   * Globs the compiler scans, relative to the application.
   */
  include: readonly string[];

  /**
   * Name of each cascade layer.
   */
  layers: StylesheetLayers;

  /**
   * Specifier an application imports to load its stylesheet.
   */
  stylesheet: string;

  /**
   * Package that publishes the foundation and generates the runtime.
   */
  systemPackage: string;
}

/**
 * Fills in every option the caller left unset.
 *
 * @remarks
 *   The stylesheet specifier is derived from the system package, so renaming the package renames
 *   the import along with it.
 */
export function resolveOptions(options: Options = {}): Resolved {
  const systemPackage = options.systemPackage ?? DEFAULTS.systemPackage;

  return {
    include: options.include ?? DEFAULTS.include,
    layers: { ...DEFAULTS.layers, ...options.layers },
    stylesheet: `${systemPackage}/styles.css`,
    systemPackage,
  };
}

/**
 * Builds the `@layer` at-rule that declares the cascade order.
 *
 * @remarks
 *   The at-rule also identifies the stylesheet. The file that declares the order is the file the
 *   compiled rules are appended to.
 * @returns The at-rule, ending in a semicolon.
 */
export function layerDeclaration(layers: StylesheetLayers): string {
  return `@layer ${LAYER_ORDER.map((role) => layers[role]).join(", ")};`;
}

/**
 * Escapes the characters in a layer name that a regular expression would otherwise read as syntax.
 */
function escaped(name: string): string {
  return name.replaceAll(/[$()*+.?[\\\]^{|}]/gu, String.raw`\$&`);
}

/**
 * Builds the pattern that matches the cascade-order at-rule whatever its spacing.
 *
 * @remarks
 *   The at-rule identifies the stylesheet, and a formatter or a minifier decides the spacing around
 *   its commas. The pattern matches on the names alone, so
 *   `@layer reset,base,tokens,recipes,utilities;` matches as readily as the spaced form.
 */
export function layerPattern(layers: StylesheetLayers): RegExp {
  const names = LAYER_ORDER.map((role) => escaped(layers[role]));

  return new RegExp(String.raw`@layer\s+${names.join(String.raw`\s*,\s*`)}\s*;`, "u");
}

/**
 * The cascade-order line an application gets when it sets no layer names of its own.
 *
 * @remarks
 *   An application's stylesheet opens with this line and the compiled rules are appended after it.
 *   A specification that drives the plugin uses this constant rather than a literal of its own, so
 *   renaming a layer does not leave a specification asserting against the old names.
 */
export const LAYER_DECLARATION = `${layerDeclaration(resolveOptions().layers)}\n`;
