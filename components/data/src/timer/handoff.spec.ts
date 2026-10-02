import { describe, expect, it } from "vitest";

import { handOff, track, untrack } from "#timer/handoff.ts";

/**
 * Moves focus to the body, then builds a timer root with a hidden Start and a shown Pause trigger,
 * and returns the two triggers.
 */
function triggers(): readonly [HTMLButtonElement, HTMLButtonElement] {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();

  const root = document.createElement("div");
  const start = document.createElement("button");
  const pause = document.createElement("button");

  Object.assign(root.dataset, { part: "root", scope: "timer" });

  for (const button of [start, pause]) {
    Object.assign(button.dataset, { part: "action-trigger", scope: "timer" });
    root.append(button);
  }

  start.hidden = true;
  document.body.append(root);

  return [start, pause];
}

describe("handoff", () => {
  it("moves focus to the first trigger that shows from a hidden trigger with a record", () => {
    const [start, pause] = triggers();

    track({ currentTarget: start });
    handOff(start);

    expect(document.activeElement).toBe(pause);
  });

  it("moves focus from a hidden trigger that has the document's focus", () => {
    const [start, pause] = triggers();

    start.hidden = false;
    start.focus();
    start.hidden = true;
    handOff(start);

    expect(document.activeElement).toBe(pause);
  });

  it("deletes the record of a trigger that loses focus", () => {
    const [start] = triggers();

    track({ currentTarget: start });
    untrack({ currentTarget: start });
    handOff(start);

    expect(document.activeElement).toBe(document.body);
  });

  it("deletes the record once it moves focus", () => {
    const [start, pause] = triggers();

    track({ currentTarget: start });
    handOff(start);
    pause.blur();
    handOff(start);

    expect(document.activeElement).toBe(document.body);
  });

  it("leaves focus alone for a trigger without a record", () => {
    const [start] = triggers();

    handOff(start);

    expect(document.activeElement).toBe(document.body);
  });
});
