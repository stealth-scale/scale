/**
 * Defines the keyframes every animation style and animation token names.
 *
 * @remarks
 *   The sizes a panel expands to and collapses from are custom properties the component measures
 *   and writes, so one keyframe serves every panel. The loops that run while nothing is pressed
 *   move by a share of the element's own size or of the viewport, so none of them names a length.
 *   How far a meteor falls is the exception, because it crosses a box rather than the page, and it
 *   is a custom property the sky sets, over the viewport where a sky sets none.
 */

import { slides } from "#draw/motion.ts";
import { type CssKeyframes } from "#pandacss.ts";

/**
 * Lists the keyframes.
 */
export const keyframes: CssKeyframes = {
  "bg-drift": {
    "0%, 100%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
  },
  "bg-position": {
    from: { backgroundPosition: "var(--animate-from, 200%) 0" },
    to: { backgroundPosition: "var(--animate-to, -200%) 0" },
  },
  bounce: {
    "0%, 100%": {
      animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
      transform: "translateY(-25%)",
    },
    "50%": { animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)", transform: "none" },
  },
  "collapse-height": {
    from: { height: "var(--height)" },
    to: { height: "var(--collapsed-height, 0)" },
  },
  "collapse-width": {
    from: { width: "var(--width)" },
    to: { width: "var(--collapsed-width, 0)" },
  },
  "expand-height": {
    from: { height: "var(--collapsed-height, 0)" },
    to: { height: "var(--height)" },
  },
  "expand-width": {
    from: { width: "var(--collapsed-width, 0)" },
    to: { width: "var(--width)" },
  },
  "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
  "fade-out": { from: { opacity: "1" }, to: { opacity: "0" } },
  float: {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-6%)" },
  },
  marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
  meteor: {
    "70%": { opacity: "1" },
    from: { opacity: "1", transform: "rotate(215deg) translateX(0)" },
    to: {
      opacity: "0",
      transform: "rotate(215deg) translateX(calc(-1 * var(--meteor-travel, 100vw)))",
    },
  },
  parallax: { from: { transform: "translateY(-15%)" }, to: { transform: "translateY(15%)" } },
  ping: { "75%, 100%": { opacity: "0", transform: "scale(2)" } },
  progress: { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
  pulse: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.5" } },
  "pulse-glow": {
    from: { boxShadow: "0 0 0 var(--shadow-color)" },
    to: { boxShadow: "0 0 {sizes.8} var(--shadow-color)" },
  },
  rise: {
    from: { opacity: "0", transform: "translateY(20%)" },
    to: { opacity: "1", transform: "none" },
  },
  "rotate-angle": { to: { "--angle": "360deg" } },
  "scale-in": {
    from: { opacity: "0", transform: "scale(0.96)" },
    to: { opacity: "1", transform: "scale(1)" },
  },
  "scale-out": {
    from: { opacity: "1", transform: "scale(1)" },
    to: { opacity: "0", transform: "scale(0.96)" },
  },
  spin: { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
  twinkle: { "0%, 100%": { opacity: "0.2" }, "50%": { opacity: "1" } },
  ...slides(),
};
