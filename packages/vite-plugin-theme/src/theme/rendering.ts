/**
 * Renders the compiler configuration the stylesheet is built from, out of what an assembly loaded.
 */

import { basePreset } from "#compiler.ts";
import { renderStylesheetConfig } from "#config.ts";
import { type Resolved } from "#options.ts";
import { type Preset } from "#pandacss.ts";
import { publishedCompounds, scopedPresets } from "#scope.ts";
import { type Application, type Theme } from "#statement.ts";
import { completed, stated } from "#theme/variant.ts";

/**
 * The inputs the configuration is rendered from.
 */
export interface Rendering {
  /**
   * The application's theme statement.
   */
  application: Application;

  /**
   * The foundation preset the system package publishes.
   */
  foundation: Preset;

  /**
   * The globs the compiler scans, relative to the application.
   */
  include: readonly string[];

  /**
   * Every preset installed after the foundation and before the themes: the other contributors'
   * and the application's own.
   */
  published: readonly object[];

  /**
   * The plugin options with every default filled in.
   */
  resolved: Resolved;
}

/**
 * Translates the application's `static` setting into the compiler's `staticCss` rule.
 *
 * @remarks
 *   The shorthand `*` means every recipe, which the compiler spells `{ recipes: "*" }`. Any other
 *   setting is already in the compiler's form and passes through.
 */
function staticCssOf(application: Application): Exclude<Application["static"], "*"> {
  return application.static === "*" ? { recipes: "*" } : application.static;
}

/**
 * Builds the presets that install the first theme unscoped, so it is the theme in force while no
 * attribute is set: its values first, then its own preset if it has one.
 *
 * @remarks
 *   The values are installed alongside the theme's preset rather than merged into it, because that
 *   preset nests the presets the theme derives from, and merging here would mean reimplementing
 *   the compiler's own merge. An application that declares no theme installs nothing and compiles
 *   the foundation alone.
 */
function defaultPresets(first: Theme | undefined): readonly object[] {
  if (first === undefined) return [];

  return [
    { name: `theme:${first.name}`, theme: { extend: first.variant } },
    ...(first.preset === undefined ? [] : [first.preset]),
  ];
}

/**
 * Renders the configuration the stylesheet is compiled from.
 *
 * @remarks
 *   Preset order carries the meaning here. The application's own presets go after every package's
 *   and before the themes, so a theme can extend a recipe the application wrote. The first theme
 *   is installed unscoped, making it the theme in force while no attribute is set. Every theme's
 *   variant is then completed with the foundation's value for each token any other theme declares,
 *   so a subtree switched to a theme takes all its values from that theme and never inherits a
 *   token from the theme above it.
 */
export function renderedConfig(rendering: Rendering): string {
  const { application, foundation, include, published, resolved } = rendering;
  const themes = application.themes ?? [];
  const shape = stated(themes.map((each) => each.variant));

  return renderStylesheetConfig({
    base: basePreset(),
    foundation,
    include,
    layers: resolved.layers,
    presets: [
      ...published,
      ...defaultPresets(themes[0]),
      ...scopedPresets(themes, publishedCompounds([foundation, ...published])),
    ],
    staticCss: staticCssOf(application),
    system: resolved.systemPackage,
    themes: Object.fromEntries(
      themes.map((each) => [each.name, completed(each.variant, foundation, shape)]),
    ),
  });
}
