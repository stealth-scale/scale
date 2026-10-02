import { entitlement, permission, resource, role } from "#access.ts";
import { timeOffContract } from "#define.fixtures.ts";
import { defineContract } from "#define.ts";
import { manifestOf } from "#resolve/resolve.fixtures.ts";

export const retired = manifestOf(
  defineContract("retired", (self) => ({
    entitlements: {
      archive: entitlement({ deprecated: "use plans", description: "entitlements.archive" }),
    },
    permissions: {
      "file.read": permission({
        deprecated: "use file.view",
        description: "permissions.read",
        resource: self.resource("file"),
      }),
    },
    resources: { file: resource({ deprecated: "use document", description: "resources.file" }) },
    roles: {
      reader: role({
        deprecated: "use viewer",
        description: "roles.reader",
        permissions: [self.permission("file.read")],
      }),
    },
  })),
);

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
