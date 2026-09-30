/**
 * Exports the timeline, which a caller composes as a `Timeline.Root` containing one
 * `Timeline.Item` per entry, each with a `Timeline.Connector` around a `Timeline.Indicator` and a
 * `Timeline.Content` of a `Timeline.Title` and a `Timeline.Description` on either side.
 */

export { Connector, type ConnectorProps } from "#timeline/connector.ts";
export { Content, type ContentProps } from "#timeline/content.ts";
export { Description, type DescriptionProps } from "#timeline/description.ts";
export { Indicator, type IndicatorProps } from "#timeline/indicator.ts";
export { Item, type ItemProps } from "#timeline/item.ts";
export { Root, type RootProps } from "#timeline/root.ts";
export { Title, type TitleProps } from "#timeline/title.ts";
