import { act, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import {
  blurredOnHide,
  composed,
  opened,
  panel,
} from "#floating-panel/floating-panel.fixtures.tsx";
import { StageTrigger } from "#floating-panel/index.ts";

/**
 * Returns the stage trigger that sets a stage, shown or hidden.
 *
 * @param stage - The stage the trigger sets.
 */
function trigger(stage: string): HTMLButtonElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the fixture renders one button per stage
  return panel().querySelector(
    `[data-part="stage-trigger"][data-stage="${stage}"]`,
  ) as HTMLButtonElement;
}

/**
 * Returns the names of the stage triggers that show, in the order they render.
 */
function shown(): string[] {
  return [...panel().querySelectorAll<HTMLButtonElement>('[data-part="stage-trigger"]')]
    .filter((element) => element.hidden === false)
    .map((element) => element.getAttribute("aria-label") ?? "");
}

/**
 * Presses a trigger that has focus.
 *
 * @param stage - The stage the trigger sets.
 */
async function focusedPress(stage: string): Promise<void> {
  act(() => {
    trigger(stage).focus();
  });
  await pressed(trigger(stage));
}

describe("StageTrigger", () => {
  it("renders the library's button with the stage trigger class", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect([...slotElement(container, "floating-panel", "stageTrigger").classList]).toContain(
      "button",
    );
  });

  it.each([
    { name: "Minimize", stage: "minimized" },
    { name: "Maximize", stage: "maximized" },
    { name: "Restore", stage: "default" },
  ])("names the $stage trigger $name when label is absent", async ({ name, stage }) => {
    await drawn(composed({ defaultOpen: true }));

    expect(trigger(stage).getAttribute("aria-label")).toBe(name);
  });

  it("takes its name from label", async () => {
    await drawn(
      opened(
        <StageTrigger label="Réduire" stage="minimized">
          _
        </StageTrigger>,
      ),
    );

    expect(screen.getByRole("button", { name: "Réduire" })).toBeDefined();
  });

  it("shows Minimize and Maximize while the panel is at its size", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(shown()).toStrictEqual(["Minimize", "Maximize"]);
  });

  it("shows Restore alone while the panel is minimized", async () => {
    await drawn(composed({ defaultOpen: true }));
    await pressed(trigger("minimized"));

    expect(shown()).toStrictEqual(["Restore"]);
  });

  it("shows Restore alone while the panel is maximized", async () => {
    await drawn(composed({ defaultOpen: true }));
    await pressed(trigger("maximized"));

    expect(shown()).toStrictEqual(["Restore"]);
  });

  it("hides every stage trigger when resizable is false", async () => {
    await drawn(composed({ defaultOpen: true, resizable: false }));

    expect(shown()).toStrictEqual([]);
  });

  it("minimizes the panel on a press", async () => {
    await drawn(composed({ defaultOpen: true }));
    await pressed(trigger("minimized"));

    expect(panel().dataset["minimized"]).toBe("");
  });

  it("restores the panel on a press of Restore", async () => {
    await drawn(composed({ defaultOpen: true }));
    await pressed(trigger("maximized"));
    await pressed(trigger("default"));

    expect(panel().dataset["staged"]).toBeUndefined();
  });

  it("moves focus to Restore when Minimize hides with focus", async () => {
    await drawn(composed({ defaultOpen: true }));
    blurredOnHide();
    await focusedPress("minimized");

    expect(document.activeElement).toBe(trigger("default"));
  });

  it("moves focus to Maximize when Restore hides after a maximize", async () => {
    await drawn(composed({ defaultOpen: true }));
    blurredOnHide();
    await focusedPress("maximized");
    await focusedPress("default");

    expect(document.activeElement).toBe(trigger("maximized"));
  });

  it("moves focus to Minimize when Restore hides after a minimize", async () => {
    await drawn(composed({ defaultOpen: true }));
    blurredOnHide();
    await focusedPress("minimized");
    await focusedPress("default");

    expect(document.activeElement).toBe(trigger("minimized"));
  });

  it("leaves focus where it is when a trigger without focus hides", async () => {
    await drawn(composed({ defaultOpen: true }));
    act(() => {
      screen.getByRole("textbox", { name: "Note" }).focus();
    });
    await pressed(trigger("maximized"));

    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Note" }));
  });
});
