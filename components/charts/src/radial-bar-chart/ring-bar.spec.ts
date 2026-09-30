import { RadialBar } from "recharts";
import { describe, expect, it } from "vitest";

import { ringBarOf } from "#radial-bar-chart/ring-bar.tsx";

describe("ringBarOf", () => {
  it("returns recharts' RadialBar over each row's turn", () => {
    const bar = ringBarOf({ animate: false, track: true });

    expect([bar.type, bar.props.dataKey]).toStrictEqual([RadialBar, "turn"]);
  });

  it("renders the track behind each ring when track is on", () => {
    expect(ringBarOf({ animate: false, track: true }).props.background).toBe(true);
  });

  it("renders no track when track is off", () => {
    expect(ringBarOf({ animate: false, track: false }).props.background).toBe(false);
  });

  it("animates the rings outside reduced motion when animate is on", () => {
    expect(ringBarOf({ animate: true, track: true }).props.isAnimationActive).toBe("auto");
  });

  it("renders the rings at rest when animate is off", () => {
    expect(ringBarOf({ animate: false, track: true }).props.isAnimationActive).toBe(false);
  });
});
