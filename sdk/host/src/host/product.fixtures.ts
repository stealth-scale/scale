import {
  args,
  command,
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
  needs,
  params,
  permission,
  type PluginPackage,
  type Product,
  type ProductDefinition,
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
      decisions: [
        { field: "approvable", id: "id", permission: self.permission("request.approve") },
      ],
      operation: REQUEST,
      records: [{ id: "id", type: self.resource("request") }],
      sample: { data: OPEN, variables: { id: "7" } },
    }),
  },
  resources: { request: resource({ description: "resources.request" }) },
  routes: {
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
  featureFlags: {
    sync: flag({ default: true, description: "flags.sync", kind: "ops" }),
  },
  permissions: { "invoice.read": permission({ description: "permissions.read" }) },
  routes: {
    invoices: route({ navigation: { label: "navigation.invoices", order: 1 }, path: "invoices" }),
  },
  version: "1.2.0",
}));

export const payrollContract = defineContract("payroll", () => ({
  commands: {
    summarize: command({ ...returns<string>(), label: "commands.summarize" }),
  },
  requires: [needs(timeOffContract, "^0.4.0")],
  routes: { runs: route({ navigation: { label: "navigation.runs" }, path: "payroll" }) },
  version: "0.1.0",
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

export async function summarized(
  _args: unknown,
  needed: { readonly pick: () => Promise<string> },
): Promise<string> {
  return `summary for ${await needed.pick()}`;
}

export const timeOff = definePlugin(timeOffContract, {
  commands: {
    approve: { run: lazy({ run }) },
    pick: { run: lazy({ picked }) },
    request: { run: lazy({ run }) },
  },
  routes: { overview: lazy({ page }), request: lazy({ page }) },
});

export const billing = definePlugin(billingContract, {
  extensions: { total: { component: lazy({ total }) } },
  routes: { invoices: lazy({ page }) },
});

export const payroll = definePlugin(payrollContract, {
  commands: {
    summarize: { needs: { pick: timeOffContract.commands.pick }, run: lazy({ summarized }) },
  },
  routes: { runs: lazy({ page }) },
});

export const PACKAGES: Readonly<Record<string, PluginPackage>> = {
  audit: { directory: "/plugins/audit", name: "@acme/plugin-audit" },
  billing: { directory: "/plugins/billing", name: "@acme/plugin-billing" },
  identity: { directory: "/plugins/identity", name: "@acme/plugin-identity" },
  lonely: { directory: "/plugins/lonely", name: "@acme/plugin-lonely" },
  payroll: { directory: "/plugins/payroll", name: "@acme/plugin-payroll" },
  profile: { directory: "/plugins/profile", name: "@acme/plugin-profile" },
  shell: { directory: "/plugins/shell", name: "@acme/plugin-shell" },
  "time-off": { directory: "/plugins/time-off", name: "@acme/plugin-time-off" },
};

export function productOf(
  plugins: readonly InstalledPlugin[],
  stated: Partial<ProductDefinition> = {},
): Product {
  const definition = defineProduct({
    name: "product.name",
    plugins,
    productId: "people",
    version: "2026.10.1",
    ...stated,
  });
  const { problems, product } = resolveProduct(definition, PACKAGES, { today: "2026-10-01" });

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

export const PRODUCT = productOf([installed(timeOff), installed(billing), installed(payroll)]);
