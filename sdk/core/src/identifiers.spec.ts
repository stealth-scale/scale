import { describe, expect, expectTypeOf, it } from "vitest";

import { HOST, isName, isPluginId, pluginOf, qualify } from "#identifiers.ts";

describe("identifiers", () => {
  it.each(["time-off", "billing", "inventory2", "ab", "a".repeat(32), HOST])(
    "returns true for the plugin id %s",
    (id) => {
      expect(isPluginId(id)).toBe(true);
    },
  );

  it.each([
    "a",
    "a".repeat(33),
    "Time-off",
    "time_off",
    "time--off",
    "-time",
    "time-",
    "2fa",
    "time off",
    "time/off",
    "",
  ])("returns false for the plugin id %s", (id) => {
    expect(isPluginId(id)).toBe(false);
  });

  it.each(["overview", "request.approve", "item-sidebar", "halfDays", "a", "v2"])(
    "returns true for the name %s",
    (name) => {
      expect(isName(name)).toBe(true);
    },
  );

  it.each([
    "",
    "Overview",
    "request..approve",
    ".approve",
    "request.",
    "request approve",
    "time-off/request",
    "2fa",
    "a_b",
  ])("returns false for the name %s", (name) => {
    expect(isName(name)).toBe(false);
  });

  it("joins the plugin id and the name with a slash", () => {
    const id = qualify("time-off", "request.approve");

    expect(id).toBe("time-off/request.approve");

    expectTypeOf(id).toEqualTypeOf<"time-off/request.approve">();
  });

  it.each([
    { id: "time-off/request.approve", want: "time-off" },
    { id: "overview", want: "overview" },
  ])("returns $want as the plugin of $id", ({ id, want }) => {
    expect(pluginOf(id)).toBe(want);
  });
});
