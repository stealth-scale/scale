/**
 * Checks and resolves every declaration, in the order the host plans over them: the routes, the
 * slots and extensions, the commands and events, the access declarations, the data, the flags and
 * the settings.
 */

import { resolveAccess } from "#resolve/access.ts";
import { resolveCommands } from "#resolve/commands.ts";
import { type ResolveContext } from "#resolve/context.ts";
import { resolveData } from "#resolve/data.ts";
import { resolveFlags } from "#resolve/flags.ts";
import { type Report } from "#resolve/problem.ts";
import { type ResolvedProduct } from "#resolve/resolved.ts";
import { checkRoutes, resolveRoutes } from "#resolve/routes.ts";
import { resolveSettings } from "#resolve/settings.ts";
import { resolveSlots } from "#resolve/slots.ts";

/**
 * Describes the declarations the build resolved: every member of the resolved product but the
 * product's own and the plugins.
 */
export type Declarations = Omit<
  ResolvedProduct,
  "name" | "plugins" | "productId" | "signIn" | "version" | "warnings" | "when"
>;

/**
 * Checks and resolves every declaration.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 */
export function resolveDeclarations(context: ResolveContext, report: Report): Declarations {
  checkRoutes(context, report);

  const placed = resolveSlots(context, report);
  const { commands, events } = resolveCommands(context, report);
  const access = resolveAccess(context, report);
  const { mutations, queries } = resolveData(context, report);
  const flags = resolveFlags(context, report);
  const settings = resolveSettings(context, report);

  return {
    ...access,
    commands,
    events,
    extensions: placed.extensions,
    flags,
    mutations,
    queries,
    routes: resolveRoutes(context, placed),
    settings,
    slots: placed.slots,
  };
}
