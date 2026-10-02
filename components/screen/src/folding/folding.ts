/**
 * Styles an action that folds to its icon while its row is narrow, for the page, the toolbar and
 * the section.
 *
 * @remarks
 *   A secondary action shows its icon alone, and its words remain for a screen reader. A tertiary
 *   action renders nothing on a narrow row and runs from the row's menu, which the action registers
 *   with. The row measures its own width, so a row beside an open sidebar folds on its own width
 *   and the caller does not write a breakpoint.
 */

/**
 * Attribute an action sets on itself while its own row is narrow.
 *
 * @remarks
 *   The action reads the state from its row's context, so a narrow ancestor folds no action of a
 *   wider row inside it. A bar fixed to the window is wider than the page around it in the
 *   document.
 */
export const NARROW = "data-narrow";

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
 *   Every action keeps its words on one line at every width, because a wrapped control would make
 *   the row taller. A secondary action hides its element children other than its icon with
 *   `srOnly`, so it keeps its accessible name, and renders as a square around its icon. Its words
 *   must be in an element, because a CSS selector cannot select a bare text node. A primary action
 *   is unchanged.
 */
export const FOLDING = {
  [`&[${PRIORITY}=secondary]`]: {
    [`&[${NARROW}]`]: {
      "& > :not(svg)": { srOnly: true },
      aspectRatio: "square",
      justifyContent: "center",
      paddingInline: "0",
    },
  },
  whiteSpace: "nowrap",
};
