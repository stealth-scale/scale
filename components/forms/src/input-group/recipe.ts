/**
 * Defines the styles a field with a mark at one end or both is drawn with.
 *
 * @remarks
 *   Four parts. The root is the box the rest sit in, the field takes the typing, and the start and
 *   the end hold a mark each. The marks are drawn over the field rather than beside it, and the
 *   field reserves room for them, so the typing never runs underneath.
 *   The group writes no padding. The size axis states the room a mark takes on the root, and the
 *   marks axis hands it to the control's own inset property on the side a mark sits. The control's
 *   recipe is the one rule writing its padding either way, so the two never race for the property
 *   and a theme that restyles the control keeps the room. Any control reading `controlSizes` goes
 *   in the field, not the text field alone.
 *   A mark takes no pointer, so a press over one reaches the field behind it, and whatever the
 *   mark holds takes the pointer back. A decorative glyph that swallowed a press would leave part
 *   of the field dead to a pointer and working to a keyboard.
 *   The align axis pins a mark to the block start for a control that runs to several lines, where
 *   a mark centred against the whole box floats in the middle of it.
 */

import {
  CONTROL_INSET_END,
  CONTROL_INSET_START,
  defineSlotRecipe,
  dense,
  onSlots,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * The property the group states the room a mark takes in, which every step of the size axis
 * writes and the marks axis hands to one side or both.
 */
const ROOM = "--input-group-room";

/**
 * Writes what both marks share, since the two differ only in the end they sit at.
 */
const MARK = {
  "& > *": { pointerEvents: "auto" },
  color: "fg.muted",
  display: "inline-flex",
  justifyContent: "center",
  pointerEvents: "none",
  position: "absolute",
  top: "0",
  zIndex: "1",
};

/**
 * Draws a field with a mark at either end, at the middle size until a caller says otherwise.
 */
export const recipe = defineSlotRecipe({
  base: {
    end: { ...MARK, insetInlineEnd: "0" },
    root: { display: "block", position: "relative", width: "full" },
    start: { ...MARK, insetInlineStart: "0" },
  },
  className: "input-group",
  defaultVariants: { align: "center", marks: "both", size: "md" },
  jsx: [/^InputGroup(\.\w+)?$/u],
  slots: ["root", "field", "start", "end"],
  variants: {
    /**
     * Where a mark sits against a control that runs to more than one line.
     */
    align: {
      center: {
        end: { alignItems: "center", blockSize: "full" },
        start: { alignItems: "center", blockSize: "full" },
      },
      start: {
        end: { alignItems: "start", blockSize: "full" },
        start: { alignItems: "start", blockSize: "full" },
      },
    },

    /**
     * Which ends of the field reserve room for a mark.
     */
    marks: {
      both: {
        root: { [CONTROL_INSET_END]: `var(${ROOM})`, [CONTROL_INSET_START]: `var(${ROOM})` },
      },
      end: { root: { [CONTROL_INSET_END]: `var(${ROOM})` } },
      start: { root: { [CONTROL_INSET_START]: `var(${ROOM})` } },
    },

    /**
     * The room a mark takes, which is a square on the control scale, and the label a mark's word is
     * set in, which is the step's own. A mark set in the body size overran a small square: `EUR`
     * ran past the end of an extra small field.
     */
    size: onSlots({
      end: sizeVariants((size) => ({
        inlineSize: dense(`{sizes.control.${size}}`),
        textStyle: `label.${size}`,
      })),
      root: sizeVariants((size) => ({ [ROOM]: `{sizes.control.${size}}` })),
      start: sizeVariants((size) => ({
        inlineSize: dense(`{sizes.control.${size}}`),
        textStyle: `label.${size}`,
      })),
    }),
  },
});
