import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { Status } from "#steps/status.ts";
import { itemed } from "#steps/steps.fixtures.tsx";

/**
 * Renders a status with a word for every state inside the item at the index given.
 *
 * @param step - The flow's current step.
 * @param index - Index of the item.
 * @returns The item's text.
 */
async function shown(step: number, index: number): Promise<null | string> {
  await drawn(
    itemed(
      <span data-testid="status">
        <Status complete="done" current="now" incomplete="later" />
      </span>,
      { defaultStep: step },
      index,
    ),
  );

  return screen.getByTestId("status").textContent;
}

describe("Status", () => {
  it("renders complete for a completed step", async () => {
    await expect(shown(2, 0)).resolves.toBe("done");
  });

  it("renders current for the current step", async () => {
    await expect(shown(1, 1)).resolves.toBe("now");
  });

  it("renders incomplete for a later step", async () => {
    await expect(shown(0, 2)).resolves.toBe("later");
  });

  it("renders the step's number for a state without a prop", async () => {
    await drawn(
      itemed(
        <span data-testid="status">
          <Status complete="done" />
        </span>,
        {},
        1,
      ),
    );

    expect(screen.getByTestId("status").textContent).toBe("2");
  });
});
