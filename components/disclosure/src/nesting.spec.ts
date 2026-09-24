import { describe, expect, it } from "vitest";

import { type Dismissal, dismissNested } from "#nesting.ts";

/**
 * Returns the element with the id, and throws when the document has none.
 */
function byId(id: string): HTMLElement {
  const element = document.querySelector<HTMLElement>(`#${id}`);

  if (element === null) throw new Error(`no element with the id ${id}`);

  return element;
}

/**
 * Renders the markup into the document and returns the event a machine passes to `onRequestDismiss`
 * for the panel `child`, with the panel `parent` removed when the markup has one.
 */
function dismissalIn(markup: string): Dismissal {
  document.body.innerHTML = markup;

  return new CustomEvent("layer:request-dismiss", {
    cancelable: true,
    detail: {
      originalLayer: byId("child"),
      targetLayer: document.querySelector<HTMLElement>("#parent") ?? undefined,
    },
  });
}

describe("dismissNested", () => {
  it("leaves the dismissal when the removed panel contains the control of the closing panel", () => {
    const event = dismissalIn(
      '<div id="parent"><button aria-controls="child">Share</button></div><div id="child"></div>',
    );

    dismissNested(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it("cancels the dismissal when the control of the closing panel is outside the removed panel", () => {
    const event = dismissalIn(
      '<div id="parent"></div><button aria-controls="child">Format</button><div id="child"></div>',
    );

    dismissNested(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it("cancels the dismissal when no element controls the closing panel", () => {
    const event = dismissalIn('<div id="parent"></div><div id="child"></div>');

    dismissNested(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it("cancels the dismissal when no panel is removed", () => {
    const event = dismissalIn(
      '<button aria-controls="child">Format</button><div id="child"></div>',
    );

    dismissNested(event);

    expect(event.defaultPrevented).toBe(true);
  });
});
