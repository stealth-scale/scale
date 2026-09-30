import { DEFAULT_PREVIEW_OPTIONS, type JsonNode } from "@zag-js/json-tree-utils";
import { describe, expect, it } from "vitest";

import { collectionOf, expandedTo, valueOf } from "#json-tree-view/collection.ts";
import { payout } from "#json-tree-view/json-tree-view.fixtures.tsx";

/**
 * Returns the keys of a node's children, as the last segment of each key path.
 */
function keysOf(node: JsonNode | undefined): readonly unknown[] {
  return (node?.children ?? []).map((child) => child.keyPath.at(-1));
}

describe("collection", () => {
  it("wraps the value in one node at the key path $", () => {
    const { rootNode } = collectionOf(payout(), DEFAULT_PREVIEW_OPTIONS);

    expect(rootNode.children?.map((child) => child.keyPath)).toStrictEqual([["$"]]);
  });

  it("returns a value of letters and digits alone", () => {
    const [top] = collectionOf({ "a key": 1 }, DEFAULT_PREVIEW_OPTIONS).rootNode.children ?? [];

    expect(valueOf(top?.children?.[0] ?? { keyPath: [], type: "null", value: null })).toMatch(
      /^[\da-z]+$/u,
    );
  });

  it("returns two values for a dotted key and the nested keys it spells", () => {
    const collection = collectionOf({ a: { b: 2 }, "a.b": 1 }, DEFAULT_PREVIEW_OPTIONS);
    const values = collection.getValues();

    expect(new Set(values).size).toBe(values.length);
  });

  it("splits an array longer than groupArraysAfterLength into groups", () => {
    const [top] =
      collectionOf([1, 2, 3, 4, 5], { ...DEFAULT_PREVIEW_OPTIONS, groupArraysAfterLength: 2 })
        .rootNode.children ?? [];

    expect(keysOf(top)).toStrictEqual(["[0…1]", "[2…3]", "[4…4]", "length"]);
  });

  it("leaves out a function's source when showNonenumerable is false", () => {
    const [top] =
      collectionOf(
        { settle: (): string => "settled" },
        { ...DEFAULT_PREVIEW_OPTIONS, showNonenumerable: false },
      ).rootNode.children ?? [];

    expect(keysOf(top?.children?.[0])).not.toContain("[[Function]]");
  });

  it.each([
    { depth: 0, want: [] },
    { depth: 1, want: [["$"]] },
    { depth: 2, want: [["$"], ["$", "destination"], ["$", "tags"]] },
  ])("returns the branches at a level of $depth or less", ({ depth, want }) => {
    const collection = collectionOf(payout(), DEFAULT_PREVIEW_OPTIONS);

    expect(expandedTo(collection, depth)).toStrictEqual(
      want.map((keyPath) => valueOf({ keyPath, type: "object", value: undefined })),
    );
  });
});
