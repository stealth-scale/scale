/**
 * Names the colors a display chooses for itself, which a recipe may write and a theme may not
 * move.
 *
 * @remarks
 *   A forced-color mode replaces every color an author writes with one from the reader's own
 *   palette. A recipe that wants a marked row, a switch's thumb or a selected tab to stay visible
 *   there has to name one of these, because a theme token is a color the display is about to
 *   overwrite. They are the one place a recipe writes a color outright rather than reading a
 *   semantic token, so they are listed rather than matched: a misspelling is a color nobody sees.
 */

/**
 * Lists the system colors CSS Color 4 defines.
 */
const SYSTEM: ReadonlySet<string> = new Set([
  "AccentColor",
  "AccentColorText",
  "ActiveText",
  "ButtonBorder",
  "ButtonFace",
  "ButtonText",
  "Canvas",
  "CanvasText",
  "Field",
  "FieldText",
  "GrayText",
  "Highlight",
  "HighlightText",
  "LinkText",
  "Mark",
  "MarkText",
  "SelectedItem",
  "SelectedItemText",
  "VisitedText",
]);

/**
 * Reports whether a value names a color the display chooses.
 */
export function isSystemColor(value: string): boolean {
  return SYSTEM.has(value);
}
