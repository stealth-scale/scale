import {
  args,
  command,
  defineConfigSchema,
  defineContract,
  defineMutation,
  definePlugin,
  defineProduct,
  defineQuery,
  entitlement,
  event,
  extension,
  flag,
  installed,
  type InstalledPlugin,
  mutation,
  params,
  permission,
  type PluginPackage,
  type Product,
  props,
  query,
  resolveProduct,
  resource,
  returns,
  route,
  settingsPage,
  settingsSection,
  slot,
  type TargetedProps,
} from "@stealthscale/sdk-core";

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
    pick: command({ ...returns<string>(), label: "commands.pick" }),
    request: command({ keys: "Mod+Shift+R", label: "commands.request" }),
  },
  config: defineConfigSchema({
    approvers: { default: 1, description: "config.approvers", type: "number" },
    region: { description: "config.region", type: "string" },
  }),
  entitlements: { module: entitlement({ description: "entitlements.module" }) },
  events: {
    approved: event<Approval>(),
    opened: event<{ readonly id: string }>({ emit: "anyone", sticky: true }),
  },
  featureFlags: {
    calendar: flag({
      default: false,
      description: "flags.calendar",
      expires: "2026-12-31",
      kind: "release",
    }),
    layout: flag({
      default: "list",
      description: "flags.layout",
      expires: "2026-12-31",
      kind: "experiment",
      variants: ["list", "board"],
    }),
  },
  menus: ["tabs"],
  mutations: {
    approve: mutation({
      changes: [{ action: "updated", id: "requestId", type: self.resource("request") }],
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
    request: query({
      operation: REQUEST,
      records: [{ id: "id", type: self.resource("request") }],
      sample: { data: OPEN, variables: { id: "7" } },
      staleTime: 5000,
    }),
  },
  resources: { request: resource({ description: "resources.request" }) },
  routes: {
    calendar: route({
      navigation: { label: "navigation.calendar" },
      parent: self.route("overview"),
      path: "calendar",
    }),
    history: route({
      navigation: { label: "navigation.history", menu: self.menu("tabs") },
      parent: self.route("overview"),
      path: "history",
    }),
    overview: route({ navigation: { label: "navigation.overview", order: 2 }, path: "time-off" }),
    request: route({
      ...params<{ readonly id: string }>(),
      parent: self.route("overview"),
      path: "$id",
      sample: { id: "7" },
    }),
  },
  settings: {
    pages: { "time-off": settingsPage({ label: "settings.title" }) },
    sections: {
      reminders: settingsSection({
        label: "settings.reminders.title",
        schema: {
          additionalProperties: false,
          properties: {
            channel: { default: "email", enum: ["email", "chat"], type: "string" },
            days: { default: 2, maximum: 14, minimum: 0, type: "integer" },
          },
          type: "object",
        },
        schemaVersion: 2,
        target: self.settingsPage("time-off"),
      }),
    },
  },
  slots: {
    "request-sidebar": slot({ ...props<SidebarProps>(), sample: { requestId: "7" } }),
  },
  version: "0.4.0",
}));

export const billingContract = defineContract("billing", () => ({
  extensions: {
    total: extension({ position: "after", target: timeOffContract.slots["request-sidebar"] }),
  },
  routes: {
    invoices: route({ navigation: { label: "navigation.invoices", order: 1 }, path: "invoices" }),
    reports: route({
      navigation: { label: "navigation.reports" },
      path: "reports",
      when: { authenticated: true },
    }),
  },
  version: "1.2.0",
}));

export function lazy<Module>(module: Module): () => Promise<Module> {
  return () => Promise.resolve(module);
}

export function page(): string {
  return "page";
}

export function total(given: SidebarProps & TargetedProps): string {
  return `total ${given.requestId}`;
}

export function run(): void {}

export function picked(): string {
  return "Ada";
}

export const timeOff = definePlugin(timeOffContract, {
  commands: {
    approve: { run: lazy({ run }) },
    pick: { run: lazy({ picked }) },
    request: { run: lazy({ run }) },
  },
  routes: {
    calendar: lazy({ page }),
    history: lazy({ page }),
    overview: lazy({ page }),
    request: lazy({ page }),
  },
  settings: { reminders: { migrations: { 1: (values) => ({ ...values, channel: "email" }) } } },
});

export const billing = definePlugin(billingContract, {
  extensions: { total: { component: lazy({ total }) } },
  routes: { invoices: lazy({ page }), reports: lazy({ page }) },
});

export const PACKAGES = {
  billing: { directory: "/plugins/billing", name: "@acme/plugin-billing" },
  "time-off": { directory: "/plugins/time-off", name: "@acme/plugin-time-off" },
};

export function productOf(
  plugins: readonly InstalledPlugin[],
  packages: Readonly<Record<string, PluginPackage>> = PACKAGES,
): Product {
  const definition = defineProduct({
    name: "product.name",
    plugins,
    productId: "people",
    version: "2026.10.1",
  });
  const { problems, product } = resolveProduct(definition, packages, { today: "2026-10-01" });

  if (product === undefined) {
    throw new Error(problems.map(({ path, reason }) => `${path}: ${reason}`).join("\n"));
  }

  return {
    ...product,
    manifests: Object.fromEntries(
      plugins.map((one) => [one.manifest.contract.pluginId, one.manifest]),
    ),
  };
}

export const PRODUCT = productOf([
  installed(timeOff, { config: { approvers: 3, region: "eu" } }),
  installed(billing),
]);
