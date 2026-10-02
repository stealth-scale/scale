import { describe, expect, it } from "vitest";

import { waited } from "#parts/parts.fixtures.tsx";
import { settled } from "#settings/settings.fixtures.ts";

describe("SettingsIndex", () => {
  it("opens the first page of the settings menu at the settings address", async () => {
    const { router } = await settled("/settings");

    await waited();

    expect(router.state.location.pathname).toBe("/settings/profile/main");
  });

  it("replaces the settings address in the history", async () => {
    const { router } = await settled("/settings");

    await waited();

    expect(router.state.location.state).toMatchObject({ __TSR_index: 0 });
  });
});
