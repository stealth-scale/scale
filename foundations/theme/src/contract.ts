/**
 * Fixes the vocabulary every theme has to fill: the roles a palette carries, the modes a color is
 * drawn in, the hues, the semantic palettes and the three color families.
 *
 * @remarks
 *   The lists are values as well as types, so the testing kit reads the same names the compiler
 *   checks against. A role added here changes the contract type, and every root theme fails to
 *   compile until it fills the role.
 */

import { type SemanticTokens } from "#pandacss.ts";

/**
 * Lists the ten roles a palette fills, each named for its use. A dotted name nests under its
 * group with `DEFAULT` for the group's own value.
 */
export const ROLES = [
  "subtle",
  "muted",
  "emphasized",
  "border",
  "border.hover",
  "solid",
  "solid.hover",
  "fg",
  "contrast",
  "focusRing",
] as const;

/**
 * Lists the two color modes, as the compiler keys a conditional token value.
 */
export const MODES = ["base", "_dark"] as const;

/**
 * Lists the hue ramps the foundation draws, each of which fills the ten roles.
 */
export const HUES = [
  "blue",
  "cyan",
  "gray",
  "green",
  "indigo",
  "orange",
  "pink",
  "purple",
  "red",
  "teal",
  "yellow",
] as const;

/**
 * Lists the semantic palettes a recipe names an intent with, each drawn from a color.
 */
export const PALETTES = [
  "primary",
  "secondary",
  "accent",
  "neutral",
  "info",
  "success",
  "warning",
  "error",
] as const;

/**
 * Lists the four palettes a status axis switches between.
 */
export const STATUSES = ["info", "success", "warning", "error"] as const;

/**
 * Lists the members of the background family.
 */
export const BACKGROUNDS = [
  "DEFAULT",
  "subtle",
  "muted",
  "emphasized",
  "inverted",
  "panel",
  "popover",
  "backdrop",
] as const;

/**
 * Lists the members of the foreground family.
 */
export const FOREGROUNDS = ["DEFAULT", "muted", "subtle", "inverted", "link"] as const;

/**
 * Lists the members of the border family.
 */
export const BORDERS = ["DEFAULT", "muted", "subtle", "emphasized", "inverted", "focus"] as const;

/**
 * Lists the kinds of token a passage of code is inked by, which are the members of the code
 * family.
 */
export const CODE = [
  "keyword",
  "string",
  "number",
  "function",
  "type",
  "tag",
  "attr",
  "comment",
  "inserted",
  "deleted",
] as const;

/**
 * Selects one of the ten roles.
 */
export type Role = (typeof ROLES)[number];

/**
 * Selects one of the kinds of token a passage of code is inked by.
 */
export type Code = (typeof CODE)[number];

/**
 * Selects one of the two color modes.
 */
export type Mode = (typeof MODES)[number];

/**
 * Selects one of the hue ramps.
 */
export type Hue = (typeof HUES)[number];

/**
 * Selects one of the semantic palettes.
 */
export type Palette = (typeof PALETTES)[number];

/**
 * Selects one of the status palettes.
 */
export type Status = (typeof STATUSES)[number];

/**
 * Describes a color stated in both modes.
 */
export type Moded = Record<"value", Record<Mode, string>>;

/**
 * Describes a color stated once, as a reference into a token that carries both modes.
 */
export type Referenced = Record<"value", string>;

/**
 * Describes a color a role or a family member is filled with: a reference, or a pair a theme tunes
 * by hand.
 */
export type Filled = Moded | Referenced;

/**
 * Takes the group in front of the dot of a dotted role, or the role itself.
 */
type GroupOf<R extends string> = R extends `${infer Group}.${string}` ? Group : R;

/**
 * Takes the members behind the dot of the roles in one group.
 */
type MemberOf<R extends string, Group extends string> = R extends `${Group}.${infer Member}`
  ? Member
  : never;

/**
 * Nests the ten roles the way the compiler reads them: a dotted role under its group with the
 * group's own value at `DEFAULT`.
 *
 * @typeParam Leaf - The shape each role is filled with.
 */
export type PaletteRoles<Leaf> = {
  [Group in GroupOf<Role>]: [MemberOf<Role, Group>] extends [never]
    ? Leaf
    : Record<"DEFAULT", Leaf> & Record<MemberOf<Role, Group>, Leaf>;
};

/**
 * Describes a hue palette, which states every role in both modes.
 */
export type HuePalette = PaletteRoles<Moded>;

/**
 * Describes a semantic palette, which states one value per role.
 */
export type SemanticPalette = PaletteRoles<Filled>;

/**
 * Describes one of the three families: its own members, and a status member per status palette,
 * each a pair or a reference.
 *
 * @typeParam Member - The members the family states itself.
 */
export type Family<Member extends string> = Record<Member | Status, Filled>;

/**
 * Describes every color a root theme states: the four families and the eight intents, and the
 * hue palettes where the theme draws them.
 */
export type ThemeColors = {
  /**
   * The surfaces a page is built from.
   */
  bg: Family<(typeof BACKGROUNDS)[number]>;

  /**
   * The lines between things.
   */
  border: Family<(typeof BORDERS)[number]>;

  /**
   * The inks a passage of code is set in, one per kind of token.
   */
  code: Record<Code, Filled>;

  /**
   * The inks a page is written in.
   */
  fg: Family<(typeof FOREGROUNDS)[number]>;
} & Partial<Record<Hue, HuePalette>> &
  Record<Palette, SemanticPalette>;

/**
 * Describes the three families a page is built from: its surfaces, its lines and its inks.
 */
export type Families = Pick<ThemeColors, "bg" | "border" | "fg">;

/**
 * Describes the semantic tokens a root theme states: every color the contract names, and whatever
 * else it wants to move.
 */
export type ThemeTokens = Record<"colors", ThemeColors> & SemanticTokens;
