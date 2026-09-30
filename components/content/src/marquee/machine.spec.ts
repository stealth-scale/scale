import { act } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { durationOf, splitMarqueeProps } from "#marquee/machine.ts";
import { composed, copies, measured, region, resized } from "#marquee/marquee.fixtures.tsx";

/**
 * Returns the duration the machine wrote on the root.
 */
function duration(): string {
  return region().style.getPropertyValue("--marquee-duration");
}

describe("machine", () => {
  it("splits the machine's settings from the element's props", () => {
    expect(splitMarqueeProps({ className: "strip", speed: 20 })).toStrictEqual([
      { speed: 20 },
      { className: "strip" },
    ]);
  });

  it("derives the root's id from the caller's id", async () => {
    await drawn(composed({ id: "customers" }));

    expect(region().id).toBe("marquee:customers");
  });

  it("pauses the machine when paused is true", async () => {
    await drawn(composed({ paused: true }));

    expect(region().dataset["paused"]).toBe("");
  });

  it("writes the machine's orientation from the side", async () => {
    await drawn(composed({ side: "top" }));

    expect(copies()[0]?.dataset["orientation"]).toBe("vertical");
  });

  it("sets a duration that moves a copy at speed whatever the number of copies", async () => {
    measured();
    await drawn(composed({ autoFill: true }));
    await settled();

    expect(duration()).toBe("4s");
  });

  it("keeps the machine's first duration while the root has no size", async () => {
    await drawn(composed({ autoFill: true }));

    expect(duration()).toBe("40s");
  });

  it("renders more copies once the root grows under autoFill", async () => {
    const resize = resized();

    measured();
    await drawn(composed({ autoFill: true }));
    measured(1200);
    resize();
    await settled();

    expect(copies()).toHaveLength(7);
  });

  it("sets the duration again once a copy resizes", async () => {
    const resize = resized();

    measured();
    await drawn(composed());
    measured(800, 300);
    resize();
    await settled();

    expect(duration()).toBe("6s");
  });

  it("measures heights for a marquee that moves down", async () => {
    measured(600, 150, "clientHeight");
    await drawn(composed({ autoFill: true, side: "top" }));
    await settled();

    expect(copies()).toHaveLength(5);
  });

  it("sets the duration again when speed changes", async () => {
    measured();
    const { rerender } = await drawn(composed({ speed: 50 }));

    act(() => {
      rerender(composed({ speed: 100 }));
    });
    await settled();

    expect(duration()).toBe("2s");
  });

  it("leaves the duration when speed changes before a measurement", async () => {
    const { rerender } = await drawn(composed({ speed: 50 }));

    act(() => {
      rerender(composed({ speed: 100 }));
    });
    await settled();

    expect(duration()).toBe("40s");
  });

  it("divides the size of a copy by the speed in durationOf", () => {
    expect(durationOf({ contentSize: 300, rootSize: 800 }, 60)).toBe(5);
  });

  it("divides by a thousandth of a pixel per second for a speed of zero in durationOf", () => {
    expect(durationOf({ contentSize: 3, rootSize: 800 }, 0)).toBe(3000);
  });
});
