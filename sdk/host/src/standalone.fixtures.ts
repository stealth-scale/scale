import { getI18n } from "react-i18next";

import {
  type AnyContract,
  command,
  defineConfigSchema,
  defineContract,
  definePlugin,
  entitlement,
  extension,
  params,
  permission,
  type PluginCode,
  type Product,
  props,
  returns,
  route,
  settingsPage,
  settingsSection,
  slot,
  type TargetedProps,
} from "@stealthscale/sdk-core";

import { lazy, page, productOf } from "#host/product.fixtures.ts";
import { type Framed, framed } from "#parts/parts.fixtures.tsx";
import { type StandaloneOptions, standaloneProduct } from "#standalone.ts";

export interface CardProps {
  readonly personId: string;
}

export interface Wrapped {
  readonly children?: unknown;
}

export const identityContract = defineContract("identity", (self) => ({
  commands: {
    invite: command({ label: "commands.invite" }),
    pick: command({ ...returns<string>(), label: "commands.pick" }),
  },
  entitlements: { directory: entitlement({ description: "entitlements.directory" }) },
  extensions: {
    badge: extension({ position: "after", target: self.slot("person-card") }),
    frame: extension({ position: "wrap", target: { every: "route" } }),
  },
  permissions: { "people.read": permission({ description: "permissions.read" }) },
  routes: {
    people: route({ navigation: { label: "navigation.people" }, path: "people" }),
    person: route({
      ...params<{ readonly personId: string }>(),
      parent: self.route("people"),
      path: "$personId",
      sample: { personId: "ada" },
    }),
  },
  settings: {
    pages: { identity: settingsPage({ label: "settings.title" }) },
    sections: {
      photo: settingsSection({ label: "settings.photo", target: self.settingsPage("identity") }),
      privacy: settingsSection({
        label: "settings.privacy",
        schema: {
          additionalProperties: false,
          properties: { listed: { default: true, type: "boolean" } },
          type: "object",
        },
        target: self.settingsPage("identity"),
      }),
    },
  },
  slots: {
    "people-footer": slot(),
    "person-card": slot({ ...props<CardProps>(), sample: { personId: "ada" } }),
    "person-tab": slot({ keyed: true }),
  },
  version: "2.0.0",
}));

export const profileContract = defineContract("profile", () => ({
  config: defineConfigSchema({
    region: { default: "eu", description: "config.region", type: "string" },
  }),
  extensions: {
    card: extension({ position: "after", target: identityContract.slots["person-card"] }),
    footer: extension({ position: "after", target: identityContract.slots["people-footer"] }),
    history: extension({
      match: "history",
      position: "after",
      target: identityContract.slots["person-tab"],
    }),
    tab: extension({
      match: "profile",
      position: "after",
      target: identityContract.slots["person-tab"],
    }),
  },
  routes: { overview: route({ navigation: { label: "navigation.overview" }, path: "profile" }) },
  version: "1.0.0",
}));

export function card({ personId }: CardProps & TargetedProps): string {
  return `card ${personId}`;
}

export function footer({ targetId }: TargetedProps): string {
  return `footer in ${targetId}`;
}

export function history(): string {
  return "tab history";
}

export function tab(): string {
  return "tab profile";
}

export const profile = definePlugin(profileContract, {
  extensions: {
    card: { component: lazy({ card }) },
    footer: { component: lazy({ footer }) },
    history: { component: lazy({ history }) },
    tab: { component: lazy({ tab }) },
  },
  routes: { overview: lazy({ page }) },
});

export function standaloneOf(options: StandaloneOptions): Product {
  const { name, plugins, productId, version } = standaloneProduct(options);

  return productOf(plugins, { name, productId, version });
}

export function placeholderCodeOf(contract: AnyContract): PluginCode {
  const [installed] = standaloneProduct({ contract }).plugins;

  if (installed === undefined) throw new Error("The standalone product installs no plugin.");

  return installed.manifest.code;
}

export async function placeholderExtensionOf(
  contract: AnyContract,
  name: string,
): Promise<(given: Wrapped) => unknown> {
  const entry = placeholderCodeOf(contract).extensions?.[name];

  if (entry === undefined) throw new Error(`The placeholder code has no extension ${name}.`);

  const [component] = Object.values(await entry.component());

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the placeholder extension reads its children alone
  return component as unknown as (given: Wrapped) => unknown;
}

export async function placeholderRunOf(
  contract: AnyContract,
  name: string,
): Promise<() => unknown> {
  const entry = placeholderCodeOf(contract).commands?.[name];

  if (entry === undefined) throw new Error(`The placeholder code has no command ${name}.`);

  const [run] = Object.values(await entry.run());

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the placeholder command reads none of its arguments
  return run as unknown as () => unknown;
}

export function standaloneWorded(): void {
  const i18n = getI18n();

  i18n.addResourceBundle("en", "identity", { plugin: { name: "Identity" } }, true, true);
  i18n.addResourceBundle("en", "profile", { plugin: { name: "Profile" } }, true, true);
}

export const STANDALONE: Product = standaloneOf({
  beside: [identityContract],
  contract: profileContract,
  manifest: profile,
});

export function placeholderAt(at: string): Promise<Framed> {
  standaloneWorded();

  return framed({ at, host: { product: STANDALONE } });
}
