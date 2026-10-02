import { within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";

import { opened } from "#app.fixtures.tsx";
import { narrowed } from "#chrome/chrome.fixtures.tsx";
import { THEMES } from "#themes.ts";

describe("Bar", () => {
  it("renders a toolbar named Docs", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("toolbar", { name: "Docs" })).toBeDefined();
  });

  it("renders six controls behind one tab stop", async () => {
    const result = await opened("/components/actions/button");
    const row = result.getByRole("toolbar", { name: "Docs" });
    const controls = Array.from(row.querySelectorAll<HTMLElement>("a, button"));

    expect(controls).toHaveLength(6);
    expect(controls.filter((control) => control.tabIndex === 0)).toHaveLength(1);
  });

  it("renders the width switcher on a wide window", async () => {
    const result = await opened("/components/actions/button");
    const row = result.getByRole("toolbar", { name: "Docs" });

    expect(within(row).getByRole("button", { name: "Width Window" })).toBeDefined();
  });

  it("renders no language switcher when the shell offers one locale", async () => {
    const result = await opened("/components/actions/button");
    const row = result.getByRole("toolbar", { name: "Docs" });

    expect(within(row).queryByRole("button", { name: /^Language/u })).toBeNull();
  });

  it("renders the brand link", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("link", { name: "Stealth Scale" })).toBeDefined();
  });

  it("renders the brand in the start band beside the catalogue link", async () => {
    const result = await opened("/components/actions/button");
    const row = result.getByRole("toolbar", { name: "Docs" });
    const brand = within(row).getByRole("link", { name: "Stealth Scale" });
    const section = within(row).getByRole("link", { name: "Catalogue" });

    expect(brand.parentElement).toBe(section.parentElement);
    expect(brand.parentElement?.classList.contains("toolbar__start")).toBe(true);
  });

  it("renders the catalogue link on a wide window", async () => {
    const result = await opened("/components/actions/button");
    const row = result.getByRole("toolbar", { name: "Docs" });

    expect(within(row).getByRole("link", { name: "Catalogue" })).toBeDefined();
  });

  it("renders no catalogue link in the row on a narrow window", async () => {
    narrowed();
    const result = await opened("/components/actions/button");
    const row = result.getByRole("toolbar", { name: "Docs" });

    expect(within(row).queryByRole("link", { name: "Catalogue" })).toBeNull();
  });

  it("lists the catalogue link in the sections menu on a narrow window", async () => {
    narrowed();
    const result = await opened("/components/actions/button");
    const row = result.getByRole("toolbar", { name: "Docs" });

    await pressed(within(row).getByRole("button", { name: "Sections" }));

    expect(result.getByRole("menuitem", { name: "Catalogue" }).getAttribute("href")).toBe("/");
  });

  it("names the icon-only navigation control Toggle navigation", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("button", { name: "Toggle navigation" }).textContent).toBe("");
  });

  it("names the theme switcher after the theme in force", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("button", { name: `Theme ${THEMES[0] ?? ""}` })).toBeDefined();
  });

  it("renders the dark mode toggle unpressed in light mode", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("button", { name: "Dark mode" }).getAttribute("aria-pressed")).toBe(
      "false",
    );
  });
});
