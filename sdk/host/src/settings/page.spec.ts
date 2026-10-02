import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { waited } from "#parts/parts.fixtures.tsx";
import { settled } from "#settings/settings.fixtures.ts";

describe("settingsPageOf", () => {
  it("renders the sections that target the page", async () => {
    await settled("/settings/time-off/time-off");

    expect(screen.getByRole("region", { name: "Reminders" })).toBeTruthy();
  });

  it("renders a section whose target page is not rendered on its plugin's first page", async () => {
    await settled("/settings/profile/main");
    await waited();

    expect(screen.getByText("away")).toBeTruthy();
  });

  it("renders no section whose condition is false", async () => {
    await settled("/settings/profile/main");
    await waited();

    expect(screen.queryByText("hidden")).toBeNull();
  });

  it("states that a page has nothing to set where no section renders on it", async () => {
    await settled("/settings/profile/quiet");

    expect(screen.getByRole("heading", { name: "Nothing to set on this page" })).toBeTruthy();
  });

  it("titles the document with the page's title", async () => {
    await settled("/settings/time-off/time-off");

    expect(document.title).toBe("Time off · People");
  });

  it("renders the list of plugins on the Plugins page", async () => {
    await settled("/settings/host/plugins");

    expect(screen.getByRole("region", { name: "Installed plugins" })).toBeTruthy();
  });
});
