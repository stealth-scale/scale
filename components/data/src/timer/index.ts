/**
 * Exports the timer's parts, composed as `Timer.Root` around `Timer.Area` with its items and
 * separators and `Timer.Control` with its action triggers, and the types their props name.
 */

export { parse, type Time, type TimePart, type TimerAction } from "@zag-js/timer";

export { ActionTrigger, type ActionTriggerProps } from "#timer/action-trigger.tsx";
export { Area, type AreaProps } from "#timer/area.tsx";
export { Control, type ControlProps } from "#timer/control.tsx";
export { Item, type ItemProps } from "#timer/item.tsx";
export { Root, type RootProps } from "#timer/root.tsx";
export { Separator, type SeparatorProps } from "#timer/separator.tsx";
