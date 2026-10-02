import { defineContract } from "#define.ts";
import { hostContract } from "#host.ts";
import { manifestOf, untypedContract } from "#resolve/resolve.fixtures.ts";

export const CATALOGUES = {
  people: { product: { name: "People" } },
  "time-off": {
    commands: { approve: "Approve", request: "Request time off" },
    config: { approvers: "Approvers" },
    entitlements: { module: "Time off" },
    flags: { calendar: "Calendar" },
    navigation: { overview: "Time off" },
    permissions: { approve: "Approve requests", read: "Read requests" },
    plugin: { description: "Requests and approvals", name: "Time off" },
    resources: { request: "Request" },
    roles: { approver: "Approver" },
    settings: { reminders: "Reminders", title: "Time off" },
  },
};

export const FORM = {
  prefs: {
    plugin: { description: "Preferences", name: "Prefs" },
    settings: {
      away: "Away",
      bare: "Bare",
      form: {
        fields: {
          channel: { label: "Channel", options: { chat: "Chat" } },
          code: { label: "Code" },
          days: { label: "Days" },
          weekly: { label: "Weekly" },
        },
        title: "Form",
      },
      main: "Main",
    },
  },
};

export const raw = manifestOf(
  untypedContract({
    ...defineContract("raw", {}),
    config: { properties: { a: { type: "string" }, b: "string" } },
    settings: {
      pages: {},
      sections: {
        s: {
          id: "raw/s",
          kind: "settingsSection",
          label: "settings.s.title",
          schema: { properties: { p: "text" } },
          target: hostContract.settings.pages.account,
        },
      },
    },
  }),
);

export const RAW = {
  raw: { plugin: { description: "Raw", name: "Raw" }, settings: { s: { title: "S" } } },
};
