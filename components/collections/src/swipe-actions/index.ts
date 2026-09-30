/**
 * Exports the swipe actions' four parts, composed as `SwipeActions.Root` around the row's content
 * and its actions, and the rule a released swipe settles by.
 */

export { Action, type ActionProps } from "#swipe-actions/action.tsx";
export { Actions, type ActionsProps } from "#swipe-actions/actions.tsx";
export { Content, type ContentProps } from "#swipe-actions/content.tsx";
export { Root, type RootProps } from "#swipe-actions/root.tsx";
export { settleSwipe } from "#swipe-actions/settle.ts";
