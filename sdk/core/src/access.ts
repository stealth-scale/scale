/**
 * Declares the access model of a plugin: permissions, the resource kinds a permission is granted
 * on, roles and entitlements, and the checks a host makes on single resources.
 *
 * @remarks
 *   A permission's qualified id is the scope a service checks, so the page and the service cannot
 *   disagree about a name. No check the page makes is a security boundary.
 */

import { type MarkerOptions } from "#marker.ts";
import { type Reference } from "#reference.ts";

/**
 * Describes a kind of resource a permission is granted on, such as a request or an invoice.
 */
export interface ResourceOptions extends MarkerOptions {
  /**
   * Key of the resource kind's description in the plugin's catalogue.
   */
  readonly description: string;
}

/**
 * Describes a resource kind as its marker states it.
 */
export interface ResourceMarker extends ResourceOptions {
  /**
   * The kind of the marker.
   */
  readonly kind: "resource";
}

/**
 * Points at a resource kind a plugin declared.
 */
export interface ResourceReference<Id extends string = string>
  extends Partial<ResourceOptions>, Reference<"resource", Id> {}

/**
 * Records whether a permission is granted per resource, for the type checker.
 */
interface Scope<Scoped extends boolean> {
  /**
   * True for a permission granted on single resources of a kind.
   */
  readonly scoped: Scoped;
}

/**
 * Describes a permission: what it lets a person do, and the kind of resource it is granted on.
 */
export interface PermissionOptions<Scoped extends boolean = boolean> extends MarkerOptions {
  /**
   * Key of the permission's description in the plugin's catalogue. A role editor shows it.
   */
  readonly description: string;

  /**
   * Kind of resource the permission is granted on, one resource at a time. The permission applies
   * to the whole tenant where it names none.
   */
  readonly resource?: Scoped extends true ? ResourceReference : undefined;
}

/**
 * Describes a permission as its marker states it.
 */
export interface PermissionMarker<
  Scoped extends boolean = boolean,
> extends PermissionOptions<Scoped> {
  /**
   * Whether the permission is granted per resource, for the type checker alone.
   */
  readonly "~types"?: Scope<Scoped>;

  /**
   * The kind of the marker.
   */
  readonly kind: "permission";
}

/**
 * Points at a permission a plugin declared, with whether it is granted per resource in the type.
 */
export interface PermissionReference<Id extends string = string, Scoped extends boolean = boolean>
  extends Partial<PermissionOptions<Scoped>>, Reference<"permission", Id> {
  /**
   * Whether the permission is granted per resource, for the type checker alone.
   */
  readonly "~types"?: Scope<Scoped>;
}

/**
 * Describes a role: a named set of the plugin's own permissions that an access service offers as
 * one grant.
 */
export interface RoleOptions extends MarkerOptions {
  /**
   * Key of the role's description in the plugin's catalogue.
   */
  readonly description: string;

  /**
   * Permissions the role grants, each declared by the same contract.
   */
  readonly permissions: ReadonlyArray<Reference<"permission">>;
}

/**
 * Describes a role as its marker states it.
 */
export interface RoleMarker extends RoleOptions {
  /**
   * The kind of the marker.
   */
  readonly kind: "role";
}

/**
 * Points at a role a plugin declared.
 */
export interface RoleReference<Id extends string = string>
  extends Partial<RoleOptions>, Reference<"role", Id> {}

/**
 * Describes a capability a tenant is licensed for, such as a module or a feature of a plan.
 */
export interface EntitlementOptions extends MarkerOptions {
  /**
   * Key of the entitlement's description in the plugin's catalogue.
   */
  readonly description: string;
}

/**
 * Describes an entitlement as its marker states it.
 */
export interface EntitlementMarker extends EntitlementOptions {
  /**
   * The kind of the marker.
   */
  readonly kind: "entitlement";
}

/**
 * Points at an entitlement a plugin declared.
 */
export interface EntitlementReference<Id extends string = string>
  extends Partial<EntitlementOptions>, Reference<"entitlement", Id> {}

/**
 * Returns true, as a type, where a permission's options state a resource kind.
 */
type ScopedBy<O extends PermissionOptions> = O["resource"] extends ResourceReference ? true : false;

/**
 * Marks a permission. The marker records whether the permission is granted per resource.
 *
 * @param options - The description, and the resource kind of a permission granted per resource.
 * @returns The marker.
 */
export function permission<const O extends PermissionOptions>(
  options: O,
): PermissionMarker<ScopedBy<O>> {
  const marker: PermissionMarker = { ...options, kind: "permission" };

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the type parameter records whether the options state a resource, which the spread keeps
  return marker as PermissionMarker<ScopedBy<O>>;
}

/**
 * Marks a resource kind.
 *
 * @param options - The resource kind's description.
 * @returns The marker.
 */
export function resource(options: ResourceOptions): ResourceMarker {
  return { ...options, kind: "resource" };
}

/**
 * Marks a role.
 *
 * @param options - The role's description and the permissions it grants.
 * @returns The marker.
 */
export function role(options: RoleOptions): RoleMarker {
  return { ...options, kind: "role" };
}

/**
 * Marks an entitlement.
 *
 * @param options - The entitlement's description.
 * @returns The marker.
 */
export function entitlement(options: EntitlementOptions): EntitlementMarker {
  return { ...options, kind: "entitlement" };
}

/**
 * Identifies one resource by its kind's qualified id and its own id.
 */
export interface ResourceRef {
  /**
   * Id of the resource within its kind.
   */
  readonly id: string;

  /**
   * Qualified id of the resource kind: `time-off/request`.
   */
  readonly type: string;
}

/**
 * Describes one check: a scoped permission on one resource.
 */
export interface AccessCheck {
  /**
   * Qualified id of a scoped permission.
   */
  readonly permission: string;

  /**
   * The resource the permission is checked on.
   */
  readonly resource: ResourceRef;
}

/**
 * Decides checks on single resources for the session the host identified.
 */
export interface AccessSource {
  /**
   * Decides each check, in the order given. The host calls it with every check one task
   * requested.
   */
  readonly check: (checks: readonly AccessCheck[]) => Promise<readonly boolean[]>;

  /**
   * Calls the listener when earlier decisions may be out of date. Returns a function that stops the
   * calls.
   */
  readonly subscribe?: ((listener: () => void) => () => void) | undefined;
}

/**
 * Lists the states of one decision on a resource.
 */
export type AccessDecision = "allowed" | "denied" | "pending";

/**
 * Describes a decision the page already knows, from data a service returned.
 */
export interface KnownDecision extends AccessCheck {
  /**
   * True where the person has the permission on the resource.
   */
  readonly allowed: boolean;
}
