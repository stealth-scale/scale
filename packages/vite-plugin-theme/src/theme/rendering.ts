/**
 * Renders the configuration the stylesheet is compiled from, out of what an assembly loaded.
 */

import { basePreset } from "#compiler.ts";
import { renderStylesheetConfig } from "#config.ts";
import { type Resolved } from "#options.ts";
import { type Preset } from "#pandacss.ts";
import { publishedCompounds, scopedPresets } from "#scope.ts";
import { type Application, type Theme } from "#statement.ts";
import { completed, stated } from "#theme/variant.ts";

/**
 * Carries what the configuration is rendered from.
 */
export interface Rendering {
  /**
   * The application's statement.
   */
  application: Application;

  /**
   * The foundation the system package publishes.
   */
  foundation: Preset;

  /**
   * Globs the compiler scans, relative to the application.
   */
  include: readonly string[];

  /**
   * Every preset installed after the foundation and before the themes: the other contributors'
   * and the application's own.
   */
  published: readonly object[];

  /**
   * The options with every default filled in.
   */
  resolved: Resolved;
}

/**
 * Turns what the application asked to compile outright into the compiler's rule.
 */
function staticCssOf(application: Application): Exclude<Application["static"], "*"> {
  return application.static === "*" ? { recipes: "*" } : application.static;
}

/**
 * Builds the presets that install the first theme unscoped, which is what draws that theme while
 * no attribute is set: its values, then its own preset where it has one.
 *
 * @remarks
 *   The values are installed beside the theme's own preset rather than merged into it, because
 *   that preset nests the presets the theme derives from, and a merge here would restate how the
 *   compiler merges them. An application that states no theme installs nothing here and draws the
 *   foundation alone.
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
 *   The presets the application states are installed after every package's preset and before the
 *   themes, so a theme extends a recipe the application wrote as it extends one a package
 *   published. The first theme's values and preset are installed unscoped, which is what makes it
 *   the theme that applies while no attribute is set, and every theme's preset is installed scoped,
 *   the first included. Every theme's variant is completed with the foundation's value for each
 *   token another theme states before it is installed, so a subtree switched to a theme is drawn
 *   from that theme alone rather than from the theme around it.
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
