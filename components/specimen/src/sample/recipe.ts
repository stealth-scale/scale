/**
 * Defines the sample: a caption above a body that renders one component.
 *
 * @remarks
 *   The caption is outside the body, so a look styles the box around the component and not the
 *   caption. A matrix and a board render every cell as a sample. Each look reads semantic tokens.
 *   Every look except `inverted` sets no text colour, so the component keeps the page's ink. The
 *   body fills the cell at every `place` value, and `place` aligns the component inside it. No
 *   value sizes the body to its content, because a component that queries its container needs a
 *   container wider than itself. `span` applies only to a sample that is a child of a board's
 *   grid.
 */

import {
  defineSlotRecipe,
  dense,
  onSlot,
  spanCounts,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Border of every look that renders an edge: a hairline in the `border` colour.
 */
const EDGE = { borderColor: "border", borderStyle: "solid", borderWidth: "hairline" };

/**
 * Radius and padding of every look that renders a box.
 *
 * @remarks
 *   The `plain` look sets neither, so a plain sample is exactly the size of its content and the
 *   board's gap is the only space between two plain samples.
 */
const ROOM: SystemStyleObject = {
  borderRadius: "l2",
  padding: dense("{spacing.inset.md}"),
};

/**
 * Styles the root, caption and body of a sample. Defaults to the plain look at the start of the
 * cell.
 */
export const recipe = defineSlotRecipe({
  base: {
    body: {
      alignItems: "flex-start",
      display: "flex",
      maxInlineSize: "full",
      minInlineSize: "0",
    },
    caption: { maxInlineSize: "full" },
    root: {
      display: "flex",
      flexDirection: "column",
      gap: dense("{spacing.gap.xs}"),
      maxInlineSize: "full",
      minInlineSize: "0",
    },
  },
  className: "sample",
  defaultVariants: { place: "start", variant: "plain" },
  jsx: [/^Sample$/u],
  slots: ["root", "caption", "body"],
  variants: {
    /**
     * Alignment of the component inside the body.
     */
    place: {
      center: { body: { inlineSize: "full", justifyContent: "center" } },
      end: { body: { inlineSize: "full", justifyContent: "flex-end" } },
      start: { body: { inlineSize: "full", justifyContent: "flex-start" } },
      stretch: { body: { alignItems: "stretch", flexDirection: "column", inlineSize: "full" } },
    },

    /**
     * Number of board columns the sample spans. `full` spans every column.
     */
    span: { ...onSlot("root", spanCounts()), full: { root: { gridColumn: "1 / -1" } } },

    /**
     * Fill, edge and padding of the body.
     *
     * @remarks
     *   `inverted` fills the body with `bg.inverted`, the page colour of the opposite mode, and
     *   sets the inherited ink to `fg.inverted`, the ink of that mode. Text in the `fg.inverted`
     *   ink meets the text contrast ratio only on that fill. Its padding is the `xs` inset, 8px, so
     *   a short line fits a 158px matrix column on one line.
     */
    variant: {
      subtle: { body: { ...ROOM, background: "bg.subtle" } },

      surface: { body: { ...ROOM, ...EDGE, background: "bg.subtle" } },

      outline: { body: { ...ROOM, ...EDGE } },

      inverted: {
        body: {
          ...ROOM,
          background: "bg.inverted",
          color: "fg.inverted",
          padding: dense("{spacing.inset.xs}"),
        },
      },

      plain: { body: { background: "transparent", borderWidth: "0", padding: "0" } },
    },
  },
});
