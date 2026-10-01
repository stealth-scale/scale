import { describe, expect, it } from "vitest";

import { timeOffContract } from "#define.fixtures.ts";
import { condition, flagValue, markerOf } from "#resolve/markers.ts";
import { reasonsOf } from "#resolve/resolve.fixtures.ts";

describe("markers", () => {
  it("takes a condition that nests conditions", () => {
    const when = {
      allOf: [{ authenticated: true }, { not: { plugin: timeOffContract } }],
      anyOf: [{ permission: timeOffContract.permissions["request.read"] }],
      field: { equals: null, exists: true, path: "stock" },
      variant: { flag: "time-off/layout", is: "board" },
    };

    expect(reasonsOf(condition, when)).toStrictEqual([]);
  });

  it("refuses a member a condition does not read", () => {
    expect(reasonsOf(condition, { allOf: [{ role: "time-off/approver" }] })).toStrictEqual([
      "at.allOf.0.role: is not a member the type states",
    ]);
  });

  it.each([
    { label: "a plugin without an id", value: { plugin: {} } },
    { label: "a plugin that is text", value: { plugin: "time-off" } },
  ])("refuses $label in a condition", ({ value }) => {
    expect(reasonsOf(condition, value)).toStrictEqual([
      "at.plugin: must be an object with a plugin id",
    ]);
  });

  it("refuses a field compared with an object", () => {
    expect(reasonsOf(condition, { field: { equals: {}, path: "stock" } })).toStrictEqual([
      "at.field.equals: must be a boolean, a number, a string or null",
    ]);
  });

  it("takes every reference a contract declares", () => {
    const references = [
      ...Object.values(timeOffContract.routes),
      ...Object.values(timeOffContract.queries),
      ...Object.values(timeOffContract.extensions),
      ...Object.values(timeOffContract.settings.sections),
    ];

    expect(references.flatMap((one) => reasonsOf(markerOf(one.kind), one))).toStrictEqual([]);
  });

  it("takes a search validator that is a function", () => {
    const search = Object.assign(() => true, { "~standard": { validate: () => ({}) } });

    expect(
      reasonsOf(markerOf("route"), { id: "a/b", kind: "route", path: "b", search }),
    ).toStrictEqual([]);
  });

  it.each([
    { label: "text", search: "status" },
    { label: "null", search: null },
    { label: "an object without a standard", search: {} },
  ])("refuses $label as a search validator", ({ search }) => {
    expect(
      reasonsOf(markerOf("route"), { id: "a/b", kind: "route", path: "b", search }),
    ).toStrictEqual(["at.search: must be a Standard Schema validator"]);
  });

  it("refuses a target of every kind with a member of its own", () => {
    const extension = {
      id: "a/b",
      kind: "extension",
      position: "wrap",
      target: { every: "page" },
    };

    expect(reasonsOf(markerOf("extension"), extension)).toStrictEqual([
      'at.target.every: must be "extension", "route" or "slot"',
    ]);
  });

  it("refuses a reference of another kind", () => {
    expect(reasonsOf(markerOf("menu"), { id: "a/b", kind: "route" })).toStrictEqual([
      'at.kind: must be "menu"',
    ]);
  });

  it.each([
    { label: "true", taken: true },
    { label: "a variant", taken: "board" },
  ])("takes $label as a flag's value", ({ taken }) => {
    expect(reasonsOf(flagValue, taken)).toStrictEqual([]);
  });

  it("refuses a number as a flag's value", () => {
    expect(reasonsOf(flagValue, 1)).toStrictEqual(["at: must be a boolean or a string"]);
  });
});
