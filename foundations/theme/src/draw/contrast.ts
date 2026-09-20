/**
 * Measures contrast the way WCAG defines it, for the ratios 1.4.3, 1.4.6 and 1.4.11 are written
 * against.
 *
 * @remarks
 *   Written here rather than taken from a color library, because the whole of it is two matrices,
 *   a transfer curve and a dot product. A color reaches the measurement four ways: OKLCH with a
 *   percentage as a theme writes it, OKLCH scaled to one as a browser hands it back, and hex or
 *   `rgb()` for anything a browser serialised.
 */

/**
 * Describes a color in linear sRGB, each channel running from 0 to 1.
 */
export interface Linear {
  /**
   * The blue channel.
   */
  blue: number;

  /**
   * The green channel.
   */
  green: number;

  /**
   * The red channel.
   */
  red: number;
}

/**
 * Matches one number as CSS writes it: digits with an optional fraction, or a fraction alone.
 *
 * @remarks
 *   A run of digits and dots would accept `..`, which reads as a number that is not one, and
 *   every value drawn from it would be the same.
 */
const NUMBER = String.raw`\d+(?:\.\d+)?|\.\d+`;

/**
 * Matches an OKLCH color, whether the lightness carries a percentage or runs 0 to 1, and whether
 * the hue is a number or `none`.
 */
const OKLCH = new RegExp(
  String.raw`^oklch\(\s*(?<lightness>${NUMBER})(?<percent>%)?\s+(?<chroma>${NUMBER})\s+(?<hue>${NUMBER}|none)\s*\)$`,
  "u",
);

/**
 * Matches a hex color of the four lengths CSS writes, and no other.
 *
 * @remarks
 *   A run of three to eight digits would accept `#fffff`, which is five digits and no color at
 *   all, and read it as though a digit had been meant twice.
 */
const HEX = /^#(?<digits>[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/iu;

/**
 * Matches the `rgb()` a browser serialises a color to, comma-separated or not.
 */
const RGB = new RegExp(
  String.raw`^rgba?\(\s*(?<red>${NUMBER})[\s,]+(?<green>${NUMBER})[\s,]+(?<blue>${NUMBER})(?:[\s,/]+(?<alpha>${NUMBER})(?<percent>%)?)?\s*\)$`,
  "u",
);

/**
 * Fixes the ratio normal text has to clear at each level.
 *
 * @remarks
 *   Large text clears at 3 and 4.5. That is a judgement about the type rather than the colors, so
 *   a caller measuring a heading compares the ratio itself.
 */
const LEVELS = { AA: 4.5, AAA: 7 };

/**
 * Selects how much contrast is asked for.
 */
export type Level = keyof typeof LEVELS;

/**
 * Undoes the sRGB transfer curve, so a channel as a stylesheet writes it becomes the light a
 * display emits.
 */
