/**
 * Renders a signature's strokes as the SVG image a form submits.
 *
 * @remarks
 *   The image is built from the path data alone, so the root builds it while it renders. Its view
 *   box crops the strokes with a margin of 4px, because the strokes are in the control's pixel
 *   coordinates and a signature rarely fills its pad. The strokes fill in the ink the caller states
 *   in `drawing.fill`, or black, which reads on paper in either color mode.
 */

/**
 * Selects one coordinate pair of an SVG path: an x, a comma and a y.
 */
const PAIR = /(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/gu;

/**
 * Space around the strokes, in the control's pixels.
 */
const MARGIN = 4;

/**
 * Returns text with the characters XML reserves in an attribute escaped. The ampersand goes first,
 * so the escapes after it are not escaped again.
 */
function escaped(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/**
 * Returns the smallest box around every coordinate pair of the paths: left, top, right, bottom.
 */
function boundsOf(paths: readonly string[]): [number, number, number, number] {
  let bounds: [number, number, number, number] = [
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ];

  for (const path of paths) {
    for (const [, x, y] of path.matchAll(PAIR)) {
      const [left, top, right, bottom] = bounds;

      bounds = [
        Math.min(left, Number(x)),
        Math.min(top, Number(y)),
        Math.max(right, Number(x)),
        Math.max(bottom, Number(y)),
      ];
    }
  }

  return bounds;
}

/**
 * Returns the strokes as an SVG data URL cropped to them, or nothing where there is no stroke.
 *
 * @param paths - The committed strokes as SVG path data.
 * @param fill - The ink, a color the caller states in `drawing.fill`. Defaults to black.
 * @returns The data URL, or an empty string for a blank pad.
 */
export function imageOf(paths: readonly string[], fill = "black"): string {
  const [left, top, right, bottom] = boundsOf(paths);

  if (!Number.isFinite(left)) return "";

  const x = Math.floor(left) - MARGIN;
  const y = Math.floor(top) - MARGIN;
  const width = Math.ceil(right) + MARGIN - x;
  const height = Math.ceil(bottom) + MARGIN - y;
  const drawn = paths.map((path) => `<path d="${escaped(path)}"/>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${String(x)} ${String(y)} ${String(width)} ${String(height)}" width="${String(width)}" height="${String(height)}" fill="${escaped(fill)}">${drawn}</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
