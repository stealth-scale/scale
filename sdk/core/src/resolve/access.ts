/**
 * Checks every permission's resource kind and every role's permissions, and resolves the access
 * declarations the access catalogue lists.
 *
 * @remarks
 *   A role groups permissions of its own contract, because a grant across plugins is the access
 *   service's to make.
 */

import { pluginOf } from "#identifiers.ts";
import { isInstalled, pathOf, type ResolveContext } from "#resolve/context.ts";
import { declarationsOf } from "#resolve/declared.ts";
import { type Report } from "#resolve/problem.ts";
import {
  type ResolvedName,
  type ResolvedPermission,
  type ResolvedRole,
} from "#resolve/resolved.ts";

/**
 * Describes the access declarations the build resolved.
 */
export interface Accessed {
  /**
   * Every entitlement.
   */
  readonly entitlements: readonly ResolvedName[];

  /**
   * Every permission.
   */
  readonly permissions: readonly ResolvedPermission[];

  /**
   * Every resource kind.
   */
  readonly resources: readonly ResolvedName[];

  /**
   * Every role.
   */
  readonly roles: readonly ResolvedRole[];
}

/**
 * Checks every permission and role, and resolves every permission, resource kind, role and
 * entitlement.
 *
 * @param context - The installed plugins, every declared name and the build's options.
 * @param report - The report the faults go into.
 */
export function resolveAccess(context: ResolveContext, report: Report): Accessed {
  const permissions = declarationsOf(context, "permission");
  const roles = declarationsOf(context, "role");

  for (const declaration of permissions) {
    const { resource } = declaration.reference;

    if (resource !== undefined && !isInstalled(context, pluginOf(resource.id))) {
      report.problem(
        `${pathOf(declaration)}.resource`,
        `names the resource ${resource.id}, whose plugin is not installed`,
      );
    }
  }

  for (const declaration of roles) {
    const at = `${pathOf(declaration)}.permissions`;

    if (declaration.reference.permissions.length === 0) report.problem(at, "names no permission");

    for (const [index, permission] of declaration.reference.permissions.entries()) {
      if (pluginOf(permission.id) !== declaration.plugin) {
        report.problem(
          `${at}.${String(index)}`,
          `names ${permission.id}, a permission of another plugin`,
        );
      }
    }
  }

  return {
    entitlements: declarationsOf(context, "entitlement").map(({ plugin, reference }) => ({
      description: reference.description,
      id: reference.id,
      plugin,
    })),
    permissions: permissions.map(({ plugin, reference }) => ({
      description: reference.description,
      id: reference.id,
      plugin,
      resource: reference.resource?.id,
    })),
    resources: declarationsOf(context, "resource").map(({ plugin, reference }) => ({
      description: reference.description,
      id: reference.id,
      plugin,
    })),
    roles: roles.map(({ plugin, reference }) => ({
      description: reference.description,
      id: reference.id,
      permissions: reference.permissions.map((one) => one.id),
      plugin,
    })),
  };
}
