import { type ReactNode } from "react";

import { getI18n } from "react-i18next";

import {
  defineContract,
  definePlugin,
  hostContract,
  installed,
  type Product,
  type ResolvedSettingsSection,
  settingsPage,
  settingsSection,
  subjectOf,
} from "@stealthscale/sdk-core";
import { settingKey } from "@stealthscale/settings";

import { withCode } from "#host/host.fixtures.ts";
import { type Host, type HostOptions } from "#host/options.ts";
import {
  billing,
  lazy,
  payroll,
  productOf,
  timeOff,
  timeOffContract,
} from "#host/product.fixtures.ts";
import { type Framed, framed } from "#parts/parts.fixtures.tsx";
import {
  Avatar,
  Away,
  Crashed,
  Extra,
  Hidden,
  Ranked,
  Stray,
  Visiting,
} from "#settings/sections.fixtures.tsx";
import { ADA } from "#stores/session.fixtures.ts";

const AUDIT_PAGE = { id: "audit/page", kind: "settingsPage" } as const;

export const profileContract = defineContract("profile", (self) => ({
  settings: {
    pages: {
      main: settingsPage({ label: "settings.main", order: 1 }),
      quiet: settingsPage({ label: "settings.quiet", order: 2 }),
    },
    sections: {
      avatar: settingsSection({
        label: "settings.avatar",
        target: hostContract.settings.pages.account,
      }),
      away: settingsSection({ label: "settings.away", target: AUDIT_PAGE }),
      extra: settingsSection({ label: "settings.extra", target: self.settingsPage("main") }),
      hidden: settingsSection({
        label: "settings.hidden",
        target: self.settingsPage("main"),
        when: { authenticated: false },
      }),
      ranked: settingsSection({
        label: "settings.ranked",
        order: 1,
        target: self.settingsPage("main"),
      }),
    },
  },
  version: "1.0.0",
}));

const PROFILE_SETTINGS = {
  avatar: { component: lazy({ Avatar }) },
  away: { component: lazy({ Away }) },
  extra: { component: lazy({ Extra }) },
  hidden: { component: lazy({ Hidden }) },
  ranked: { component: lazy({ Ranked }) },
};

export const profile = definePlugin(profileContract, { settings: PROFILE_SETTINGS });

export const lonelyContract = defineContract("lonely", () => ({
  settings: {
    sections: {
      stray: settingsSection({ label: "settings.stray", target: AUDIT_PAGE }),
      visiting: settingsSection({
        label: "settings.visiting",
        target: timeOffContract.settings.pages["time-off"],
      }),
    },
  },
  version: "1.0.0",
}));

export const lonely = definePlugin(lonelyContract, {
  settings: {
    stray: { component: lazy({ Stray }) },
    visiting: { component: lazy({ Visiting }) },
  },
});

export const SETTLED: Product = productOf([
  installed(timeOff),
  installed(billing, { locked: true }),
  installed(payroll),
  installed(profile),
  installed(lonely),
]);

export const CRASHING: Product = withCode(SETTLED, "profile", {
  settings: { ...PROFILE_SETTINGS, extra: { component: lazy({ Crashed }) } },
});

const WORDS = {
  billing: { plugin: { description: "Invoices and payments", name: "Billing" } },
  lonely: {
    plugin: { description: "Sections without a page", name: "Lonely" },
    settings: { stray: "Stray", visiting: "Visiting" },
  },
  payroll: { plugin: { description: "Monthly runs", name: "Payroll" } },
  people: { product: { name: "People" } },
  profile: {
    plugin: { description: "Your name and picture", name: "Profile" },
    settings: {
      avatar: "Picture",
      away: "Away",
      extra: "Extra",
      hidden: "Hidden",
      main: "Profile",
      quiet: "Quiet",
      ranked: "Ranked",
    },
  },
  "time-off": {
    plugin: { description: "Requests and balances", name: "Time off" },
    settings: {
      reminders: {
        fields: { channel: { label: "Channel" }, days: { label: "Days before" } },
        title: "Reminders",
      },
      title: "Time off",
    },
  },
};

export function settingsWords(): void {
  const i18n = getI18n();

  for (const [namespace, words] of Object.entries(WORDS)) {
    i18n.addResourceBundle("en", namespace, words, true, true);
  }
}

export function sectionIn(product: Product, id: string): ResolvedSettingsSection {
  const found = product.settings.sections.find((one) => one.id === id);

  if (found === undefined) throw new Error(`The fixture product has no settings section ${id}.`);

  return found;
}

export function storedKeyOf(pluginId: string, name: string): string {
  return settingKey("people", `${subjectOf(ADA) ?? "anyone"}.settings.${pluginId}.${name}`);
}

export interface SettledOptions {
  readonly frame?: (() => ReactNode) | undefined;
  readonly host?: Partial<HostOptions> | undefined;
  readonly prepare?: ((host: Host) => void) | undefined;
}

export function settled(at: string, options: SettledOptions = {}): Promise<Framed> {
  settingsWords();

  return framed({
    at,
    frame: options.frame,
    host: { product: SETTLED, ...options.host },
    prepare: options.prepare,
  });
}
