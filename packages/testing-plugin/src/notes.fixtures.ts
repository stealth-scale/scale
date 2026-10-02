import {
  defineConfigSchema,
  defineContract,
  defineQuery,
  entitlement,
  extension,
  flag,
  hostContract,
  needs,
  params,
  permission,
  query,
  resource,
  route,
  type Session,
  settingsPage,
  settingsSection,
} from "@stealthscale/sdk-core";

export interface Note {
  readonly id: string;
  readonly text: string;
}

export const NOTE = defineQuery<Note, { readonly id: string }>("notes~1~n1");

export const MILK: Note = { id: "n1", text: "Buy milk" };

export const notesContract = defineContract("notes", (self) => ({
  config: defineConfigSchema({
    title: { default: "Notes", description: "config.title", type: "string" },
  }),
  entitlements: { notes: entitlement({ description: "entitlements.notes" }) },
  extensions: { badge: extension({ position: "after", target: hostContract.slots.status }) },
  featureFlags: {
    archive: flag({
      default: false,
      description: "flags.archive",
      expires: "2099-12-31",
      kind: "release",
    }),
    layout: flag({
      default: "list",
      description: "flags.layout",
      expires: "2099-12-31",
      kind: "experiment",
      variants: ["list", "grid"],
    }),
  },
  permissions: {
    "note.edit": permission({ description: "permissions.edit", resource: self.resource("note") }),
    "note.read": permission({ description: "permissions.read" }),
  },
  queries: { note: query({ operation: NOTE, sample: { data: MILK, variables: { id: "n1" } } }) },
  resources: { note: resource({ description: "resources.note" }) },
  routes: {
    list: route({ navigation: { label: "navigation.list" }, path: "notes" }),
    note: route({
      ...params<{ readonly noteId: string }>(),
      parent: self.route("list"),
      path: "$noteId",
      sample: { noteId: "n1" },
    }),
  },
  settings: {
    pages: { notes: settingsPage({ label: "settings.title" }) },
    sections: {
      display: settingsSection({
        label: "settings.display",
        schema: {
          additionalProperties: false,
          properties: { size: { default: "md", enum: ["sm", "md"], type: "string" } },
          type: "object",
        },
        target: self.settingsPage("notes"),
      }),
    },
  },
  version: "1.0.0",
}));

export const tagsContract = defineContract("tags", () => ({
  routes: { tags: route({ navigation: { label: "navigation.tags" }, path: "tags" }) },
  version: "1.0.0",
}));

export const orphanContract = defineContract("orphan", () => ({
  requires: [needs(tagsContract, "^9.0.0")],
  version: "1.0.0",
}));

export const ADA: Session = {
  authenticated: true,
  entitlements: [],
  permissions: ["notes/note.read"],
  roles: [],
  tenantId: "acme",
  userId: "ada",
};

export function lazy<Module>(module: Module): () => Promise<Module> {
  return () => Promise.resolve(module);
}
