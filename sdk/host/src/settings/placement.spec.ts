import { describe, expect, it } from "vitest";

import { pageRouteOf, placedOn, sectionsOn, unplacedOf } from "#settings/placement.ts";
import { sectionIn, SETTLED } from "#settings/settings.fixtures.ts";

const { pages, sections } = SETTLED.settings;

const LISTED = [
  "host/settings/profile/main",
  "host/settings/profile/quiet",
  "host/settings/host/account",
  "host/settings/host/plugins",
  "host/settings/time-off/time-off",
];

describe("placement", () => {
  it("writes a settings page's route id under the settings route", () => {
    expect(pageRouteOf("time-off/time-off")).toBe("host/settings/time-off/time-off");
  });

  it("places a section on its target where the menu lists the target", () => {
    expect(placedOn(sectionIn(SETTLED, "time-off/reminders"), LISTED, pages)).toBe(
      "time-off/time-off",
    );
  });

  it("places a section on its plugin's first listed page where the menu lists no target", () => {
    expect(placedOn(sectionIn(SETTLED, "profile/away"), LISTED, pages)).toBe("profile/main");
  });

  it("places a section on no page where its plugin has no listed page", () => {
    expect(placedOn(sectionIn(SETTLED, "lonely/stray"), LISTED, pages)).toBeUndefined();
  });

  it("ranks a page's sections by order with the unranked after in install order", () => {
    expect(sectionsOn("profile/main", sections, LISTED, pages).map(({ id }) => id)).toStrictEqual([
      "profile/ranked",
      "profile/away",
      "profile/extra",
      "profile/hidden",
    ]);
  });

  it("lists the sections that render on no page", () => {
    expect(unplacedOf(sections, LISTED, pages).map(({ id }) => id)).toStrictEqual(["lonely/stray"]);
  });
});
