/**
 * Exports the carousel's parts, composed as `Carousel.Root` around the scroller with its slides and
 * a control row with the triggers, the dots, the rotation control and the progress text, and the
 * types of the machine's callbacks.
 */

export {
  type AutoplayStatusDetails,
  type DragStatusDetails,
  type PageChangeDetails,
  type ProgressTextDetails,
} from "@zag-js/carousel";

export { AutoplayIndicator, type AutoplayIndicatorProps } from "#carousel/autoplay-indicator.ts";
export { AutoplayTrigger, type AutoplayTriggerProps } from "#carousel/autoplay-trigger.tsx";
export { Control, type ControlProps } from "#carousel/control.tsx";
export { IndicatorGroup, type IndicatorGroupProps } from "#carousel/indicator-group.tsx";
export { Indicator, type IndicatorProps } from "#carousel/indicator.tsx";
export { Indicators, type IndicatorsProps } from "#carousel/indicators.tsx";
export { ItemGroup, type ItemGroupProps } from "#carousel/item-group.tsx";
export { Item, type ItemProps } from "#carousel/item.tsx";
export { NextTrigger, type NextTriggerProps } from "#carousel/next-trigger.tsx";
export { PrevTrigger, type PrevTriggerProps } from "#carousel/prev-trigger.tsx";
export { ProgressText, type ProgressTextProps } from "#carousel/progress-text.tsx";
export { Root, type RootProps } from "#carousel/root.tsx";
