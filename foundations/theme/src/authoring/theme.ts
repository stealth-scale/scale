/**
 * Defines a theme from its statement and yields both shapes it is consumed in: a preset the
 * compiler installs, and a variant an attribute switches to.
 *
 * @remarks
 *   A theme states a character on the axes a page moves on: its colors, its faces, its type
 *   scale, its metrics, its motion, its shape and its depth. Each axis is drawn into the tokens a
 *   recipe reads, and a token stated outright is merged over what was drawn. A derived theme
 *   states any part of an axis. The part is merged over its parent's statement of that axis and
 *   the axis is drawn again from the whole, so a theme that restates one corner keeps its parent's
 *   other corners, and one that restates the primary keeps its parent's pages. A theme never names
 *   a component. It has no `conditions`, `utilities`, `patterns` or `breakpoints` member because
 *   the runtime is generated once from the foundation, and a condition a theme added would reach
 *   the stylesheet and not the runtime a recipe is typed against.
 */

import { type RecipeExtension, type SlotRecipeExtension } from "#authoring/extension.ts";
import { definePreset, type PresetExtension, type Registrable } from "#authoring/preset.ts";
import { compoundSelection } from "#authoring/recipe.ts";
import { type Axes, drawAxes, type Drawn } from "#draw/axes.ts";
import { type Written } from "#draw/ladder.ts";
import { type Colors } from "#draw/statement.ts";
import { deepMerge } from "#merge.ts";
import {
  type AnimationStyles,
  type GlobalFontface,
  type GlobalStyleObject,
  type LayerStyles,
  type Preset,
  type SemanticTokens,
  type TextStyles,
  type ThemeVariant,
  type Tokens,
} from "#pandacss.ts";
import { compact } from "#record.ts";

/**
 * Fixes the prefix every theme's preset is named with, so a compiler diagnostic names the theme.
 */
const PRESET_PREFIX = "@stealthscale/theme-";

/**
 * Describes the looks a theme redraws: the named motions, the named looks and the named
 * typography a recipe reads in one word.
 */
export interface Looks {
  /**
   * Named motions a recipe reads with `animationStyle`.
   */
  animationStyles?: AnimationStyles | undefined;

  /**
   * Named looks a recipe reads with `layerStyle`.
   */
  layerStyles?: LayerStyles | undefined;

  /**
   * Named typography a recipe reads with `textStyle`. Read at build time only, because the
   * switchable shape carries tokens and nothing else.
   */
  textStyles?: TextStyles | undefined;
}

/**
 * Describes the colors a derived theme states: any part of its parent's, each merged over the
 * parent's before the colors are drawn again.
 */
export type DerivedColors = Partial<Omit<Colors, "dark" | "light">> &
  Partial<Record<"dark" | "light", Partial<Written>>>;

/**
 * Describes the axes a derived theme states: any part of any axis, each merged over the parent's.
 */
export interface DerivedAxes extends Omit<Axes, "colors"> {
  /**
   * Any part of the colors, merged over the parent's before every family and palette is drawn
   * again.
   */
  colors?: DerivedColors | undefined;
}

/**
 * Describes what every theme states beside its axes: the looks it redraws, the recipes it
 * extends, and the packages and styles it carries.
 */
interface Statement {
  /**
   * Faces the theme hosts itself rather than taking from a package.
   */
  fontface?: GlobalFontface | undefined;

  /**
   * The packages carrying the faces the theme names. The theme depends on them, and the
   * application's stylesheet imports them.
   */
  fonts?: readonly string[] | undefined;

  /**
   * Changes to the page itself rather than to what is drawn on it.
   */
  globalCss?: GlobalStyleObject | undefined;

  /**
   * The looks the theme redraws.
   */
  looks?: Looks | undefined;

  /**
   * The word an application installs the theme by and a page writes in the attribute that
   * switches to it.
   */
  name: string;

  /**
   * Changes to recipes that draw one element, keyed by the recipe's key.
   */
  recipes?: Readonly<Record<string, RecipeExtension>> | undefined;

  /**
   * Values that change with the color mode, stated outright over what the axes draw.
   */
  semanticTokens?: SemanticTokens | undefined;

  /**
   * Changes to recipes that draw several parts, keyed by the recipe's key.
   */
  slotRecipes?: Readonly<Record<string, SlotRecipeExtension>> | undefined;

  /**
   * Values that do not change with the color mode, stated outright over what the axes draw.
   */
  tokens?: Tokens | undefined;
}

/**
 * Describes a theme that is the root of its own vocabulary, which states its colors.
 */
export interface RootStatement extends Axes, Statement {
  /**
   * The colors every family and palette is drawn from.
   */
  colors: Colors;

  /**
   * Nothing to build on.
   */
  extends?: undefined;
}

/**
 * Describes a theme built on another, which states what differs and nothing else.
 */
export interface DerivedStatement extends DerivedAxes, Statement {
  /**
   * The theme this one is built on, whose statement this one is merged over.
   */
  extends: Theme;
}

/**
 * Describes what a theme states.
 */
export type ThemeStatement = DerivedStatement | RootStatement;

/**
 * Describes a theme in both the shapes it is consumed in.
 */
export interface Theme {
  /**
   * The axes as stated through the lineage: the parent's with this theme's own merged over
   * them, which a theme built on this one merges its own over in turn.
   */
  axes: Axes;

  /**
   * The packages carrying its faces, its ancestors' included.
   */
  fonts: readonly string[];

