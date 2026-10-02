import { getI18n } from "react-i18next";

import {
  command,
  defineContract,
  defineMutation,
  definePlugin,
  defineQuery,
  extension,
  flag,
  hostContract,
  mutation,
  needs,
  permission,
  type PluginManifest,
  query,
  resource,
  route,
  type When,
} from "@stealthscale/sdk-core";

import { type Check } from "#check.ts";
import { lazy, notesContract, tagsContract } from "#notes.fixtures.ts";

export const SAVE = defineMutation<{ readonly id: string }, { readonly noteId?: string }>(
  "ledger~1~save",
);

export const FIND = defineQuery<unknown, object>("ledger~1~find");

export const ledgerContract = defineContract("ledger", (self) => ({
  commands: {
    archive: command({ label: "commands.archive", when: { permission: self.permission("write") } }),
  },
  extensions: {
    badge: extension({ position: "after", target: hostContract.slots.status }),
  },
  featureFlags: {
    old: flag({ default: true, description: "flags.old", expires: "2020-01-01", kind: "release" }),
    young: flag({
      default: true,
      description: "flags.young",
      expires: "2099-12-31",
      kind: "release",
    }),
  },
  mutations: {
    breaks: mutation({
      changes: [{ action: "updated", id: "noteId", type: self.resource("entry") }],
      operation: SAVE,
      sample: { data: { id: "e1" }, variables: {} },
    }),
    creates: mutation({
      changes: [{ action: "created", type: self.resource("entry") }],
      operation: SAVE,
      sample: { data: { id: "e1" }, variables: {} },
    }),
    pings: mutation({ operation: SAVE, sample: { data: { id: "e1" }, variables: {} } }),
    saves: mutation({
      changes: [
        { action: "created", type: self.resource("entry") },
        { action: "updated", id: "noteId", type: self.resource("entry") },
      ],
      operation: SAVE,
      sample: { data: { id: "e1" }, variables: { noteId: "n1" } },
    }),
  },
  permissions: {
    write: permission({ description: "permissions.write", resource: self.resource("entry") }),
  },
  queries: {
    empty: query({ operation: FIND, sample: { data: { items: [] }, variables: {} } }),
    found: query({
      decisions: [
        { at: "items", field: "editable", id: "id", permission: self.permission("write") },
      ],
      operation: FIND,
      records: [{ at: "items", id: "id", type: self.resource("entry") }],
      sample: { data: { items: [{ editable: true, id: "e1" }] }, variables: {} },
    }),
    lost: query({
      decisions: [
        { at: "rows", field: "editable", id: "id", permission: self.permission("write") },
      ],
      operation: FIND,
      records: [{ at: "rows", id: "id", type: self.resource("entry") }],
      sample: { data: { items: [] }, variables: {} },
    }),
  },
  requires: [needs(notesContract, "^1.0.0"), needs(tagsContract, "^9.0.0")],
  resources: { entry: resource({ description: "resources.entry" }) },
  routes: {
    home: route({ path: "ledger" }),
    paged: route({ path: "ledger/paged", when: { permission: self.permission("write") } }),
  },
  version: "1.0.0",
}));

export function Page(): string {
  return "page";
}

export function Other(): string {
  return "other";
}

export function run(): void {}

export const ledger = definePlugin(ledgerContract, {
  commands: { archive: { run: lazy({ run }) } },
  extensions: { badge: { component: lazy({ Page }) } },
  routes: { home: lazy({ Page }), paged: { component: lazy({ Page }) } },
});

export const DOUBLED: PluginManifest = {
  ...ledger,
  code: { ...ledger.code, routes: { home: lazy({ Other, Page }), paged: lazy({ Page }) } },
};

export const UNCODED: PluginManifest = {
  ...ledger,
  code: { ...ledger.code, routes: { home: lazy({ Page }) } },
};

export const LEDGER = {
  beside: [notesContract, tagsContract],
  contract: ledgerContract,
  manifest: ledger,
};

export function permitted(id: string): When {
  return { permission: { id, kind: "permission" } };
}

export function caseNamed(cases: readonly Check[], name: string): Check {
  const found = cases.find((one) => one.name === name);

  if (found === undefined) throw new Error(`No case is named ${name}.`);

  return found;
}

export function worded(namespace: string, words: Readonly<Record<string, unknown>>): void {
  getI18n().addResourceBundle("en", namespace, words, true, true);
}
