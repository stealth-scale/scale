import { timeOffContract } from "#define.fixtures.ts";
import { defineContract } from "#define.ts";
import { manifestOf } from "#resolve/resolve.fixtures.ts";

export const grants = manifestOf(
  defineContract("grants", {
    permissions: {
      "invoice.pay": {
        description: "permissions.pay",
        kind: "permission",
        resource: { id: "billing/invoice", kind: "resource" },
      },
    },
    roles: {
      empty: { description: "roles.empty", kind: "role", permissions: [] },
      mixed: {
        description: "roles.mixed",
        kind: "role",
        permissions: [timeOffContract.permissions["request.read"]],
      },
    },
  }),
);
