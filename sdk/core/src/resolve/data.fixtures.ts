import { APPROVE, OPEN, REQUEST, timeOffContract } from "#define.fixtures.ts";
import { defineContract } from "#define.ts";
import { manifestOf } from "#resolve/resolve.fixtures.ts";
import { boardContract } from "#resolve/slots.fixtures.ts";
import { type SearchSchema } from "#route.ts";

export const SEARCH: SearchSchema = {
  "~standard": { validate: (value) => ({ value }), vendor: "fixture", version: 1 },
};

export const copies = manifestOf(
  defineContract("copies", {
    mutations: {
      clash: {
        kind: "mutation",
        operation: { id: REQUEST.id, kind: "mutation" },
        sample: { data: OPEN, variables: {} },
      },
    },
    queries: {
      again: { kind: "query", operation: REQUEST, sample: { data: OPEN, variables: { id: "7" } } },
      twice: { kind: "query", operation: REQUEST, sample: { data: OPEN, variables: { id: "7" } } },
    },
  }),
);

export const reports = manifestOf(
  defineContract("reports", {
    routes: {
      detail: {
        data: [{ query: timeOffContract.queries.request, variables: ["teamId", "week"] }],
        kind: "route",
        parent: { id: "reports/team", kind: "route" },
        path: "$week",
        sample: { week: "1" },
      },
      filtered: {
        data: [{ query: timeOffContract.queries.request, variables: ["status"] }],
        kind: "route",
        path: "filtered",
        search: SEARCH,
      },
      item: {
        data: [{ query: timeOffContract.queries.request, variables: ["status"] }],
        kind: "route",
        parent: { id: "reports/filtered", kind: "route" },
        path: "item",
      },
      loose: {
        data: [{ query: timeOffContract.queries.request, variables: ["id"] }],
        kind: "route",
        parent: { id: "billing/home", kind: "route" },
        path: "loose",
      },
      team: {
        data: [{ query: timeOffContract.queries.request, variables: ["teamId", "year"] }],
        kind: "route",
        path: "teams/$teamId",
        sample: { teamId: "1" },
      },
    },
  }),
);

export const decided = manifestOf(
  defineContract("decided", {
    mutations: {
      change: {
        changes: [
          { action: "updated", id: "id", type: { id: "billing/invoice", kind: "resource" } },
        ],
        kind: "mutation",
        operation: APPROVE,
        sample: { data: OPEN, variables: { requestId: "7" } },
      },
    },
    queries: {
      items: {
        decisions: [
          { field: "a", id: "id", permission: { id: "billing/pay", kind: "permission" } },
          { field: "b", id: "id", permission: { id: "time-off/request.read", kind: "permission" } },
          { field: "c", id: "id", permission: timeOffContract.permissions["request.approve"] },
          { field: "d", id: "id", permission: { id: "board/gone", kind: "permission" } },
          { at: "items", field: "e", id: "id", permission: boardContract.permissions.edit },
        ],
        kind: "query",
        operation: { id: "decided~1~c5e6", kind: "query" },
        records: [
          { at: "items", id: "id", list: true, type: boardContract.resources.item },
          { id: "id", type: { id: "billing/account", kind: "resource" } },
        ],
        sample: { data: OPEN, variables: {} },
        staleTime: 5000,
      },
    },
  }),
);

export const fielded = manifestOf(
  defineContract("fielded", {
    commands: {
      act: { kind: "command", label: "commands.act", when: { field: { path: "a" } } },
    },
    extensions: {
      every: {
        kind: "extension",
        position: "wrap",
        target: { every: "slot" },
        when: { field: { path: "b" } },
      },
      plain: {
        kind: "extension",
        position: "after",
        target: boardContract.slots.list,
        when: { field: { path: "c" } },
      },
      record: {
        kind: "extension",
        match: "x",
        position: "replace",
        target: boardContract.slots.feed,
        when: { field: { exists: true, path: "stock" } },
      },
      routed: {
        kind: "extension",
        position: "after",
        target: timeOffContract.routes.overview,
        when: { not: { field: { path: "d" } } },
      },
    },
  }),
);
