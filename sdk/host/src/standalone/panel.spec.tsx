import { within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { opened, panelOf } from "#standalone/workbench.fixtures.tsx";

describe("StandalonePanel", () => {
  it("renders a dialog its title names", async () => {
    expect(panelOf(await opened())).toBeTruthy();
  });

  it("renders no stage trigger without the page's glyphs", async () => {
    const page = await opened();

    expect(within(panelOf(page)).queryByRole("button", { name: "Minimize" })).toBeNull();
  });

  it("renders the minimize trigger with its glyph", async () => {
    const page = await opened({
      glyphs: { minimize: <span>min</span>, restore: <span>max</span> },
    });

    expect(within(panelOf(page)).getByRole("button", { name: "Minimize" }).textContent).toBe("min");
  });

  it("renders the restore trigger with its glyph", async () => {
    const page = await opened({
      glyphs: { minimize: <span>min</span>, restore: <span>max</span> },
    });

    expect(
      within(panelOf(page)).getByText("max").closest("button")?.getAttribute("aria-label"),
    ).toBe("Restore");
  });
});
