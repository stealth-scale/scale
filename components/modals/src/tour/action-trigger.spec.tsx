import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";

import { ActionTrigger, Description, type StepDetails, Title } from "#tour/index.ts";
import { framed, started, stepped, steps } from "#tour/tour.fixtures.tsx";

/**
 * Returns the fixture's steps with the first step's actions replaced.
 *
 * @param actions - The first step's actions.
 */
function opening(actions: NonNullable<StepDetails["actions"]>): StepDetails[] {
  return steps().map((step, index) => (index === 0 ? Object.assign(step, { actions }) : step));
}

describe("ActionTrigger", () => {
  it("renders a button", async () => {
    await started();

    expect(screen.getByRole("button", { name: "Start" }).tagName).toBe("BUTTON");
  });

  it("takes its name from the action's label", async () => {
    await started();

    expect(screen.getByRole("button", { name: "Start" }).hasAttribute("aria-label")).toBe(false);
  });

  it("moves to the next step for a next action", async () => {
    await started();
    await stepped("Start");

    expect(screen.getByRole("dialog", { name: "Search" })).toBeDefined();
  });

  it("moves to the previous step for a prev action", async () => {
    await started();
    await stepped("Start");
    await stepped("Back");

    expect(screen.getByRole("dialog", { name: "Welcome" })).toBeDefined();
  });

  it("ends the tour for a dismiss action", async () => {
    await started();
    await stepped("Start");
    await stepped("Next");
    await stepped("Done");
    await framed();

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("ends the tour for a skip action", async () => {
    await started({ options: { steps: opening([{ action: "skip", label: "Skip" }]) } });
    await stepped("Skip");
    await framed();

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("runs a function action with the machine's actions", async () => {
    await started({
      options: {
        steps: opening([
          {
            action: ({ goto }): void => {
              goto("export");
            },
            label: "Jump",
          },
        ]),
      },
    });
    await stepped("Jump");

    expect(screen.getByRole("dialog", { name: "Export" })).toBeDefined();
  });

  it("sets aria-disabled for a prev action on the first step", async () => {
    await started({ options: { steps: opening([{ action: "prev", label: "Back" }]) } });

    expect(screen.getByRole("button", { name: "Back" }).getAttribute("aria-disabled")).toBe("true");
  });

  it("keeps the step on a press of a disabled action", async () => {
    await started({ options: { steps: opening([{ action: "prev", label: "Back" }]) } });
    await pressed(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByRole("dialog", { name: "Welcome" })).toBeDefined();
  });

  it("leaves disabled off a prev action on the first step", async () => {
    await started({ options: { steps: opening([{ action: "prev", label: "Back" }]) } });

    expect(screen.getByRole("button", { name: "Back" }).hasAttribute("disabled")).toBe(false);
  });

  it("shows its children in place of the label", async () => {
    await started({
      card: (
        <>
          <Title />
          <Description />
          <ActionTrigger action={{ action: "next", label: "Start" }}>Show me around</ActionTrigger>
        </>
      ),
    });

    expect(screen.getByRole("button", { name: "Show me around" })).toBeDefined();
  });
});
