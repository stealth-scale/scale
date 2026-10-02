import { timeOffContract } from "#define.fixtures.ts";
import { defineContract } from "#define.ts";
import { hostContract } from "#host.ts";
import { lazy, reminders } from "#manifest.fixtures.ts";
import { manifestOf } from "#resolve/resolve.fixtures.ts";
import { type RouteMarker } from "#route.ts";
import { settingsPage, settingsSection } from "#settings.ts";

export function routing(
  pluginId: string,
  routes: Readonly<Record<string, RouteMarker>>,
): ReturnType<typeof manifestOf> {
  return manifestOf(defineContract(pluginId, { routes }));
}

export const colon = routing("colon", {
  detail: { kind: "route", path: "items/:id", sample: { id: "1" } },
});

export const located = routing("located", {
  here: {
    kind: "route",
    path: "here",
    when: { allOf: [{ route: timeOffContract.routes.overview }] },
  },
});

export const listed = routing("listed", {
  detail: { kind: "route", navigation: { label: "navigation.detail" }, path: "items/$id" },
});

export const orphan = routing("orphan", {
  detail: {
    kind: "route",
    navigation: { label: "navigation.detail", menu: { id: "billing/reports", kind: "menu" } },
    parent: { id: "billing/home", kind: "route" },
    path: "detail",
  },
});

export const twin = routing("twin", {
  home: { kind: "route", path: "/time-off/" },
  settings: { kind: "route", parent: hostContract.routes.settings, path: "time-off/time-off" },
});

export const guarded = routing("guarded", {
  loaded: {
    data: [
      { query: timeOffContract.queries.request, variables: ["id"] },
      { query: timeOffContract.queries.request },
    ],
    kind: "route",
    path: "loaded/$id",
    sample: { id: "7" },
  },
  page: {
    kind: "route",
    navigation: { label: "navigation.page", order: 2 },
    path: "page",
    when: { authenticated: true },
  },
});

export const PLACED = {
  extensions: [
    {
      disabled: false,
      fallback: false,
      id: "inventory/badge",
      plugin: "inventory",
      position: "after",
      target: "route:time-off/request",
    },
    {
      disabled: true,
      fallback: false,
      id: "audit/note",
      plugin: "audit",
      position: "after",
      target: "route:time-off/request",
    },
  ],
  slots: {
    "host/aside": { extensions: ["notes/aside"], id: "host/aside", plugin: "host", region: true },
    "time-off/request-sidebar": {
      extensions: ["cards/balance", "time-off/own"],
      id: "time-off/request-sidebar",
      plugin: "time-off",
      region: false,
    },
  },
} as const;

export const ring = routing("ring", {
  first: { kind: "route", parent: { id: "ring/second", kind: "route" }, path: "first" },
  second: { kind: "route", parent: { id: "ring/first", kind: "route" }, path: "second" },
});

export const pagedContract = defineContract("paged", {
  settings: {
    pages: {
      main: settingsPage({ label: "settings.main", order: 2, when: { authenticated: true } }),
    },
  },
});

export const paged = manifestOf(pagedContract);

export const sectioned = manifestOf(
  defineContract("sectioned", {
    settings: {
      sections: {
        account: settingsSection({
          label: "settings.account",
          target: hostContract.settings.pages.account,
        }),
        extra: settingsSection({
          label: "settings.extra",
          target: pagedContract.settings.pages.main,
        }),
      },
    },
  }),
  {
    settings: {
      account: { component: lazy({ reminders }) },
      extra: { component: lazy({ reminders }) },
    },
  },
);

export const formed = manifestOf(
  defineContract("formed", {
    settings: {
      sections: {
        plain: settingsSection({
          label: "settings.plain",
          schema: { additionalProperties: false, properties: {}, type: "object" },
          target: pagedContract.settings.pages.main,
        }),
      },
    },
  }),
);

export const PAGE_PLACED = {
  extensions: [
    {
      disabled: false,
      fallback: false,
      id: "notes/banner",
      plugin: "notes",
      position: "before",
      target: "route:host/settings/paged/main",
    },
  ],
  slots: {},
} as const;
