import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { internalsOf } from "#host/internals.ts";
import { changed } from "#parts/parts.fixtures.tsx";
import { SectionsProbe } from "#settings/sections.fixtures.tsx";
import { settled } from "#settings/settings.fixtures.ts";

interface Read {
  readonly listed: readonly string[];
  readonly shown: readonly string[];
}

function readOf(): Read {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the probe writes the hook's result as JSON
  return JSON.parse(screen.getByRole("status").textContent) as Read;
}

describe("useSections", () => {
  it("lists the routes of the settings menu in menu order", async () => {
    await settled("/settings/host/plugins", { frame: SectionsProbe });

    expect(readOf().listed).toStrictEqual([
      "host/settings/profile/main",
      "host/settings/profile/quiet",
      "host/settings/host/account",
      "host/settings/host/plugins",
      "host/settings/time-off/time-off",
    ]);
  });

  it("returns the sections whose plugin is on and whose condition is true", async () => {
    await settled("/settings/host/plugins", { frame: SectionsProbe });

    expect(readOf().shown).toStrictEqual([
      "time-off/reminders",
      "profile/avatar",
      "profile/away",
      "profile/extra",
      "profile/ranked",
      "lonely/stray",
      "lonely/visiting",
    ]);
  });

  it("leaves out the sections of a plugin that turns off", async () => {
    const { host } = await settled("/settings/host/plugins", { frame: SectionsProbe });

    await changed(() => {
      internalsOf(host).switches.set("profile", false);
    });

    expect(readOf().shown).toStrictEqual(["time-off/reminders", "lonely/stray", "lonely/visiting"]);
  });
});
