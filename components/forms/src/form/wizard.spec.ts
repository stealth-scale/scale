import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Presentation, type Schema } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";

import { generated, type Setup } from "#form/form.fixtures.tsx";

const PROFILE: Schema = {
  properties: { bio: { type: "string" }, name: { minLength: 2, type: "string" } },
  required: ["name"],
  type: "object",
};

const WIZARD: Presentation<Record<string, unknown>> = {
  id: "profile",
  steps: {
    kind: "wizard",
    of: [
      { name: "who", of: ["name"] },
      { name: "about", of: ["bio"] },
    ],
  },
};

/**
 * Renders the profile as a wizard, without the fixture's own submit button.
 */
async function wizard(setup: Setup = {}): Promise<void> {
  await drawn(generated(PROFILE, { presentation: WIZARD, submit: false, ...setup }));
}

/**
 * Fills the first step in and moves to the second.
 */
async function moved(): Promise<void> {
  fireEvent.change(screen.getByRole("textbox", { name: "Name" }), { target: { value: "Ada" } });
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  await settled();
}

describe("Wizard", () => {
  it("renders the steps as a progress list with an item per step", async () => {
    await wizard();

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders the step's heading at level 2", async () => {
    await wizard();

    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Who");
  });

  it("renders the step's heading at the level the form states", async () => {
    await wizard({ headingLevel: 3 });

    expect(screen.getByRole("heading", { level: 3 }).textContent).toBe("Who");
  });

  it("renders no back button on the first step", async () => {
    await wizard();

    expect(screen.queryByRole("button", { name: "Back" })).toBeNull();
  });

  it("moves forward once the step passes", async () => {
    await wizard();
    await moved();

    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("About");
  });

  it("moves focus to the step's heading after a move", async () => {
    await wizard();
    await moved();

    expect(document.activeElement).toBe(screen.getByRole("heading", { level: 2 }));
  });

  it("renders the submit button in place of next on the last step", async () => {
    await wizard();
    await moved();

    expect([
      screen.queryByRole("button", { name: "Next" }),
      screen.getByRole("button", { name: "Submit" }).getAttribute("type"),
    ]).toStrictEqual([null, "submit"]);
  });

  it("moves back to the step before", async () => {
    await wizard();
    await moved();
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    await settled();

    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Who");
  });
});
