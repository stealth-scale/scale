/**
 * Exports the tabs' six parts, composed as `Tabs.Root` around a list of tabs and a panel for each,
 * and the rule a close moves the selection by.
 */

export { CloseTrigger, type CloseTriggerProps } from "#tabs/close-trigger.tsx";
export { type CloseDetails, selectionAfterClose } from "#tabs/closing.ts";
export { Content, type ContentProps } from "#tabs/content.tsx";
export { Indicator, type IndicatorProps } from "#tabs/indicator.tsx";
export { List, type ListProps } from "#tabs/list.tsx";
export { Root, type RootProps } from "#tabs/root.tsx";
export { Trigger, type TriggerProps } from "#tabs/trigger.tsx";
