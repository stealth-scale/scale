import { createElement, Fragment } from "react";

import { render } from "@testing-library/react";
import {
  getRootNode,
  type JsonNode,
  type JsonNodeElement,
  jsonNodeToElement,
} from "@zag-js/json-tree-utils";
import { describe, expect, it } from "vitest";

import { closerOf, rendered, spanOf } from "#json-tree-view/value.ts";

/**
 * Returns the node the utilities build for a value, below the root node they wrap it in.
 */
function nodeOf(value: unknown): JsonNode {
  const [node] = getRootNode(value).children ?? [];

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the utilities wrap every value in exactly one node
  return node as JsonNode;
}

/**
 * Returns the preview element the utilities build for a value.
 */
function previewOf(value: unknown): JsonNodeElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the utilities build every preview's top as an element
  return jsonNodeToElement(nodeOf(value)) as JsonNodeElement;
}

describe("value", () => {
  it("renders an element as a span with data-type and data-kind", () => {
    const { container } = render(createElement(Fragment, null, rendered(previewOf("Ada"))));
    const span = container.querySelector("span");

    expect([span?.dataset["type"], span?.dataset["kind"], span?.textContent]).toStrictEqual([
      "string",
      "preview",
      '"Ada"',
    ]);
  });

  it("renders the punctuation of a preview in spans with their kinds", () => {
    const { container } = render(createElement(Fragment, null, rendered(previewOf([1, 2]))));

    expect(
      [...container.querySelectorAll("[data-kind=brace]")].map((each) => each.textContent),
    ).toStrictEqual(["[", "]"]);
  });

  it("renders the children spanOf is given in a span with the element's type", () => {
    const { container } = render(createElement(Fragment, null, spanOf(previewOf(42), "forty-two")));
    const span = container.querySelector("span");

    expect([span?.dataset["type"], span?.textContent]).toStrictEqual(["number", "forty-two"]);
  });

  it.each([
    { name: "an object", value: { a: 1 }, want: "}" },
    { name: "an array", value: [1], want: "]" },
    { name: "a map", value: new Map([["a", 1]]), want: "}" },
    { name: "a function", value: (): number => 1, want: undefined },
    { name: "an error", value: new Error("held"), want: undefined },
  ])("returns $want as the closing brace of $name", ({ value, want }) => {
    expect(closerOf(previewOf(value))).toBe(want);
  });
});
