/**
 * Exports how a row of actions folds: the styles, the priorities, the registration and the menu.
 *
 * @remarks
 *   A recipe imports `FOLDING` from `folding.ts` and not from this module. The theme plugin
 *   evaluates the recipes in Node, and the menu and the registration here import React.
 */

export {
  type Entry,
  type Fold,
  FoldContext,
  type FoldedAction,
  useFoldable,
  useFolded,
} from "#folding/fold.ts";
export { FOLDING, NARROW, PRIORITY } from "#folding/folding.ts";
export { More, type MoreProps } from "#folding/more.tsx";
export { PRIORITIES, type Priority, priorityOf } from "#folding/priority.ts";
export { Trigger, type TriggerProps } from "#folding/trigger.tsx";
