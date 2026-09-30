import { describe, expect, it } from "vitest";

import { keyframes } from "#preset/keyframes.ts";
import { animations } from "#preset/tokens/animations.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("keyframes", () => {
  it("draws the four loops", () => {
    expect(Object.keys(keyframes)).toStrictEqual(
      expect.arrayContaining(["spin", "pulse", "ping", "bounce"]),
    );
  });

  it("draws the fades and the scales in and out", () => {
    expect(Object.keys(keyframes)).toStrictEqual(
      expect.arrayContaining(["fade-in", "fade-out", "scale-in", "scale-out"]),
    );
  });

  it("scales in from --scale-distance short of full size", () => {
    expect(keyframes["scale-in"]).toStrictEqual({
      from: { opacity: "0", transform: "scale(calc(1 - var(--scale-distance, 0.04)))" },
      to: { opacity: "1", transform: "scale(1)" },
    });
  });

  it("scales out to --scale-distance short of full size", () => {
    expect(keyframes["scale-out"]).toStrictEqual({
      from: { opacity: "1", transform: "scale(1)" },
      to: { opacity: "0", transform: "scale(calc(1 - var(--scale-distance, 0.04)))" },
    });
  });

  it("expands and collapses a panel on both axes from a measured size", () => {
    expect(keyframes["expand-height"]).toStrictEqual({
      from: { height: "var(--collapsed-height, 0)" },
      to: { height: "var(--height)" },
    });
    expect(keyframes["collapse-width"]).toStrictEqual({
      from: { width: "var(--width)" },
      to: { width: "var(--collapsed-width, 0)" },
    });
  });

  it("draws the sixteen slides", () => {
    expect(Object.keys(keyframes).filter((name) => name.startsWith("slide-"))).toHaveLength(16);
  });

  it("draws the ambient loops by a share of the element or the viewport", () => {
    expect(keyframes["marquee"]).toStrictEqual({
      from: { transform: "translateX(0)" },
      to: { transform: "translateX(-50%)" },
    });
    expect(keyframes["float"]).toMatchObject({ "50%": { transform: "translateY(-6%)" } });
    expect(keyframes["meteor"]).toMatchObject({
      to: {
        opacity: "0",
        transform: "rotate(215deg) translateX(calc(-1 * var(--meteor-travel, 100vw)))",
      },
    });
    expect(keyframes["bg-drift"]).toMatchObject({ "50%": { backgroundPosition: "100% 50%" } });
  });

  it("moves a marquee's copy across by the share the component writes", () => {
    expect(keyframes["marquee-x"]).toStrictEqual({
      from: { transform: "translateX(0)" },
      to: { transform: "translateX(var(--marquee-translate, -100%))" },
    });
  });

  it("moves a marquee's copy down by the share the component writes", () => {
    expect(keyframes["marquee-y"]).toStrictEqual({
      from: { transform: "translateY(0)" },
      to: { transform: "translateY(var(--marquee-translate, -100%))" },
    });
  });

  it("moves each scrolled motion by a share of the box rather than a length", () => {
    expect(keyframes["rise"]).toStrictEqual({
      from: { opacity: "0", transform: "translateY(20%)" },
      to: { opacity: "1", transform: "none" },
    });
    expect(keyframes["parallax"]).toStrictEqual({
      from: { transform: "translateY(-15%)" },
      to: { transform: "translateY(15%)" },
    });
    expect(keyframes["progress"]).toStrictEqual({
      from: { transform: "scaleX(0)" },
      to: { transform: "scaleX(1)" },
    });
    expect(keyframes["twinkle"]).toStrictEqual({
      "0%, 100%": { opacity: "0.2" },
      "50%": { opacity: "1" },
    });
  });

  it("sweeps the registered angle round once and breathes a glow out to a size token", () => {
    expect(keyframes["rotate-angle"]).toStrictEqual({ to: { "--angle": "360deg" } });
    expect(keyframes["pulse-glow"]).toStrictEqual({
      from: { boxShadow: "0 0 0 var(--shadow-color)" },
      to: { boxShadow: "0 0 {sizes.8} var(--shadow-color)" },
    });
  });

  it("defines a keyframe for every animation token", () => {
    const named = Object.keys(animations).map(
      (name) => String(tokenAt(animations, name)).split(" ")[0],
    );

    expect(named.every((name) => name !== undefined && name in keyframes)).toBe(true);
  });
});
