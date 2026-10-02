import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { settled } from "#settings/settings.fixtures.ts";

describe("SettingsFrame", () => {
  it("titles the frame Settings", async () => {
    await settled("/settings/host/plugins");

    expect(screen.getByRole("heading", { level: 1, name: "Settings" })).toBeTruthy();
  });

  it("lists the settings pages by rank then by title in the settings menu", async () => {
    await settled("/settings/host/plugins");

    const menu = screen.getByRole("navigation", { name: "Settings pages" });

    expect(
      within(menu)
        .getAllByRole("link")
        .map(({ textContent }) => textContent),
    ).toStrictEqual(["Profile", "Quiet", "Account", "Plugins", "Time off"]);
  });

  it("marks the link of the page on screen as the current page", async () => {
    await settled("/settings/host/plugins");

    expect(screen.getByRole("link", { name: "Plugins" }).getAttribute("aria-current")).toBe("page");
  });

  it("renders the matched settings page below the menu", async () => {
    await settled("/settings/host/plugins");

    expect(screen.getByRole("heading", { name: "Installed plugins" })).toBeTruthy();
  });
});
