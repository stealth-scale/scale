/**
 * Recognises the system colors a display supplies, which a recipe may write and a theme may not
 * redefine.
 *
 * @remarks
 *   Forced-colors mode replaces every color an author writes with one from the user's palette. A
 *   recipe that needs a marked row, a switch thumb or a selected tab to stay visible there has to
 *   name a system color, because the display overwrites a theme token. The set is enumerated and
 *   not matched by pattern, because a misspelled system color renders as a color no user sees.
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
 * Returns true when the value is one of the system colors CSS Color 4 defines.
 */
export function isSystemColor(value: string): boolean {
  return SYSTEM.has(value);
}
