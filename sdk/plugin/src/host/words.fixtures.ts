import { type Catalogues, NONE, type Words } from "@stealthscale/provider-i18n";

const ENGLISH: Readonly<Record<string, Words>> = {
  billing: {
    navigation: { invoices: "Invoices", reports: "Reports" },
    plugin: { name: "Billing" },
  },
  host: { settings: { account: "Account", plugins: "Plugins" } },
  payroll: { commands: { run: "Run payroll" } },
  people: { product: { name: "People" } },
  "time-off": {
    commands: { approve: "Approve request", pick: "Pick a person", request: "Request time off" },
    navigation: { calendar: "Calendar", history: "History", overview: "Time off" },
    settings: { title: "Time off" },
  },
};

export const CATALOGUES: Catalogues = {
  ...NONE,
  bundled: { en: ENGLISH },
  defaults: ENGLISH,
  languages: ["en"],
  namespaces: Object.keys(ENGLISH),
};
