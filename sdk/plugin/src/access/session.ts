/**
 * Reads the session and its grants in a component.
 *
 * @remarks
 *   Each hook selects one value from the host's session store, so a change of session renders a
 *   component again only where its own value changed.
 */

import {
  type EntitlementReference,
  type PermissionReference,
  type Session,
} from "@stealthscale/sdk-core";

import { useHost } from "#host/use-host.ts";
import { useSelector } from "#host/use-selector.ts";

/**
 * Returns the session the host keeps, and renders again when the session changes.
 */
export function useSession(): Session {
  const { session } = useHost("useSession").stores;

  return useSelector([session], () => session.get().session);
}

/**
 * Returns true where the session has the permission, for the whole tenant or on at least one
 * resource.
 *
 * @remarks
 *   The match is exact: a permission has no wildcard and no hierarchy, because a service's check
 *   has neither. `useAccess` decides a scoped permission on one resource.
 */
export function usePermission(permission: PermissionReference): boolean {
  const { session } = useHost("usePermission").stores;

  return useSelector([session], () => session.get().permissions.has(permission.id));
}

/**
 * Returns true where the session's tenant is licensed for the entitlement.
 */
export function useEntitlement(entitlement: EntitlementReference): boolean {
  const { session } = useHost("useEntitlement").stores;

  return useSelector([session], () => session.get().entitlements.has(entitlement.id));
}
