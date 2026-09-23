/**
 * Exports the six parts of the table of contents, composed as `Toc.Root` around a `Toc.Title` and
 * a `Toc.List` whose first child is `Toc.Indicator`.
 */

export { Indicator, type IndicatorProps } from "#toc/indicator.tsx";
export { Item, type ItemProps } from "#toc/item.tsx";
export { Link, type LinkProps } from "#toc/link.tsx";
export { List, type ListProps } from "#toc/list.tsx";
export { type TocItem } from "#toc/machine.ts";
export { Root, type RootProps } from "#toc/root.tsx";
export { Title, type TitleProps } from "#toc/title.tsx";
