/**
 * Draws the axes a theme states into the shapes the compiler reads: the colors into every family
 * and palette, and the type, metrics, shape, depth and faces into their categories.
 *
 * @remarks
 *   An axis left out is not drawn, so a theme built on another states what differs and inherits
 *   the rest, and the foundation is the same statement drawn at its defaults.
 */

import { type ThemeColors } from "#contract.ts";
import { type Depth, depth } from "#draw/depth.ts";
import { type Metrics, metrics } from "#draw/metrics.ts";
import { type Shape, shape } from "#draw/shape.ts";
import { type Colors, drawColors } from "#draw/statement.ts";
import { type Tempo, tempo } from "#draw/tempo.ts";
import { type Type, typeScale } from "#draw/type.ts";
import { deepMerge } from "#merge.ts";
import { type SemanticTokens, type TextStyles, type Tokens } from "#pandacss.ts";
import { compact } from "#record.ts";

/**
 * Describes the faces a theme states, each as CSS writes a `font-family`.
 */
export interface Faces {
  /**
   * The face body text is set in.
   */
  body?: string | undefined;

  /**
   * The face headings are set in. The body face unless stated.
   */
  heading?: string | undefined;

  /**
   * The face code is set in.
   */
  mono?: string | undefined;
}

/**
 * Describes the axes a theme draws, each optional.
 */
export interface Axes {
  /**
   * The colors, from which every family and palette is drawn.
   */
  colors?: Colors | undefined;

  /**
   * The shadow hue and the depth.
   */
  depth?: Depth | undefined;

  /**
   * The three faces.
   */
  faces?: Faces | undefined;

  /**
   * The density and the layout bases.
   */
  metrics?: Metrics | undefined;

  /**
   * The multiplier on every pace, and the four curves.
   */
  motion?: Tempo | undefined;

  /**
   * The roundest corner and the stroke widths.
   */
  shape?: Shape | undefined;

  /**
   * The body size and the ratio of the type scale, and the roles over it.
   */
  type?: Type | undefined;
}

/**
 * Describes the axes as drawn, in the three categories the compiler reads them under.
 */
export interface Drawn {
  /**
   * The colors, shadows, sizes, spacing, radii, stroke widths, paces and curves.
   */
  semanticTokens: SemanticTokens;

  /**
   * The size styles of the type scale and the roles over them.
   */
  textStyles: TextStyles;

  /**
   * The faces and the font sizes.
   */
  tokens: Tokens;
}

/**
 * Describes the axes of a root theme, which states its colors.
 */
export type RootAxes = Axes & Record<"colors", Colors>;

/**
 * Describes a root theme's axes as drawn, with every color the contract names present.
 */
export type DrawnRoot = Drawn & Record<"semanticTokens", Record<"colors", ThemeColors>>;

/**
 * Describes the face tokens a theme states.
 */
type Fonts = NonNullable<Tokens["fonts"]>;

/**
 * Writes one face as a token, or nothing where the theme states none.
 */
function face(stated: string | undefined): Record<"value", string> | undefined {
  return stated === undefined ? undefined : { value: stated };
}

/**
 * Draws the face tokens from the faces a theme states, the heading face following the body face
 * where the theme states no heading face.
 */
export function faces(stated: Faces): Fonts {
  return compact({
    body: face(stated.body),
    heading: face(stated.heading ?? stated.body),
    mono: face(stated.mono),
  });
}

/**
 * Draws the four axes a page is measured by: how far a thing casts, how large it is, how fast it
 * answers, and what shape it takes.
 *
 * @remarks
 *   Merged rather than spread, because two axes write one category: the metrics draw the gaps and
 *   the insets under `spacing` and the shape draws the ring's room there beside them.
 */
function measures(axes: Axes): SemanticTokens {
  return [
    axes.depth === undefined ? {} : depth(axes.depth),
    axes.metrics === undefined ? {} : metrics(axes.metrics),
    axes.motion === undefined ? {} : tempo(axes.motion),
    axes.shape === undefined ? {} : shape(axes.shape),
  ].reduce<SemanticTokens>((drawn, category) => deepMerge(drawn, category), {});
}

/**
 * Draws the axes of a root theme, its colors among them, so every color the contract names is
 * present in what is drawn.
 */
export function drawAxes(axes: RootAxes): DrawnRoot;

/**
 * Draws the axes a theme states, and nothing for an axis it leaves out.
 */
export function drawAxes(axes: Axes): Drawn;

/**
 * Draws each axis a theme states into its category.
 */
export function drawAxes(axes: Axes): Drawn {
  const type = axes.type === undefined ? undefined : typeScale(axes.type);

  return {
    semanticTokens: {
      ...(axes.colors === undefined ? {} : { colors: drawColors(axes.colors) }),
      ...measures(axes),
    },
    textStyles: type?.textStyles ?? {},
    tokens: compact({
      fonts: axes.faces === undefined ? undefined : faces(axes.faces),
      fontSizes: type?.fontSizes,
    }),
  };
}