  /**
   * The word an application installs it by and a page switches to it with.
   */
  name: string;

  /**
   * The build-time shape: everything the theme states, as a preset. A derived theme nests its
   * parent's preset here, so the compiler composes the lineage.
   */
  preset: Preset;

  /**
   * The run-time shape: the values alone, switched by an attribute. Recipe extensions travel in
   * the preset, and the build scopes them under the same attribute.
   */
  variant: ThemeVariant;
}

/**
 * Refuses a compound matched on a value a class name cannot carry.
 *
 * @remarks
 *   The compiler names a theme's compound by the same scheme as the component's, so a value it
 *   cannot write is a compound that is compiled and never applied. Refused where the theme is
 *   defined, so no application has to find it in a compiled stylesheet.
 * @throws {@link Error} When a compound matches an axis on such a value.
 */
function nameable(extensions: Readonly<Record<string, Registrable>> | undefined): void {
  for (const [key, extended] of Object.entries(extensions ?? {})) {
    for (const compound of extended.compoundVariants ?? []) {
      if (compoundSelection(compound) !== undefined) continue;

      throw new Error(
        `${key} is extended with a compound matched on a value a class name cannot carry`,
      );
    }
  }
}

/**
 * Reports whether a record holds anything.
 */
function filled(record: object): boolean {
  return Object.keys(record).length > 0;
}

/**
 * Reads the axes a theme states, merged over its parent's where it has one.
 */
function merged(statement: ThemeStatement): Axes {
  const own = compact({
    colors: statement.colors,
    depth: statement.depth,
    faces: statement.faces,
    metrics: statement.metrics,
    motion: statement.motion,
    shape: statement.shape,
    type: statement.type,
  });

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a derived theme states any part of an axis, and merged over its parent's statement every part of the axis is present again
  return deepMerge<object>(statement.extends?.axes ?? {}, own);
}

/**
 * Reads the axes a theme touches, each as merged, so the axis is drawn again from the whole and
 * an axis the theme leaves alone is not drawn at all.
 */
function touched(statement: ThemeStatement, axes: Axes): Axes {
  return compact({
    colors: statement.colors === undefined ? undefined : axes.colors,
    depth: statement.depth === undefined ? undefined : axes.depth,
    faces: statement.faces === undefined ? undefined : axes.faces,
    metrics: statement.metrics === undefined ? undefined : axes.metrics,
    motion: statement.motion === undefined ? undefined : axes.motion,
    shape: statement.shape === undefined ? undefined : axes.shape,
    type: statement.type === undefined ? undefined : axes.type,
  });
}

/**
 * Draws the switchable half of a theme: what its axes drew, with what it states outright merged
 * over it.
 */
function variant(statement: ThemeStatement, drawn: Drawn): ThemeVariant {
  const semanticTokens = deepMerge(drawn.semanticTokens, statement.semanticTokens ?? {});

  return compact({
    semanticTokens: filled(semanticTokens) ? semanticTokens : undefined,
    tokens: deepMerge(drawn.tokens, statement.tokens ?? {}),
  });
}

/**
 * Collects everything a theme adds under `extend`, which is what makes an extension merge over
 * the recipe rather than replace it.
 *
 * @remarks
 *   The looks are merged into what the axes drew rather than spread over it, at every level. A
 *   role is a group of named steps, so a theme restating one step of its heading keeps the seven
 *   the axes drew for its siblings, the way a token stated outright keeps the tokens beside it.
 * @throws {@link Error} When a compound matches an axis on a value a class name cannot carry.
 */
function extension(statement: ThemeStatement, drawn: Drawn, own: ThemeVariant): PresetExtension {
  const { looks = {}, recipes, slotRecipes } = statement;
  const textStyles = deepMerge(drawn.textStyles, looks.textStyles ?? {});

  nameable(recipes);
  nameable(slotRecipes);

  return compact({
    animationStyles: looks.animationStyles,
    layerStyles: looks.layerStyles,
    recipes,
    semanticTokens: own.semanticTokens,
    slotRecipes,
    textStyles: filled(textStyles) ? textStyles : undefined,
    tokens: own.tokens !== undefined && filled(own.tokens) ? own.tokens : undefined,
  });
}

/**
 * Defines a theme from its statement and returns it as a preset an application installs and as a
 * variant a page switches to.
 *
 * @remarks
 *   A derived theme merges its axes over its parent's and draws the ones it touched from the
 *   whole, nests its parent's preset under its own, merges its switchable values over its
 *   parent's, and names its parent's font packages beside its own.
 */
export function defineTheme(statement: ThemeStatement): Theme {
  const { extends: parent, name } = statement;
  const axes = merged(statement);
  const drawn = drawAxes(touched(statement, axes));
  const own = variant(statement, drawn);
  const preset = definePreset({
    ...(parent === undefined ? {} : { presets: [parent.preset] }),
    ...(statement.fontface === undefined ? {} : { globalFontface: statement.fontface }),
    ...(statement.globalCss === undefined ? {} : { globalCss: statement.globalCss }),
    name: `${PRESET_PREFIX}${name}`,
    theme: { extend: extension(statement, drawn, own) },
  });

  return {
    axes,
    fonts:
      parent === undefined
        ? (statement.fonts ?? [])
        : [...new Set([...parent.fonts, ...(statement.fonts ?? [])])],
    name,
    preset,
    variant: parent === undefined ? own : deepMerge(parent.variant, own),
  };
}
