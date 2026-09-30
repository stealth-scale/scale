import { describe, expect, it } from "vitest";

import { animationStyles } from "#preset/styles/animation-styles.ts";
import { tokenAt } from "#tokens.fixtures.ts";

const LOOPS = [
  "aurora",
  "float",
  "marquee",
  "marquee-x",
  "marquee-y",
  "meteor",
  "pulse",
  "pulse-glow",
  "shimmer",
  "spin",
  "sweep",
  "twinkle",
];

const SCROLLED = ["parallax", "progress", "reveal"];

describe("animationStyles", () => {
  it("names the pairs and the loops and the scrolled motions and the rise", () => {
    expect(Object.keys(animationStyles).toSorted()).toStrictEqual(
      [
        "collapse",
        "fade",
        "scale-fade",
        "sheet",
        "slide-fade",
        "slide-up",
        "rise",
        ...LOOPS,
        ...SCROLLED,
      ].toSorted(),
    );
    expect(Object.keys(tokenAt(animationStyles, "fade") ?? {})).toStrictEqual(["in", "out"]);
  });

  it("names a sheet's pair for each edge of the window", () => {
    expect(Object.keys(tokenAt(animationStyles, "sheet") ?? {})).toStrictEqual([
      "top",
      "bottom",
      "left",
      "right",
    ]);
  });

  it.each(["top", "bottom", "left", "right"])(
    "slides a sheet the whole way in from the $0 edge at the entering pace",
    (edge) => {
      expect(tokenAt(animationStyles, `sheet.${edge}.in`)).toMatchObject({
        animationDuration: "enter",
        animationName: `slide-from-${edge}-full, fade-in`,
        animationTimingFunction: "enter",
      });
    },
  );

  it.each(["top", "bottom", "left", "right"])(
    "slides a sheet the whole way out to the $0 edge at the leaving pace",
    (edge) => {
      expect(tokenAt(animationStyles, `sheet.${edge}.out`)).toMatchObject({
        animationDuration: "leave",
        animationName: `slide-to-${edge}-full, fade-out`,
        animationTimingFunction: "leave",
      });
    },
  );

  it("drives the scrolled motions from the scroll position and not the clock", () => {
    expect(tokenAt(animationStyles, "parallax")).toMatchObject({
      animationName: "parallax",
      animationTimeline: "scroll()",
    });
    expect(tokenAt(animationStyles, "progress")).toMatchObject({
      animationTimeline: "scroll()",
      transformOrigin: "left",
    });
    expect(tokenAt(animationStyles, "reveal")).toMatchObject({
      animationFillMode: "both",
      animationName: "rise",
      animationRange: "entry 0% cover 30%",
      animationTimeline: "view()",
    });
  });

  it("offsets each meteor by a stagger a sky counts", () => {
    expect(tokenAt(animationStyles, "meteor")).toMatchObject({
      animationDelay: "calc(-1 * var(--stagger, 0) * {durations.ambient})",
      animationIterationCount: "infinite",
      animationName: "meteor",
    });
  });

  it("rises each element in turn by a stagger a recipe counts", () => {
    expect(tokenAt(animationStyles, "rise")).toMatchObject({
      animationDelay: "calc(var(--stagger, 0) * {durations.faster})",
      animationFillMode: "both",
      animationName: "rise",
    });
  });

  it("runs a fade in at the entering pace and curve and out at the leaving ones", () => {
    expect(tokenAt(animationStyles, "fade.in")).toMatchObject({
      animationDuration: "enter",
      animationName: "fade-in",
      animationTimingFunction: "enter",
    });
    expect(tokenAt(animationStyles, "fade.out")).toMatchObject({
      animationDuration: "leave",
      animationName: "fade-out",
      animationTimingFunction: "leave",
    });
  });

  it("turns every motion off for a reader who asked for less", () => {
    for (const path of [
      "fade.in",
      "scale-fade.out",
      "collapse.in",
      "slide-fade.in",
      "slide-up.out",
      "sheet.left.in",
      "sheet.bottom.out",
      "rise",
      ...LOOPS,
      ...SCROLLED,
    ]) {
      expect(tokenAt(animationStyles, path)).toMatchObject({
        _motionReduce: { animation: "none" },
      });
    }
  });

  it("slides in from the side the placement is on", () => {
    expect(tokenAt(animationStyles, "slide-fade.in")).toMatchObject({
      "&[data-placement^=bottom]": { animationName: "slide-from-top, fade-in" },
      "&[data-placement^=left]": { animationName: "slide-from-right, fade-in" },
      "&[data-placement^=top]": { animationName: "slide-from-bottom, fade-in" },
      transformOrigin: "var(--transform-origin)",
    });
  });

  it("slides out towards the side the anchor is on", () => {
    expect(tokenAt(animationStyles, "slide-fade.out")).toMatchObject({
      "&[data-placement^=bottom]": { animationName: "slide-to-top, fade-out" },
      "&[data-placement^=right]": { animationName: "slide-to-left, fade-out" },
      "&[data-placement^=top]": { animationName: "slide-to-bottom, fade-out" },
    });
  });

  it("slides in from below at the entering pace", () => {
    expect(tokenAt(animationStyles, "slide-up.in")).toMatchObject({
      animationDuration: "enter",
      animationName: "slide-from-bottom, fade-in",
      animationTimingFunction: "enter",
    });
  });

  it("slides out to the top at the leaving pace", () => {
    expect(tokenAt(animationStyles, "slide-up.out")).toMatchObject({
      animationDuration: "leave",
      animationName: "slide-to-top, fade-out",
      animationTimingFunction: "leave",
    });
  });

  it("runs every loop until the element goes", () => {
    for (const name of LOOPS) {
      expect(tokenAt(animationStyles, name)).toMatchObject({ animationIterationCount: "infinite" });
    }
  });

  it("sweeps the shimmer and the marquee without easing at an ambient pace", () => {
    expect(tokenAt(animationStyles, "shimmer")).toMatchObject({
      animationDuration: "ambientSlow",
      animationName: "bg-position",
      animationTimingFunction: "linear",
    });
    expect(tokenAt(animationStyles, "marquee")).toMatchObject({
      animationDuration: "ambientSlower",
      animationName: "marquee",
      animationTimingFunction: "linear",
    });
  });

  it.each(["marquee-x", "marquee-y"])(
    "runs a marquee's copy by $0 without easing at the slower ambient pace",
    (name) => {
      expect(tokenAt(animationStyles, name)).toMatchObject({
        animationDuration: "ambientSlower",
        animationName: name,
        animationTimingFunction: "linear",
      });
    },
  );

  it("sweeps the registered angle round at the slow ambient pace", () => {
    expect(tokenAt(animationStyles, "sweep")).toMatchObject({
      animationDuration: "ambientSlow",
      animationName: "rotate-angle",
      animationTimingFunction: "linear",
    });
  });

  it("breathes the glow in and out by alternating one keyframe", () => {
    expect(tokenAt(animationStyles, "pulse-glow")).toMatchObject({
      animationDirection: "alternate",
      animationName: "pulse-glow",
      animationTimingFunction: "in-out",
    });
  });
});
