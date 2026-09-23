/**
 * Writes the styles a row of actions folds by, which the page, the toolbar and the section share.
 *
 * @remarks
 *   Folding is three rules and no JavaScript. A primary action keeps its words at every width. A
 *   secondary one keeps its mark and reads its words to a screen reader alone. A tertiary one
 *   leaves the row, and whatever the row keeps for the actions it drops holds it instead.
 *   The rules are written against `data-narrow`, which the row measures on itself, so a row beside
 *   an open sidebar folds on its own width rather than the window's and a consumer writes no
 *   breakpoint.
 *   The source this was ported from did it the other way round: an action registered itself into a
 *   menu the row held, from an effect, and the row kept that list in state. React 19 reports state
 *   written from an effect, and the list arrived one render after the row was drawn, so the menu
 *   filled in after it opened. Nothing here writes state and nothing measures an action.
 */

/**
 * Selects a part inside a row that has measured itself as narrow.
 */
const NARROW = "[data-narrow] &";

/**
 * The attribute an action states how much it matters in.
 *
 * @remarks
 *   An attribute rather than an axis of the recipe. A slot recipe's variants are set on the root
 *   and read by every part, so an axis would fold every action in a row the same way. Each one has
 *   to say for itself.
 */
export const PRIORITY = "data-priority";

/**
 * Writes what a narrow row does with an action, read off the priority the action states.
 *
 * @remarks
 *   Every action keeps its words on one line at every width, because the row gives way around them
 *   and a control that wrapped would be the thing that made the row taller.
 *   A secondary action keeps its words in the document under `srOnly` rather than dropping them,
 *   because a control with no accessible name is one a screen reader cannot announce. It is drawn
 *   as a square around whatever mark it keeps, so the row it folds into is a row of equal marks
 *   rather than of controls at whatever width their padding left them.
 *   `srOnly` is written on the action's element children, so a secondary action states its words in
 *   an element. A bare text node is not selectable, and one written straight into the control was
 *   left drawn beside the mark with the folded control on top of it.
 *   A tertiary action leaves the document rather than being hidden, so a keyboard does not reach a
 *   control nobody can see. A primary one states nothing and is left alone.
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
 * Writes what the control a row keeps for the actions it drops is drawn with.
 *
 * @remarks
 *   It appears only where the row is narrow, because a row keeping every action has nothing to put
 *   behind it.
 */
export const FOLDED = { display: "none", [NARROW]: { display: "inline-flex" } };
