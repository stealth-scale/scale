import { describe, expect, expectTypeOf, it } from "vitest";

import { flag, type FlagMarker, type FlagReference, setFlag } from "#flag.ts";

describe("flag", () => {
  it("marks a release flag as a boolean flag", () => {
    expect(
      flag({
        default: false,
        description: "flags.calendar",
        expires: "2026-12-31",
        kind: "release",
      }),
    ).toStrictEqual({
      default: false,
      description: "flags.calendar",
      expires: "2026-12-31",
      flagKind: "release",
      kind: "featureFlag",
      type: "boolean",
    });
  });

  it("marks an ops flag without a date", () => {
    expect(flag({ default: true, description: "flags.sync", kind: "ops" })).toStrictEqual({
      default: true,
      description: "flags.sync",
      flagKind: "ops",
      kind: "featureFlag",
      type: "boolean",
    });
  });

  it("marks an experiment as a string flag with its variants", () => {
    const layout = flag({
      default: "list",
      description: "flags.layout",
      expires: "2026-11-30",
      kind: "experiment",
      variants: ["list", "board"],
    });

    expect(layout).toStrictEqual({
      default: "list",
      description: "flags.layout",
      expires: "2026-11-30",
      flagKind: "experiment",
      kind: "featureFlag",
      type: "string",
      variants: ["list", "board"],
    });

    expectTypeOf(layout).toEqualTypeOf<FlagMarker<"board" | "list">>();
  });

  it("keeps the deprecation a flag states", () => {
    expect(
      flag({ default: true, deprecated: "flags.sync2", description: "flags.sync", kind: "ops" })
        .deprecated,
    ).toBe("flags.sync2");
  });

  it("keys a product's value by the flag's qualified id", () => {
    const calendar: FlagReference<boolean> = { id: "time-off/calendar", kind: "featureFlag" };

    expect(setFlag(calendar, true)).toStrictEqual({ flag: "time-off/calendar", value: true });
  });

  it("types a product's value by the flag's values", () => {
    const layout: FlagReference<"board" | "list"> = { id: "time-off/layout", kind: "featureFlag" };

    expect(setFlag(layout, "board").value).toBe("board");

    expectTypeOf(setFlag<"board" | "list">)
      .parameter(1)
      .toEqualTypeOf<"board" | "list">();
    expectTypeOf(setFlag<boolean>)
      .parameter(1)
      .toEqualTypeOf<boolean>();
  });
});
