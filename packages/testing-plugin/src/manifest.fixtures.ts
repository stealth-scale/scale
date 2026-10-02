import { definePlugin } from "@stealthscale/sdk-core";

import { lazy, notesContract } from "#notes.fixtures.ts";
import { Badge, NotePage, NotesPage } from "#probes.fixtures.tsx";

export const notes = definePlugin(notesContract, {
  extensions: { badge: { component: lazy({ Badge }) } },
  routes: { list: lazy({ NotesPage }), note: lazy({ NotePage }) },
});

export const NOTES = { contract: notesContract, manifest: notes } as const;
