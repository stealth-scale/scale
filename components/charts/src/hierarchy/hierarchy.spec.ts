import { describe, expect, it } from "vitest";

import {
  depthOf,
  hierarchyLeaves,
  type HierarchyNode,
  largestFirst,
  sizeOf,
} from "#hierarchy/hierarchy.ts";

/**
 * Lists two teams of services and a service at the top level: 60, 40 and 100 in all.
 */
const SPEND: readonly HierarchyNode[] = [
  {
    children: [
      { key: "db", label: "Database", value: 60 },
      { key: "cache", value: 40 },
    ],
    key: "data",
    label: "Data",
  },
  { children: [{ key: "cdn", value: 50 }], key: "web" },
  { key: "search", value: 50 },
];

describe("hierarchy", () => {
  it("sizes a leaf by its value", () => {
    expect(sizeOf({ key: "db", value: 60 })).toBe(60);
  });

  it("sizes a parent by its children's sum", () => {
    expect(sizeOf({ children: [{ key: "a", value: 60 }], key: "p", value: 999 })).toBe(60);
  });

  it("sizes a parent without children at 0", () => {
    expect(sizeOf({ children: [], key: "p", value: 10 })).toBe(0);
  });

  it.each([
    { label: "a negative value", value: -5 },
    { label: "a value that is not a number", value: Number.NaN },
    { label: "an infinite value", value: Number.POSITIVE_INFINITY },
    { label: "no value", value: undefined },
  ])("sizes a leaf with $label at 0", ({ value }) => {
    expect(sizeOf({ key: "leaf", value })).toBe(0);
  });

  it("sums a parent without the children of size 0", () => {
    expect(
      sizeOf({
        children: [
          { key: "a", value: 30 },
          { key: "b", value: -10 },
        ],
        key: "p",
      }),
    ).toBe(30);
  });

  it("orders nodes largest first", () => {
    expect(largestFirst(SPEND).map((node) => node.key)).toStrictEqual(["data", "web", "search"]);
  });

  it("drops a node of size 0", () => {
    expect(
      largestFirst([
        { key: "a", value: 0 },
        { key: "b", value: 1 },
      ]).map((node) => node.key),
    ).toStrictEqual(["b"]);
  });

  it("counts two levels under a parent of leaves", () => {
    expect(depthOf(SPEND)).toBe(2);
  });

  it("counts one level of leaves", () => {
    expect(depthOf([{ key: "a", value: 1 }])).toBe(1);
  });

  it("counts no level for no node", () => {
    expect(depthOf([])).toBe(0);
  });

  it("counts no level under a node of size 0", () => {
    expect(
      depthOf([
        { key: "a", value: 1 },
        { children: [{ children: [{ key: "credit", value: -5 }], key: "q" }], key: "p" },
      ]),
    ).toBe(1);
  });

  it("lists every leaf depth first", () => {
    expect(hierarchyLeaves(SPEND).map((leaf) => leaf.key)).toStrictEqual([
      "db",
      "cache",
      "cdn",
      "search",
    ]);
  });

  it("gives each leaf its top-level group", () => {
    expect(hierarchyLeaves(SPEND).map((leaf) => leaf.group)).toStrictEqual([
      "data",
      "data",
      "web",
      "search",
    ]);
  });

  it("gives each leaf its share of the whole", () => {
    expect(hierarchyLeaves(SPEND).map((leaf) => leaf.share)).toStrictEqual([0.3, 0.2, 0.25, 0.25]);
  });

  it("names a leaf by its label", () => {
    expect(hierarchyLeaves(SPEND)[0]?.label).toBe("Database");
  });

  it("names a leaf by its key without a label", () => {
    expect(hierarchyLeaves(SPEND)[1]?.label).toBe("cache");
  });

  it("keeps a negative leaf's value", () => {
    const [credit] = hierarchyLeaves([
      { key: "credit", value: -30 },
      { key: "bill", value: 90 },
    ]);

    expect(credit?.value).toBe(-30);
  });

  it("gives a negative leaf a share of 0", () => {
    const [credit] = hierarchyLeaves([
      { key: "credit", value: -30 },
      { key: "bill", value: 90 },
    ]);

    expect(credit?.share).toBe(0);
  });

  it("gives a leaf without a value a value of 0", () => {
    expect(hierarchyLeaves([{ key: "empty" }])[0]?.value).toBe(0);
  });

  it("gives every leaf a share of 0 when nothing has a size", () => {
    expect(hierarchyLeaves([{ key: "a", value: 0 }])[0]?.share).toBe(0);
  });

  it("returns no leaf for no node", () => {
    expect(hierarchyLeaves([])).toStrictEqual([]);
  });
});
