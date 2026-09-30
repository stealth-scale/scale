/**
 * Exports the switcher's eight parts and the `Choice` it lists. A caller passes `items` to
 * `Switcher.Root`, or composes the control inside it beside the menu's own positioner and content.
 */

export { Action, type ActionProps } from "#switcher/action.tsx";
export { type Choice } from "#switcher/choice.ts";
export { Detail, type DetailProps } from "#switcher/detail.ts";
export { Indicator, type IndicatorProps } from "#switcher/indicator.ts";
export { Label, type LabelProps } from "#switcher/label.ts";
export { Mark, type MarkProps } from "#switcher/mark.ts";
export { Name, type NameProps } from "#switcher/name.ts";
export { Root, type RootProps } from "#switcher/root.tsx";
export { type Placement, type SwitcherSize } from "#switcher/state.ts";
export { Trigger, type TriggerProps } from "#switcher/trigger.tsx";
