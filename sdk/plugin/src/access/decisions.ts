/**
 * Reads decisions on single resources in a component, and records decisions a service returned.
 *
 * @remarks
 *   A decision is advisory. The page offers what the person may do, and the service behind each
 *   action refuses the rest.
 */

import { useEffect } from "react";

import {
  type AccessCheck,
  type AccessDecision,
  type KnownDecision,
  type PermissionReference,
  type ResourceRef,
} from "@stealthscale/sdk-core";

import { type AccessState, type SessionState } from "#host/stores.ts";
import { useHost } from "#host/use-host.ts";
import { useSelector } from "#host/use-selector.ts";

/**
 * Lists what a component may do to the host's decisions.
 */
export interface AccessActions {
  /**
   * Drops the decisions on a resource, or every decision where it names none, so the next read asks
   * again.
   */
  readonly forget: (resource?: ResourceRef) => void;

  /**
   * Records decisions a service returned with its data, so no check is sent for them.
   */
  readonly prime: (decisions: readonly KnownDecision[]) => void;
}

/**
 * Returns the key the host's access store keeps a check's decision under.
 *
 * @remarks
 *   Two checks share a key only where the permission, the resource kind and the resource id are all
 *   equal, whatever characters an id contains.
 */
export function decisionKey({ permission, resource }: AccessCheck): string {
  return JSON.stringify([resource.type, resource.id, permission]);
}

/**
 * Returns the decision the stores determine without the access source: a known decision, `denied`
 * where the session lacks the permission, `allowed` where the product gave the host no source, and
 * `pending` otherwise.
 */
function decide(access: AccessState, session: SessionState, check: AccessCheck): AccessDecision {
  const known = access.decisions.get(decisionKey(check));

  if (known !== undefined) return known ? "allowed" : "denied";

  if (!session.permissions.has(check.permission)) return "denied";

  return access.source ? "pending" : "allowed";
}

/**
 * Returns the decision on one resource, and renders again when it changes.
 *
 * @remarks
 *   A pending decision asks the host to check after the render commits. The host sends every check
 *   one task requested in one call. A permission no installed plugin declares is `denied`, as the
 *   host ignores it in the session.
 * @param permission - A permission granted per resource. `usePermission` reads one for the whole
 *   tenant.
 * @param resourceId - Id of the resource within the permission's resource kind.
 */
export function useAccess(
  permission: PermissionReference<string, true>,
  resourceId: string,
): AccessDecision {
  const { product, stores } = useHost("useAccess");
  const { access, session } = stores;
  const type = product.permissions.find(({ id }) => id === permission.id)?.resource;
  const decision = useSelector([access, session], () =>
    type === undefined
      ? "denied"
      : decide(access.get(), session.get(), {
          permission: permission.id,
          resource: { id: resourceId, type },
        }),
  );

  useEffect(() => {
    if (type !== undefined && decision === "pending") {
      access.request({ permission: permission.id, resource: { id: resourceId, type } });
    }
  }, [access, decision, permission.id, resourceId, type]);

  return decision;
}

/**
 * Returns the actions on the host's decisions.
 */
export function useAccessActions(): AccessActions {
  const { access } = useHost("useAccessActions").stores;

  return {
    forget: (resource) => {
      access.forget(resource);
    },
    prime: (decisions) => {
      access.prime(decisions);
    },
  };
}
