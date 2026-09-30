/**
 * Exports the marquee's seven parts, composed as `Marquee.Root` around a viewport of copies, the
 * edges and the pause control, and the type of the pause's details.
 */

export type { PauseStatusDetails, Side } from "@zag-js/marquee";

export { Content, type ContentProps } from "#marquee/content.tsx";
export { Edge, type EdgeProps } from "#marquee/edge.tsx";
export { Item, type ItemProps } from "#marquee/item.tsx";
export { PauseIndicator, type PauseIndicatorProps } from "#marquee/pause-indicator.ts";
export { PauseTrigger, type PauseTriggerProps } from "#marquee/pause-trigger.tsx";
export { Root, type RootProps } from "#marquee/root.tsx";
export { Viewport, type ViewportProps } from "#marquee/viewport.tsx";
