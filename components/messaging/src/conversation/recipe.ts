/**
 * Declares the conversation's slot recipe: the transcript of turns, the control that jumps to the
 * latest message, and the row that shows another person typing.
 *
 * @remarks
 *   The root and the viewport are the primitives scroll area's, so the bar, the focus ring and the
 *   keyboard scrolling are its own. The content stacks the turns in a column. The jump trigger is
 *   placed over the turns at the middle of the transcript's bottom edge. The viewport contains its
 *   overscroll, so a wheel at either end of the transcript leaves the page where it is. The typing
 *   row's three dots pulse at the theme's ambient pace, each 200ms after the one before, and rest
 *   under reduced motion. The dots fill with `CanvasText` under forced colors, which remove the
 *   dots' `currentcolor` fill in Chromium.
 */

import { defineSlotRecipe, dense } from "@stealthscale/theme/authoring";

/**
 * Styles a transcript of turns 16px apart at the foundation's metrics.
 */
export const recipe = defineSlotRecipe({
  base: {
    content: {
      display: "flex",
      flexDirection: "column",
      gap: dense("{spacing.gap.lg}"),
    },
    dots: {
      "& > span": {
        _highContrast: { background: "CanvasText", forcedColorAdjust: "none" },
        _motionSafe: {
          "&:nth-child(2)": { animationDelay: "{durations.moderate}" },
          "&:nth-child(3)": { animationDelay: "{durations.slower}" },
        },
        animationStyle: "pulse",
        backgroundColor: "currentcolor",
        blockSize: "0.375em",
        borderRadius: "full",
        inlineSize: "0.375em",
      },
      alignItems: "center",
      display: "inline-flex",
      gap: "0.25em",
    },
    jumpTrigger: {
      insetBlockEnd: dense("{spacing.inset.md}"),
      left: "50%",
      position: "absolute",
      translate: "-50% 0",
      zIndex: "docked",
    },
    root: {
      position: "relative",
    },
    typing: {
      alignItems: "center",
      color: "fg.muted",
      display: "flex",
      gap: dense("{spacing.gap.sm}"),
      textStyle: "label.sm",
    },
    viewport: {
      overscrollBehavior: "contain",
    },
  },
  className: "conversation",
  jsx: [/^Conversation\.\w+$/u],
  slots: ["root", "viewport", "content", "jumpTrigger", "typing", "dots"],
});
