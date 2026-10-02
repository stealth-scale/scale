import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Presentation, type Schema } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";

import { generated } from "#form/form.fixtures.tsx";

const PROFILE: Schema = {
  properties: { bio: { type: "string" }, name: { type: "string" } },
  type: "object",
};

const TABS: Presentation<Record<string, unknown>> = {
  id: "profile",
  steps: {
    kind: "tabs",
    of: [
      { name: "who", of: ["name"] },
      { name: "about", of: ["bio"] },
    ],
  },
};

/**
 * Renders the profile in tabs, without the fixture's own submit button.
 */
async function tabbed(): Promise<void> {
  await drawn(generated(PROFILE, { presentation: TABS, submit: false }));
}

/**
 * Picks the tab of the name given.
 */
async function picked(name: string): Promise<void> {
  const tab = screen.getByRole("tab", { name });

  act(() => {
    tab.focus();
  });
  fireEvent.click(tab);
  await settled();
}

describe("Tabbed", () => {
  it("renders a tab per step", async () => {
    await tabbed();

    expect(screen.getAllByRole("tab").map((tab) => tab.textContent)).toStrictEqual([
      "Who",
      "About",
    ]);
  });

  it("shows the fields of the selected tab in its panel", async () => {
    await tabbed();

    expect(
      screen.getByRole("tabpanel").contains(screen.getByRole("textbox", { name: "Name" })),
    ).toBe(true);
  });

  it("moves to the tab a person picks", async () => {
    await tabbed();
    await picked("About");

    expect(screen.getByRole("textbox", { name: "Bio" })).toBeDefined();
  });

  it("leaves focus on the tab a person picks", async () => {
    await tabbed();
    await picked("About");

    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "About" }));
  });

  it("renders the submit button after the panels", async () => {
    await tabbed();

    expect(screen.getByRole("button", { name: "Submit" }).getAttribute("type")).toBe("submit");
  });
});
