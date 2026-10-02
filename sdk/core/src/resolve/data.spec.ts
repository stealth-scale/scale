import { describe, expect, it } from "vitest";

import { timeOff } from "#product.fixtures.ts";
import { installed } from "#product.ts";
import { copies, decided, fielded, reports } from "#resolve/data.fixtures.ts";
import { resolveData } from "#resolve/data.ts";
import { report } from "#resolve/problem.ts";
import { contextFor, faultsOf, productOf } from "#resolve/resolve.fixtures.ts";
import { ring } from "#resolve/routes.fixtures.ts";
import { board } from "#resolve/slots.fixtures.ts";

describe("data", () => {
  it("passes the data declarations of an installed plugin", () => {
    expect(faultsOf(resolveData, contextFor(productOf([installed(timeOff)])))).toStrictEqual({
      problems: [],
      warnings: [],
    });
  });

  it("refuses one operation id under two kinds", () => {
    const context = contextFor(productOf([installed(copies), installed(timeOff)]));

    expect(faultsOf(resolveData, context).problems).toStrictEqual([
      "copies.mutations.clash.operation.id: is time-off~1~a1c2, which copies declares as a query",
    ]);
  });

  it("warns where two plugins declare one operation", () => {
    const context = contextFor(productOf([installed(copies), installed(timeOff)]));

    expect(faultsOf(resolveData, context).warnings).toStrictEqual([
      "time-off.queries.request.operation.id: is time-off~1~a1c2, which copies declares too",
    ]);
  });

  it("refuses a data variable that is no parameter of a route without a search", () => {
    const context = contextFor(
      productOf([installed(timeOff), installed(reports), installed(ring)]),
    );

    expect(faultsOf(resolveData, context).problems).toStrictEqual([
      "reports.routes.loose.data.0.variables.0: names id, which is no parameter of the path, and the route has no search",
      "reports.routes.team.data.0.variables.1: names year, which is no parameter of the path, and the route has no search",
    ]);
  });

  it.each([
    "decided.queries.items.records.1.type: names the resource billing/account, whose plugin is not installed",
    "decided.queries.items.decisions.0.permission: names the permission billing/pay, whose plugin is not installed",
    "decided.queries.items.decisions.1.permission: names time-off/request.read, which is not scoped",
    "decided.queries.items.decisions.2.permission: is scoped to time-off/request, which none of the query's records are",
    "decided.mutations.change.changes.0.type: names the resource billing/invoice, whose plugin is not installed",
  ])("reports %s", (line) => {
    const context = contextFor(
      productOf([installed(timeOff), installed(board), installed(decided)]),
    );

    expect(faultsOf(resolveData, context).problems).toContain(line);
  });

  it("reports no fault for a decision on the kind of a query's records", () => {
    const context = contextFor(
      productOf([installed(timeOff), installed(board), installed(decided)]),
    );

    expect(faultsOf(resolveData, context).problems).toHaveLength(5);
  });

  it("refuses a field condition outside an extension of a slot that states record", () => {
    const when = { field: { path: "e" } };
    const definition = productOf(
      [installed(timeOff), installed(board), installed(fielded, { when })],
      {
        when,
      },
    );

    expect(faultsOf(resolveData, contextFor(definition)).problems).toStrictEqual([
      "fielded.commands.act.when.field: is refused outside an extension of a slot that states record",
      "fielded.extensions.every.when.field: is refused outside an extension of a slot that states record",
      "fielded.extensions.plain.when.field: is refused outside an extension of a slot that states record",
      "fielded.extensions.routed.when.not.field: is refused outside an extension of a slot that states record",
      "product.when.field: is refused outside an extension of a slot that states record",
      "product.plugins.fielded.when.field: is refused outside an extension of a slot that states record",
    ]);
  });

  it("resolves a query with its selectors by qualified ids", () => {
    const context = contextFor(
      productOf([installed(timeOff), installed(board), installed(decided)]),
    );
    const { queries } = resolveData(context, report());

    expect(queries.find(({ id }) => id === "decided/items")).toStrictEqual({
      decisions: [
        { at: undefined, field: "a", id: "id", permission: "billing/pay" },
        { at: undefined, field: "b", id: "id", permission: "time-off/request.read" },
        { at: undefined, field: "c", id: "id", permission: "time-off/request.approve" },
        { at: undefined, field: "d", id: "id", permission: "board/gone" },
        { at: "items", field: "e", id: "id", permission: "board/edit" },
      ],
      id: "decided/items",
      operation: { id: "decided~1~c5e6", kind: "query" },
      plugin: "decided",
      records: [
        { at: "items", id: "id", list: true, type: "board/item" },
        { at: undefined, id: "id", list: undefined, type: "billing/account" },
      ],
      sample: { data: { id: "7", status: "open" }, variables: {} },
      staleTime: 5000,
    });
  });

  it("resolves a mutation with the records it changes", () => {
    const { mutations } = resolveData(contextFor(productOf([installed(decided)])), report());

    expect(mutations).toStrictEqual([
      {
        changes: [{ action: "updated", id: "id", type: "billing/invoice" }],
        id: "decided/change",
        operation: { id: "time-off~1~b3d4", kind: "mutation" },
        plugin: "decided",
        sample: { data: { id: "7", status: "open" }, variables: { requestId: "7" } },
      },
    ]);
  });

  it("resolves declarations without selectors to empty lists", () => {
    const { mutations, queries } = resolveData(
      contextFor(productOf([installed(timeOff)])),
      report(),
    );

    expect([queries[0]?.records, queries[0]?.decisions, mutations[0]?.changes]).toStrictEqual([
      [],
      [],
      [],
    ]);
  });
});
