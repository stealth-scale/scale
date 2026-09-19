/**
 * Publishes the table of contents' six parts, which a caller composes as `Toc.Root` holding a
 * title and a list of one row per heading, with the indicator as the list's first child.
 */

export { Indicator, type IndicatorProps } from "#toc/indicator.tsx";
export { Item, type ItemProps } from "#toc/item.tsx";
export { Link, type LinkProps } from "#toc/link.tsx";
export { List, type ListProps } from "#toc/list.tsx";
export { type TocItem } from "#toc/machine.ts";
export { Root, type RootProps } from "#toc/root.tsx";
export { Title, type TitleProps } from "#toc/title.tsx";
