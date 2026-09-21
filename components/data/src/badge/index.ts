/**
 * Forms the public surface of the badge, renaming the props provider so that it stays unambiguous
 * among the providers other components publish.
 */

export { Badge, type BadgeProps } from "#badge/badge.ts";
export { PropsProvider as BadgePropsProvider } from "#badge/context.ts";
