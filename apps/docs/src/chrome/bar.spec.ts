import { within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { opened } from "#app.fixtures.tsx";
import { THEMES } from "#themes.ts";

describe("Bar", () => {
  it("draws the row as a toolbar named for what it acts on", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("toolbar", { name: "Docs" })).toBeDefined();
  });

  it("gathers every control under one tab stop", async () => {
    const result = await opened("/components/actions/button");
    const row = result.getByRole("toolbar", { name: "Docs" });
    const controls = Array.from(row.querySelectorAll<HTMLElement>("a, button"));

    expect(controls).toHaveLength(6);
    expect(controls.filter((control) => control.tabIndex === 0)).toHaveLength(1);
  });

  it("offers the width the page is held to", async () => {
    const result = await opened("/components/actions/button");
    const row = result.getByRole("toolbar", { name: "Docs" });

    expect(within(row).getByRole("button", { name: "Width Window" })).toBeDefined();
  });

  it("offers no language where the shell offers one", async () => {
    const result = await opened("/components/actions/button");
    const row = result.getByRole("toolbar", { name: "Docs" });

    expect(within(row).queryByRole("button", { name: /^Language/u })).toBeNull();
  });

  it("draws the brand", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("link", { name: "Stealth Scale" })).toBeDefined();
  });

  it("draws the link to the catalogue", async () => {
    const result = await opened("/components/actions/button");
    const row = result.getByRole("toolbar", { name: "Docs" });

    expect(within(row).getByRole("link", { name: "Components" })).toBeDefined();
  });

  it("names the control that opens the navigation in words a glyph cannot say", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("button", { name: "Toggle navigation" }).textContent).toBe("");
  });

  it("names the theme in force", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("button", { name: `Theme ${THEMES[0] ?? ""}` })).toBeDefined();
  });

  it("offers the switch between light and dark", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("button", { name: "Dark mode" }).getAttribute("aria-pressed")).toBe(
      "false",
    );
  });
});
