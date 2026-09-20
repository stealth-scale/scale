import { describe, expect, it } from "vitest";

import { tempo } from "#draw/tempo.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("tempo", () => {
  it("draws four paces and four curves", () => {
    expect(Object.keys(tempo().durations)).toStrictEqual(["press", "enter", "leave", "move"]);
    expect(Object.keys(tempo().easings)).toStrictEqual(["press", "enter", "leave", "move"]);
  });

  it("draws each pace as a reference to its duration token at the foundation's tempo", () => {
    expect(tokenAt(tempo().durations, "press")).toBe("{durations.fast}");
    expect(tokenAt(tempo().durations, "enter")).toBe("{durations.moderate}");
    expect(tokenAt(tempo().durations, "leave")).toBe("{durations.fast}");
    expect(tokenAt(tempo().durations, "move")).toBe("{durations.moderate}");
  });

  it("multiplies every pace where the theme states a multiplier", () => {
    expect(tokenAt(tempo({ pace: 0.8 }).durations, "press")).toBe("calc({durations.fast} * 0.8)");
    expect(tokenAt(tempo({ pace: 0.8 }).durations, "enter")).toBe(
      "calc({durations.moderate} * 0.8)",
    );
  });

  it("draws each curve as a reference to its easing token and takes the ones the theme states", () => {
    expect(tokenAt(tempo().easings, "press")).toBe("{easings.out}");
    expect(tokenAt(tempo().easings, "leave")).toBe("{easings.in}");
    expect(tokenAt(tempo().easings, "move")).toBe("{easings.in-smooth}");
    expect(tokenAt(tempo({ enter: "in-out" }).easings, "enter")).toBe("{easings.in-out}");
  });
});
