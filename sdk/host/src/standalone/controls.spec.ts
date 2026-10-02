import { within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { opened, panelOf } from "#standalone/workbench.fixtures.tsx";

const GROUPS = [
  "Session",
  "Checks on one resource",
  "Feature flags",
  "Plugin",
  "Operations",
  "Display",
];

describe("PanelControls", () => {
  it("renders the groups from session to display", async () => {
    const panel = within(panelOf(await opened()));

    expect(panel.getAllByRole("group")).toStrictEqual(
      GROUPS.map((name) => panel.getByRole("group", { name })),
    );
  });

  it("renders the page picker before the groups", async () => {
    const panel = within(panelOf(await opened()));
    const [first] = panel.getAllByRole("combobox");

    expect(first).toBe(panel.getByRole("combobox", { name: "Page" }));
  });
});
