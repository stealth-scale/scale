import { type AccessCheck, type PermissionReference, type Session } from "@stealthscale/sdk-core";

import { decisionKey } from "#access/decisions.ts";
import { ADA } from "#host/host.fixtures.tsx";
import { timeOffContract } from "#host/product.fixtures.ts";
import { type AccessState, type SessionState } from "#host/stores.ts";

export const APPROVE = timeOffContract.permissions["request.approve"];

export const CHECK: AccessCheck = {
  permission: APPROVE.id,
  resource: { id: "7", type: timeOffContract.resources.request.id },
};

export const READER: Session = {
  ...ADA,
  permissions: [timeOffContract.permissions["request.read"].id],
};

export const UNDECLARED: PermissionReference<"payroll/run.approve", true> = {
  id: "payroll/run.approve",
  kind: "permission",
};

export function decided(allowed: boolean): AccessState {
  return { decisions: new Map([[decisionKey(CHECK), allowed]]), source: true };
}

export function undecided(source: boolean): AccessState {
  return { decisions: new Map(), source };
}

export function sessionWith(permissions: readonly string[]): SessionState {
  return { entitlements: new Set(), permissions: new Set(permissions), session: ADA };
}
