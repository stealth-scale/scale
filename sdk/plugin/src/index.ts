/**
 * Renders what plugins contribute to a product's slots, and reads the host's state in a plugin's
 * components: sessions, access, flags, commands, events, settings and data.
 *
 * A plugin's components import this package and never the host, so a component renders the same
 * under a product's host and under a test's.
 *
 * @packageDocumentation
 */

export * from "#access/decisions.ts";
export * from "#access/session.ts";
export * from "#commands/commands.ts";
export * from "#conditions/context.ts";
export * from "#conditions/use-when.ts";
export * from "#data/changes.ts";
export * from "#data/data.ts";
export * from "#events/events.ts";
export * from "#flags/flags.ts";
export * from "#host/readers.ts";
export * from "#host/report.ts";
export * from "#host/runtime.ts";
export * from "#host/stores.ts";
export * from "#navigation/menus.ts";
export * from "#navigation/title.ts";
export * from "#scope/context.ts";
export * from "#scope/provider.tsx";
export * from "#scope/use-config.ts";
export * from "#settings/placements.ts";
export * from "#settings/settings.ts";
export * from "#slots/boundary.ts";
export * from "#slots/dropped.ts";
export * from "#slots/into.ts";
export * from "#slots/lazy.ts";
export * from "#slots/props.ts";
export * from "#slots/route-decorations.tsx";
export * from "#slots/slot.tsx";
export * from "#slots/statuses.ts";
export * from "#slots/use-slot.ts";
export * from "#status/plugins.ts";
export * from "#status/reports.ts";
