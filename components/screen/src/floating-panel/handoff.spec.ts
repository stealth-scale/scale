import { describe, expect, it } from "vitest";

import { handOff, track, untrack } from "#floating-panel/handoff.ts";

/**
 * Describes the stage triggers of a built panel, by the stage each sets.
 */
interface Triggers {
  /**
   * Restore.
   */
  readonly default: HTMLButtonElement;

  /**
   * Maximize.
   */
  readonly maximized: HTMLButtonElement;

  /**
   * Minimize.
   */
  readonly minimized: HTMLButtonElement;
}

/**
 * Appends a stage trigger to a panel.
 *
 * @param panel - The panel.
 * @param stage - The stage the trigger sets.
 * @param hidden - Stages whose trigger is hidden.
 */
function button(panel: HTMLElement, stage: string, hidden: readonly string[]): HTMLButtonElement {
  const trigger = document.createElement("button");

  trigger.dataset["part"] = "stage-trigger";
  trigger.dataset["stage"] = stage;
  trigger.hidden = hidden.includes(stage);
  panel.append(trigger);

  return trigger;
}

/**
 * Builds a panel with a trigger for each stage in the document.
 *
 * @param hidden - Stages whose trigger is hidden.
 */
function built(hidden: readonly string[] = []): Triggers {
  const panel = document.createElement("div");

  panel.dataset["scope"] = "floating-panel";
  panel.dataset["part"] = "content";
  document.body.append(panel);

  return {
    default: button(panel, "default", hidden),
    maximized: button(panel, "maximized", hidden),
    minimized: button(panel, "minimized", hidden),
  };
}

describe("handOff", () => {
  it("moves focus to the named stage's trigger from a trigger with a record", () => {
    const { default: restore, minimized } = built(["default"]);

    track({ currentTarget: minimized });
    restore.hidden = false;
    minimized.hidden = true;
    handOff(minimized, "default");

    expect(document.activeElement).toBe(restore);
  });

  it("moves focus from a trigger that still has the document's focus", () => {
    const { default: restore, maximized } = built(["default"]);

    maximized.focus();
    restore.hidden = false;
    handOff(maximized, "default");

    expect(document.activeElement).toBe(restore);
  });

  it("leaves focus alone for a trigger without a record or focus", () => {
    const { default: restore, minimized } = built();

    handOff(minimized, "default");

    expect(document.activeElement).not.toBe(restore);
  });

  it("leaves focus alone once the record is deleted", () => {
    const { default: restore, minimized } = built();

    track({ currentTarget: minimized });
    untrack({ currentTarget: minimized });
    handOff(minimized, "default");

    expect(document.activeElement).not.toBe(restore);
  });

  it("skips a hidden trigger of the named stage", () => {
    const { default: restore, minimized } = built(["default"]);

    track({ currentTarget: minimized });
    handOff(minimized, "default");

    expect(document.activeElement).not.toBe(restore);
  });
});
