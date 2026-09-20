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

    expect(controls).toHaveLength(5);
    expect(controls.filter((control) => control.tabIndex === 0)).toHaveLength(1);
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

  it("stands the brand and the sections an extra large gap apart in a row of their own", async () => {
    const result = await opened("/components/actions/button");
    const row = result.getByRole("toolbar", { name: "Docs" });
    const brand = within(row).getByRole("link", { name: "Stealth Scale" });
    const section = within(row).getByRole("link", { name: "Components" });

    expect(brand.parentElement).toBe(section.parentElement);
    expect(brand.parentElement?.classList.contains("stack--xl")).toBe(true);
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
