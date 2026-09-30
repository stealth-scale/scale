import { type ReactElement } from "react";

import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Actions, Description, Title } from "#tour/index.ts";
import { started, steps } from "#tour/tour.fixtures.tsx";

/**
 * Renders a card that lists the labels of the step's actions.
 *
 * @returns The title, the description and the labels in the description's place.
 */
function listed(): ReactElement {
  return (
    <>
      <Title />
      <Description>
        <Actions>{(actions) => actions.map((action) => action.label).join(", ") || "none"}</Actions>
      </Description>
    </>
  );
}

describe("Actions", () => {
  it("passes the step's actions to its children", async () => {
    const { container } = await started({ card: listed() });

    expect(slotElement(container, "tour", "description").textContent).toBe("Start");
  });

  it("passes an empty array on a step without actions", async () => {
    const { container } = await started({
      card: listed(),
      options: { steps: steps().map(({ actions: _actions, ...step }) => step) },
    });

    expect(slotElement(container, "tour", "description").textContent).toBe("none");
  });
});
