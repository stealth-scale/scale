import { describe, expect, expectTypeOf, it } from "vitest";

import {
  entitlement,
  permission,
  type PermissionMarker,
  type PermissionReference,
  resource,
  type ResourceReference,
  role,
} from "#access.ts";

const REQUEST: ResourceReference = { id: "time-off/request", kind: "resource" };

const READ: PermissionReference = { id: "time-off/request.read", kind: "permission" };

describe("access", () => {
  it("marks a permission for the whole tenant", () => {
    const read = permission({ description: "permissions.read" });

    expect(read).toStrictEqual({ description: "permissions.read", kind: "permission" });

    expectTypeOf(read).toEqualTypeOf<PermissionMarker<false>>();
  });

  it("marks a permission granted per resource", () => {
    const approve = permission({ description: "permissions.approve", resource: REQUEST });

    expect(approve).toStrictEqual({
      description: "permissions.approve",
      kind: "permission",
      resource: REQUEST,
    });

    expectTypeOf(approve).toEqualTypeOf<PermissionMarker<true>>();
  });

  it("marks a resource kind", () => {
    expect(resource({ description: "resources.request" })).toStrictEqual({
      description: "resources.request",
      kind: "resource",
    });
  });

  it("marks a role with the permissions it grants", () => {
    expect(role({ description: "roles.reader", permissions: [READ] })).toStrictEqual({
      description: "roles.reader",
      kind: "role",
      permissions: [READ],
    });
  });

  it("marks an entitlement", () => {
    expect(
      entitlement({ deprecated: "entitlements.plan", description: "entitlements.module" }),
    ).toStrictEqual({
      deprecated: "entitlements.plan",
      description: "entitlements.module",
      kind: "entitlement",
    });
  });
});
