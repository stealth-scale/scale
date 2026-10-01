import { describe, expect, it } from "vitest";

import { timeOff } from "#product.fixtures.ts";
import { installed } from "#product.ts";
import { grants } from "#resolve/access.fixtures.ts";
import { resolveAccess } from "#resolve/access.ts";
import { report } from "#resolve/problem.ts";
import { contextFor, faultsOf, productOf } from "#resolve/resolve.fixtures.ts";

describe("access", () => {
  it("passes the access declarations of an installed plugin", () => {
    expect(faultsOf(resolveAccess, contextFor(productOf([installed(timeOff)])))).toStrictEqual({
      problems: [],
      warnings: [],
    });
  });

  it.each([
    "grants.permissions.invoice.pay.resource: names the resource billing/invoice, whose plugin is not installed",
    "grants.roles.empty.permissions: names no permission",
    "grants.roles.mixed.permissions.0: names time-off/request.read, a permission of another plugin",
  ])("reports %s", (line) => {
    const context = contextFor(productOf([installed(timeOff), installed(grants)]));

    expect(faultsOf(resolveAccess, context).problems).toContain(line);
  });

  it("resolves every access declaration by its qualified id", () => {
    const access = resolveAccess(contextFor(productOf([installed(timeOff)])), report());

    expect(access).toStrictEqual({
      entitlements: [
        { description: "entitlements.module", id: "time-off/module", plugin: "time-off" },
      ],
      permissions: [
        {
          description: "permissions.approve",
          id: "time-off/request.approve",
          plugin: "time-off",
          resource: "time-off/request",
        },
        {
          description: "permissions.read",
          id: "time-off/request.read",
          plugin: "time-off",
          resource: undefined,
        },
      ],
      resources: [{ description: "resources.request", id: "time-off/request", plugin: "time-off" }],
      roles: [
        {
          description: "roles.approver",
          id: "time-off/approver",
          permissions: ["time-off/request.approve", "time-off/request.read"],
          plugin: "time-off",
        },
      ],
    });
  });
});
