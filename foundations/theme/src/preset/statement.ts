/**
 * Fixes the foundation's statement and draws it once: its colors, the system faces, and every
 * other axis at the engine's defaults, so the preset is the same statement drawn by the same
 * engine that draws every theme.
 *
 * @remarks
 *   The faces are the system stacks, because a face already on the machine is the fastest one
 *   there is. The heading face follows the body face, so a heading role names `heading` and a
 *   theme sets a display face once.
 */

import { drawAxes, type DrawnRoot, type RootAxes } from "#draw/axes.ts";
import { FOUNDATION } from "#draw/foundation.ts";

/**
 * Fixes the system sans-serif stack, with the emoji faces at the end.
 */
const SANS =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"';

/**
 * Fixes the system monospaced stack.
 */
const MONO =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

/**
 * Fixes the foundation's statement: its colors, its faces, and each other axis left at the
 * engine's defaults.
 */
export const statement: RootAxes = {
  colors: FOUNDATION,
  depth: {},
  faces: { body: SANS, mono: MONO },
  metrics: {},
  motion: {},
  shape: {},
  type: {},
};

/**
 * Draws the statement once, for the three categories of the preset to read from.
 */
export const drawn: DrawnRoot = drawAxes(statement);
