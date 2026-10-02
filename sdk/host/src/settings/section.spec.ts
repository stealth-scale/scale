import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { waited } from "#parts/parts.fixtures.tsx";
import { settled } from "#settings/settings.fixtures.ts";

describe("SettingsSection", () => {
  it("names the section by its heading in its plugin's catalogue", async () => {
    await settled("/settings/time-off/time-off");

    expect(screen.getByRole("heading", { name: "Reminders" })).toBeTruthy();
  });

  it("renders a form for a section with a schema", async () => {
    await settled("/settings/time-off/time-off");

    const section = screen.getByRole("region", { name: "Reminders" });

    expect(within(section).getByRole("button", { name: "Save" })).toBeTruthy();
  });

  it("renders the manifest's component for a section without a schema", async () => {
    await settled("/settings/host/account");
    await waited();

    const section = screen.getByRole("region", { name: "Picture" });

    expect(within(section).getByText("avatar profile/avatar")).toBeTruthy();
  });
});
