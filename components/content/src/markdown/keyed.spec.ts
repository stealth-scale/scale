import { isValidElement } from "react";

import { describe, expect, it } from "vitest";

import { each } from "#markdown/keyed.tsx";

describe("each", () => {
  it("keys each rendered node by its index", () => {
    const rendered = each(["a", "b"], (node) => node);

    expect(rendered.map((element) => (isValidElement(element) ? element.key : null))).toStrictEqual(
      ["0", "1"],
    );
  });

  it("passes each node and its index to the renderer", () => {
    const seen: Array<[string, number]> = [];
    const rendered = each(["a", "b"], (node, index) => {
      seen.push([node, index]);

      return node;
    });

    expect([seen, rendered.length]).toStrictEqual([
      [
        ["a", 0],
        ["b", 1],
      ],
      2,
    ]);
  });
});
