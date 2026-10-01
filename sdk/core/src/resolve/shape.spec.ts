import { describe, expect, it } from "vitest";

import { reasonsOf } from "#resolve/resolve.fixtures.ts";
import {
  anything,
  article,
  binary,
  callable,
  count,
  date,
  either,
  exactly,
  list,
  numeric,
  object,
  optional,
  record,
  reference,
  text,
} from "#resolve/shape.ts";

describe("shape", () => {
  it.each([
    { label: "text", shape: text, taken: "a", want: "at: must be a string", wrong: 1 },
    { label: "numeric", shape: numeric, taken: 1.5, want: "at: must be a number", wrong: Infinity },
    {
      label: "count",
      shape: count,
      taken: 2,
      want: "at: must be a whole number of 1 or more",
      wrong: 0,
    },
    { label: "binary", shape: binary, taken: false, want: "at: must be a boolean", wrong: "no" },
    { label: "callable", shape: callable, taken: Date, want: "at: must be a function", wrong: {} },
    {
      label: "date",
      shape: date,
      taken: "2026-12-31",
      want: "at: must be a date in the form 2026-12-31",
      wrong: "31.12.2026",
    },
  ])("refuses a value $label does not take", ({ shape, taken, want, wrong }) => {
    expect([reasonsOf(shape, taken), reasonsOf(shape, wrong)]).toStrictEqual([[], [want]]);
  });

  it("takes any value with anything", () => {
    expect(reasonsOf(anything, Symbol("any"))).toStrictEqual([]);
  });

  it("names every value exactly takes", () => {
    expect(reasonsOf(exactly("after", "before", "wrap"), "around")).toStrictEqual([
      'at: must be "after", "before" or "wrap"',
    ]);
  });

  it("names the one value exactly takes", () => {
    expect(reasonsOf(exactly(true), false)).toStrictEqual(["at: must be true"]);
  });

  it("skips an undefined value under optional", () => {
    expect([reasonsOf(optional(text)), reasonsOf(optional(text), 1)]).toStrictEqual([
      [],
      ["at: must be a string"],
    ]);
  });

  it("checks every item of a list under its index", () => {
    expect(reasonsOf(list(text), ["a", 2])).toStrictEqual(["at.1: must be a string"]);
  });

  it("refuses a list that is not an array", () => {
    expect(reasonsOf(list(text), "a")).toStrictEqual(["at: must be a list"]);
  });

  it("checks every member of a record under its name", () => {
    expect(reasonsOf(record(numeric), { one: 1, two: "2" })).toStrictEqual([
      "at.two: must be a number",
    ]);
  });

  it("refuses a record that is not a plain object", () => {
    expect([reasonsOf(record(numeric), [1]), reasonsOf(record(numeric), null)]).toStrictEqual([
      ["at: must be an object"],
      ["at: must be an object"],
    ]);
  });

  it("refuses a member an object shape does not list", () => {
    expect(reasonsOf(object({ path: text }), { path: "a", pth: "b" })).toStrictEqual([
      "at.pth: is not a member the type states",
    ]);
  });

  it("ignores an unlisted member whose value is undefined", () => {
    expect(reasonsOf(object({ path: text }), { path: "a", pth: undefined })).toStrictEqual([]);
  });

  it("checks a missing member against its own shape", () => {
    expect([reasonsOf(object({ path: text }), {}), reasonsOf(object({}), 1)]).toStrictEqual([
      ["at.path: must be a string"],
      ["at: must be an object"],
    ]);
  });

  it("takes a reference with a qualified id and a kind given", () => {
    expect(reasonsOf(reference("route"), { id: "time-off/overview", kind: "route" })).toStrictEqual(
      [],
    );
  });

  it.each([
    { label: "a bare id", value: { id: "overview", kind: "route" } },
    { label: "another kind", value: { id: "time-off/balance", kind: "extension" } },
    { label: "a string", value: "time-off/overview" },
  ])("refuses $label as a reference to a route or a slot", ({ value }) => {
    expect(reasonsOf(reference("route", "slot"), value)).toStrictEqual([
      "at: must be a reference to a route or a slot",
    ]);
  });

  it("joins three words with commas and an or", () => {
    expect([either(["a"]), either(["a", "b", "c"])]).toStrictEqual(["a", "a, b or c"]);
  });

  it("writes an before a vowel", () => {
    expect([article("extension"), article("route")]).toStrictEqual(["an extension", "a route"]);
  });
});
