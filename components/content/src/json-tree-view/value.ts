/**
 * Renders the element tree the utilities build for a value's preview, and reads the brace that
 * closes it.
 *
 * @remarks
 *   The utilities build every element as a `span` with the value's type in `nodeType` and the
 *   punctuation's kind in `kind`, which render as `data-type` and `data-kind`. The children are
 *   passed to `createElement` one by one, so they do not need keys.
 */

import { createElement, type ReactNode } from "react";

import { type JsonNodeElement, type JsonNodeHastElement } from "@zag-js/json-tree-utils";

/**
 * Renders children in a span with an element's type and kind.
 */
export function spanOf(element: JsonNodeElement, ...children: ReactNode[]): ReactNode {
  return createElement(
    "span",
    { "data-kind": element.properties.kind, "data-type": element.properties.nodeType },
    ...children,
  );
}

/**
 * Renders a preview's element tree as spans.
 *
 * @param element - An element or a text of the tree.
 * @returns The span, or the text.
 */
export function rendered(element: JsonNodeHastElement): ReactNode {
  if (element.type === "text") return element.value;

  return spanOf(element, ...element.children.map((child) => rendered(child)));
}

/**
 * Returns the brace that closes a branch's preview: `}` for an object, a map or a set, `]` for an
 * array, and nothing for a preview without braces, such as a function's or an error's.
 *
 * @param element - The preview's top element.
 * @returns The brace, or nothing.
 */
export function closerOf(element: JsonNodeElement): string | undefined {
  const brace = element.children.findLast(
    (child): child is JsonNodeElement =>
      child.type === "element" && child.properties.kind === "brace",
  );
  const [text] = brace?.children ?? [];

  return text?.type === "text" ? String(text.value).trim() : undefined;
}