function decoded(channel: number): number {
  return channel <= 0.040_45 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

/**
 * Converts an OKLCH color to linear sRGB, unclamped.
 *
 * @remarks
 *   A channel outside 0 to 1 is a color outside the display's gamut, and clamping it here would
 *   report a contrast the reader never sees. The matrices are Björn Ottosson's. A percentage runs
 *   to a hundred and a bare number runs to one, and CSS accepts both. A hue of `none` is a grey,
 *   and reads as zero.
 * @returns The color in linear sRGB, or undefined where the value is not OKLCH.
 */
function fromOklch(color: string): Linear | undefined {
  const read = OKLCH.exec(color)?.groups;

  if (read === undefined) return undefined;

  const lightness = Number(read["lightness"]) / (read["percent"] === undefined ? 1 : 100);
  const chroma = Number(read["chroma"]);
  const radians = read["hue"] === "none" ? 0 : (Number(read["hue"]) * Math.PI) / 180;
  const a = chroma * Math.cos(radians);
  const b = chroma * Math.sin(radians);
  const long = (lightness + 0.396_337_777_4 * a + 0.215_803_757_3 * b) ** 3;
  const medium = (lightness - 0.105_561_345_8 * a - 0.063_854_172_8 * b) ** 3;
  const short = (lightness - 0.089_484_177_5 * a - 1.291_485_548 * b) ** 3;

  return {
    blue: -0.004_196_086_3 * long - 0.703_418_614_7 * medium + 1.707_614_701 * short,
    green: -1.268_438_004_6 * long + 2.609_757_401_1 * medium - 0.341_319_396_5 * short,
    red: 4.076_741_662_1 * long - 3.307_711_591_3 * medium + 0.230_969_929_2 * short,
  };
}

/**
 * Widens a three or four digit hex to six or eight by pairing each digit with itself.
 */
function widened(digits: string): string {
  return digits.length > 4 ? digits : digits.replaceAll(/([\da-f])/giu, "$1$1");
}

/**
 * Reads the channel whose pair of digits starts at an index out of a six or eight digit hex, in
 * linear light.
 */
function byteAt(digits: string, index: number): number {
  return decoded(Number.parseInt(digits.slice(index, index + 2), 16) / 255);
}

/**
 * Converts a hex color to linear sRGB.
 *
 * @returns The color in linear sRGB, or undefined where the value is not a hex color or carries
 *   transparency.
 */
function fromHex(color: string): Linear | undefined {
  const digits = HEX.exec(color)?.groups?.["digits"];

  if (digits === undefined) return undefined;

  const bytes = widened(digits);

  if (bytes.length === 8 && Number.parseInt(bytes.slice(6, 8), 16) !== 255) return undefined;

  return { blue: byteAt(bytes, 4), green: byteAt(bytes, 2), red: byteAt(bytes, 0) };
}

/**
 * Converts an `rgb()` color to linear sRGB.
 *
 * @returns The color in linear sRGB, or undefined where the value is not an `rgb()` color or
 *   carries transparency.
 */
function fromRgb(color: string): Linear | undefined {
  const read = RGB.exec(color)?.groups;

  if (read === undefined) return undefined;

  const alpha = read["alpha"];

  if (alpha !== undefined && Number(alpha) / (read["percent"] === undefined ? 1 : 100) < 1) {
    return undefined;
  }

  return {
    blue: decoded(Number(read["blue"]) / 255),
    green: decoded(Number(read["green"]) / 255),
    red: decoded(Number(read["red"]) / 255),
  };
}

/**
 * Converts a hex or `rgb()` color to linear sRGB.
 *
 * @remarks
 *   A color carrying transparency is refused. What a reader sees through it is whatever it was
 *   painted over, so a ratio measured on the color itself is a number nobody sees: black at a
 *   tenth of an alpha measures 21:1 against white and shows about 1.25:1. A theme states opaque
 *   colors and a recipe asks the compiler for an opacity where it wants one.
 * @returns The color in linear sRGB, or undefined where the value is neither, or carries
 *   transparency.
 */
function fromSrgb(color: string): Linear | undefined {
  return fromHex(color) ?? fromRgb(color);
}

/**
 * Describes a color in OKLab: a lightness and two opponent axes.
 */
export interface Oklab {
  /**
   * The green to red axis.
   */
  a: number;

  /**
   * The blue to yellow axis.
   */
  b: number;

  /**
   * The lightness, 0 for black and 1 for white.
   */
  l: number;
}

/**
 * Reads a color into linear sRGB, unclamped.
 *
 * @param color - The color as CSS writes it: OKLCH, hex or `rgb()`.
 * @returns The three channels, or undefined where the color cannot be read.
 */
export function linear(color: string): Linear | undefined {
  return fromOklch(color) ?? fromSrgb(color);
}

/**
 * Reads a color into OKLab, the space every ramp here is drawn in.
 *
 * @remarks
 *   A difference between two colors is the distance between their OKLab points, and a
 *   difference in lightness alone is the difference between their `l` values. The matrices are
 *   Björn Ottosson's.
 * @returns The three coordinates, or undefined where the color cannot be read.
 */
export function oklab(color: string): Oklab | undefined {
  const read = linear(color);

  if (read === undefined) return undefined;

  const long = Math.cbrt(
    0.412_221_470_8 * read.red + 0.536_332_536_3 * read.green + 0.051_445_992_9 * read.blue,
  );
  const medium = Math.cbrt(
    0.211_903_498_2 * read.red + 0.680_699_545_1 * read.green + 0.107_396_956_6 * read.blue,
  );
  const short = Math.cbrt(
    0.088_302_461_9 * read.red + 0.281_718_837_6 * read.green + 0.629_978_700_5 * read.blue,
  );

  return {
    a: 1.977_998_495_1 * long - 2.428_592_205 * medium + 0.450_593_709_9 * short,
    b: 0.025_904_037_1 * long + 0.782_771_766_2 * medium - 0.808_675_766 * short,
    l: 0.210_454_255_3 * long + 0.793_617_785 * medium - 0.004_072_046_8 * short,
  };
}

/**
 * Brings a linear channel inside sRGB, which is what a display does with one outside it.
 */
function clipped(channel: number): number {
  return Math.min(Math.max(channel, 0), 1);
}

/**
 * Measures relative luminance as WCAG defines it, on the color a display shows rather than the
 * color the theme wrote.
 *
 * @remarks
 *   A channel outside 0 to 1 is a color outside sRGB, and a display shows the nearest color it
 *   can by clipping that channel. Measuring the unclipped value reports a ratio nobody sees: a
 *   cyan whose red channel is a little below zero measures brighter than the cyan that reaches
 *   the screen, and a pair can clear a threshold in the engine and fail it on the display.
 *   Clipping here is what the display does, so the number and the pixel agree.
 * @param color - The color as CSS writes it: OKLCH, hex or `rgb()`.
 * @returns The luminance, 0 for black and 1 for white, or `NaN` where the color cannot be read.
 */
export function luminance(color: string): number {
  const read = linear(color);

  if (read === undefined) return Number.NaN;

  return 0.2126 * clipped(read.red) + 0.7152 * clipped(read.green) + 0.0722 * clipped(read.blue);
}

/**
 * Measures the contrast ratio between two colors, from 1 to 21.
 *
 * @remarks
 *   The order of the two does not matter, and the two need not be written the same way.
 * @returns The ratio, or `NaN` where either color cannot be read, so a caller tells an unreadable
 *   pair from an unmeasured one.
 */
export function contrast(foreground: string, background: string): number {
  const front = luminance(foreground);
  const back = luminance(background);

  if (Number.isNaN(front) || Number.isNaN(back)) return Number.NaN;

  const [darker, lighter] = front < back ? [front, back] : [back, front];

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Reports whether text of one color can be read on another at a level.
 *
 * @remarks
 *   `AA` is what 1.4.3 asks of normal text and `AAA` what 1.4.6 asks. A color that cannot be read
 *   clears nothing.
 */
export function readable(foreground: string, background: string, level: Level = "AA"): boolean {
  return contrast(foreground, background) >= LEVELS[level];
}
