import { entitlement, permission, resource, role } from "#access.ts";
import { args, command, event } from "#command.ts";
import { defineConfigSchema } from "#config.ts";
import { defineMutation, defineQuery, mutation, query } from "#data.ts";
import { defineContract } from "#define.ts";
import { flag } from "#flag.ts";
import { params, route } from "#route.ts";
import { settingsPage, settingsSection } from "#settings.ts";
import { extension, props, slot } from "#slot.ts";

export interface Approval {
  readonly requestId: string;
}

export interface SidebarProps {
  readonly requestId: string;
}

export interface Request {
  readonly id: string;
  readonly status: "approved" | "open";
}

export const REQUEST = defineQuery<Request, { readonly id: string }>("time-off~1~a1c2");

export const APPROVE = defineMutation<Request, Approval>("time-off~1~b3d4");

export const OPEN: Request = { id: "7", status: "open" };

export const timeOffContract = defineContract("time-off", (self) => ({
  commands: {
    approve: command({
      ...args<Approval>(),
      label: "commands.approve",
      sample: { requestId: "7" },
      when: { permission: self.permission("request.approve") },
    }),
    request: command({ keys: "Mod+Shift+R", label: "commands.request" }),
  },
  config: defineConfigSchema({
    approvers: { default: 1, description: "config.approvers", type: "number" },
  }),
  entitlements: { module: entitlement({ description: "entitlements.module" }) },
  events: { approved: event<Approval>(), refreshed: event() },
  extensions: {
    balance: extension({ position: "after", target: self.slot("request-sidebar") }),
  },
  featureFlags: {
    calendar: flag({
      default: false,
      description: "flags.calendar",
      expires: "2026-12-31",
      kind: "release",
    }),
  },
  menus: ["reports"],
  mutations: {
    approve: mutation({
      operation: APPROVE,
      sample: { data: OPEN, variables: { requestId: "7" } },
    }),
  },
  permissions: {
    "request.approve": permission({
      description: "permissions.approve",
      resource: self.resource("request"),
    }),
    "request.read": permission({ description: "permissions.read" }),
  },
  queries: {
    request: query({ operation: REQUEST, sample: { data: OPEN, variables: { id: "7" } } }),
  },
  resources: { request: resource({ description: "resources.request" }) },
  roles: {
    approver: role({
      description: "roles.approver",
      permissions: [self.permission("request.approve"), self.permission("request.read")],
    }),
  },
  routes: {
    overview: route({
      navigation: { label: "navigation.overview", menu: self.menu("reports") },
      path: "time-off",
    }),
    request: route({
      ...params<{ readonly id: string }>(),
      parent: self.route("overview"),
      path: "$id",
      sample: { id: "7" },
    }),
  },
  settings: {
    pages: { "time-off": settingsPage({ label: "settings.title", order: 40 }) },
    sections: {
      reminders: settingsSection({
        label: "settings.reminders",
        target: self.settingsPage("time-off"),
      }),
    },
  },
  slots: {
    "request-sidebar": slot({ ...props<SidebarProps>(), sample: { requestId: "7" } }),
  },
  version: "0.4.0",
}));
