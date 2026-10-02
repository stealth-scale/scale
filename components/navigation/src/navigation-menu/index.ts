/**
 * Exports the navigation menu's parts, composed as `NavigationMenu.Root` around a list of items,
 * each a trigger and its panel or a link, with an indicator and a shared viewport, and the type
 * `onValueChange` receives.
 */

export { Content, type ContentProps } from "#navigation-menu/content.tsx";
export { Indicator, type IndicatorProps } from "#navigation-menu/indicator.tsx";
export { Item, type ItemProps } from "#navigation-menu/item.tsx";
export { Link, type LinkProps } from "#navigation-menu/link.tsx";
export { List, type ListProps } from "#navigation-menu/list.tsx";
export { type ValueChangeDetails } from "#navigation-menu/machine.ts";
export { Root, type RootProps } from "#navigation-menu/root.tsx";
export { Trigger, type TriggerProps } from "#navigation-menu/trigger.tsx";
export {
  ViewportPositioner,
  type ViewportPositionerProps,
} from "#navigation-menu/viewport-positioner.tsx";
export { Viewport, type ViewportProps } from "#navigation-menu/viewport.tsx";
