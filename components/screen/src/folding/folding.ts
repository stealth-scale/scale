/**
 * Styles a row of actions that folds on its width, for the page, the toolbar and the section.
 *
 * @remarks
 *   Folding is three rules and no JavaScript. A primary action keeps its text at every width. A
 *   secondary action shows its icon, and its text remains for a screen reader. A tertiary action
 *   leaves the row, and the row's folded control opens it instead. The rules select
 *   `data-narrow`, which the row sets from its own width, so a row beside an open sidebar folds on
 *   its own width and the caller writes no breakpoint. No action registers itself and nothing
 *   writes state from an effect.
 */

/**
 * Selects a part inside a row that has measured itself as narrow.
 */
const NARROW = "[data-narrow] &";

/**
 * Attribute an action sets to its priority.
 *
 * @remarks
 *   The priority is an attribute and not an axis, because a slot recipe resolves its variants once,
 *   at the root, and each action in a row folds on its own priority.
 */
export const PRIORITY = "data-priority";

/**
 * Styles an action by its priority while its row is narrow.
 *
 * @remarks
 *   Every action keeps its text on one line at every width, because a wrapped control would make
 *   the row taller. A secondary action hides its element children with `srOnly`, so it keeps its
 *   accessible name, and renders as a square around its icon. Its text must be in an element,
 *   because a selector cannot reach a bare text node. A tertiary action leaves the document, so
 *   the keyboard does not reach a control nobody sees. A primary action is unchanged.
 */
export const FOLDING = {
  [`&[${PRIORITY}=secondary]`]: {
    [NARROW]: {
      "& > :not(svg)": { srOnly: true },
      aspectRatio: "square",
      justifyContent: "center",
      paddingInline: "0",
    },
  },
  [`&[${PRIORITY}=tertiary]`]: { [NARROW]: { display: "none" } },
  whiteSpace: "nowrap",
};

/**
 * Styles the control a row shows for the actions it folds away.
 *
 * @remarks
 *   The control renders only while the row is narrow, because a wide row folds nothing.
 */
export const FOLDED = { display: "none", [NARROW]: { display: "inline-flex" } };
