/**
 * Styles a divider: a hairline in the `border` color across a column or down a row, or a label
 * between two hairlines.
 *
 * @remarks
 *   The `divider` helper sets one border edge per orientation, so the orientation is an axis. The
 *   base removes the `hr` element's default border and margin. A labelled divider renders its lines
 *   as `::before` and `::after`, so a screen reader reads the label and no line. The recipe has no
 *   `palette` or `effect` axis, because a divider separates content in the boundary color and
 *   renders no box.
 */

import {
  axis,
  defineRecipe,
  dense,
  divider,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Selects a divider that renders a label, which `Divider` marks with `data-labelled`.
 */
export const LABELLED = "&[data-labelled]";

/**
 * Describes a place of a label between its lines.
 */
type Placement = "center" | "end" | "start";

/**
 * Lists the places of a label in reading order.
 */
const PLACEMENTS: readonly Placement[] = ["start", "center", "end"];

/**
 * Writes one of the two hairlines beside a label, which share the room the label leaves.
 */
const LINE: SystemStyleObject = {
  borderBlockEndWidth: "hairline",
  borderColor: "border",
  content: '""',
  flex: "1",
};

/**
 * Maps each place to the line it hides and the alignment of a label that wraps.
 */
const PLACED: Readonly<Record<Placement, SystemStyleObject>> = {
  center: { textAlign: "center" },
  end: { _after: { display: "none" }, textAlign: "end" },
  start: { _before: { display: "none" }, textAlign: "start" },
};

/**
 * Defaults to a horizontal divider with a label centred between its lines.
 */
export const recipe = defineRecipe({
  base: { borderWidth: "0", flexShrink: "0", marginBlock: "0" },
  className: "divider",
  defaultVariants: { labelPlacement: "center", orientation: "horizontal" },
  jsx: [/^Divider$/u],
  variants: {
    /**
     * Place of a label between its lines. `start` and `end` follow the writing direction and drop
     * the line on their side. A divider without a label renders no line for it to drop.
     */
    labelPlacement: axis(PLACEMENTS, (placement) => ({ [LABELLED]: PLACED[placement] }))(),

    /**
     * Direction of the line. `vertical` stretches to the height of a row and renders no label.
     */
    orientation: {
      horizontal: {
        ...divider("horizontal"),
        [LABELLED]: {
          _after: LINE,
          _before: LINE,
          alignItems: "center",
          borderBlockEndWidth: "0",
          color: "fg.muted",
          display: "flex",
          gap: dense("{spacing.gap.lg}"),
          textStyle: "body.sm",
        },
      },
      vertical: divider("vertical"),
    },
  },
});
