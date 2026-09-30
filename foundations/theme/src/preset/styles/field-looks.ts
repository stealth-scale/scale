/**
 * Defines the three field looks: outlined on the panel, subtle on the subtle surface, and flushed
 * with a block-end edge only. Each look has one form for a control with its own states and one
 * for a box around such a control.
 *
 * @remarks
 *   A look sets which edges are drawn and the surface behind the text. The edge color is the field
 *   fragment's `--field-edge`, which the hover state, the invalid state and the status axis write.
 *   The edge meets the 3:1 ratio WCAG 1.4.11 sets for a control's boundary. The subtle look draws
 *   the edge at its block end, because an empty field has no text and its fill stays under 3:1
 *   against the panel. The subtle and flushed looks draw no ring. On focus their edge takes
 *   the ring color and the ring width. The width change is the signal on a field with a status,
 *   because each status palette's ring color equals its edge color. The look writes both in the
 *   variants layer, after the status axis. A read-only field that is not disabled dashes its drawn
 *   edges on every look, which reads apart from rest in a still image and in forced colors. The
 *   wrapped forms read read-only and focus from the controls inside the box, with the field
 *   fragment's selectors, because `:read-only` on the box would match the box itself.
 */

import { FIELD_EDGE, WITHIN_FOCUS, WITHIN_READ_ONLY } from "#authoring/recipes/field.ts";
import { type LayerStyle } from "#pandacss.ts";
import { type Look } from "#preset/styles/look.ts";

/**
 * Selects one of the three field looks.
 */
type FieldLook = "flushed" | "outline" | "subtle";

/**
 * Reports focus on a look without a full border: the block-end edge takes the ring color and the
 * ring width, and no ring is drawn.
 */
const EDGED: LayerStyle = {
  borderBlockEndWidth: "ring",
  [FIELD_EDGE]: "var(--focus-ring-color)",
  outlineStyle: "none",
};

/**
 * Width the block-end edge gains on focus: the ring width less the control stroke, 1px at the
 * foundation's widths.
 */
const GAINED = "calc({borderWidths.ring} - {borderWidths.control})";

/**
 * Dashes every drawn edge of a field that takes focus but no input.
 *
 * @remarks
 *   A border style survives forced colors, where a fill does not.
 */
const LOCKED: LayerStyle = { borderStyle: "dashed" };

/**
 * Selects a control that takes no input: a disabled one, a text control that is read-only, or a
 * control marked read-only.
 *
 * @remarks
 *   `:read-only` matches every element that takes no text, a `select` among them, so it is read on
 *   `input` and `textarea` alone.
 */
const BLOCKED =
  "&:is(:disabled, :is(input, textarea):read-only, [data-readonly], [aria-readonly=true])";

/**
 * Selects a read-only control that is not disabled, read the same way.
 */
const READ_ONLY =
  "&:is(:is(input, textarea):read-only, [data-readonly], [aria-readonly=true]):not(:disabled)";

/**
 * Describes one look in its three states.
 */
interface Stated {
  /**
   * Styles the look when the control takes no input.
   */
  blocked: LayerStyle;

  /**
   * Styles the look when the control has keyboard focus. A look that keeps the fragment's ring
   * omits it.
   */
  focused?: LayerStyle | undefined;

  /**
   * Styles the look at rest. Every edge color reads the field's edge property.
   */
  rested: LayerStyle;
}

/**
 * Maps each look to its surface and edges in each state.
 */
const LOOKS: Readonly<Record<FieldLook, Stated>> = {
  flushed: {
    blocked: { background: "bg.subtle" },
    focused: EDGED,
    rested: {
      background: "transparent",
      borderBlockEndColor: `var(${FIELD_EDGE})`,
      borderColor: "transparent",
      borderRadius: "0",
    },
  },
  outline: {
    blocked: { background: "bg.subtle" },
    rested: { background: "bg.panel", borderColor: `var(${FIELD_EDGE})` },
  },
  subtle: {
    blocked: { background: "bg.subtle" },
    focused: EDGED,
    rested: {
      background: "bg.subtle",
      borderBlockEndColor: `var(${FIELD_EDGE})`,
      borderBlockEndWidth: "control",
      borderColor: "transparent",
    },
  },
};

/**
 * Returns a look for a control that has its own read-only and focus states.
 *
 * @remarks
 *   A control has a fixed height, so a wider edge takes its pixel from the content box and moves
 *   the centred text. A look that widens its edge on focus pads the control's block end by that
 *   pixel at rest and drops the padding on focus, so the content box and the text do not move.
 */
function own({ blocked, focused, rested }: Stated): Look {
  return {
    value: {
      [BLOCKED]: blocked,
      [READ_ONLY]: LOCKED,
      ...(focused === undefined
        ? {}
        : { _focusVisible: { ...focused, paddingBlockEnd: "0" }, paddingBlockEnd: GAINED }),
      ...rested,
    },
  };
}

/**
 * Returns a look for a box that reads the read-only and focus states from the controls inside it.
 *
 * @remarks
 *   A box takes its height from its content, so a wider edge makes it 1px taller. A look that
 *   widens its edge on focus pulls the box's block-end margin in by that pixel, so the control
 *   inside and every element after the box keep their positions.
 */
function around({ blocked, focused, rested }: Stated): Look {
  return {
    value: {
      [WITHIN_READ_ONLY]: { ...blocked, ...LOCKED },
      ...(focused === undefined
        ? {}
        : { [WITHIN_FOCUS]: { ...focused, marginBlockEnd: `calc(${GAINED} * -1)` } }),
      ...rested,
    },
  };
}

/**
 * Lists the field looks for a control.
 */
export const fieldLooks: Readonly<Record<FieldLook, Look>> = {
  flushed: own(LOOKS.flushed),
  outline: own(LOOKS.outline),
  subtle: own(LOOKS.subtle),
};

/**
 * Lists the field looks for a box around a control.
 */
export const wrappedFieldLooks: Readonly<Record<FieldLook, Look>> = {
  flushed: around(LOOKS.flushed),
  outline: around(LOOKS.outline),
  subtle: around(LOOKS.subtle),
};
