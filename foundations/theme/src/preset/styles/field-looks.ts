/**
 * Defines the looks a field rests in: outlined on the panel, subtle on the muted well, and flushed
 * with its block-end edge alone, each for a control that carries its own states and for a box
 * drawn around one that does.
 *
 * @remarks
 *   Each look restates the hover, invalid and read-only rules the `field` fragment writes, because
 *   the compiler layers a recipe's variants over its base. A look that wrote its edge alone won
 *   over the fragment's states whatever their specificity, so an outlined input neither darkened
 *   under a pointer nor reddened when invalid. The edge is the control's boundary, which stands
 *   from every surface at the ratio 1.4.11 asks of a control. The subtle look carries that edge at
 *   its block end alone, because an empty field has no text and no placeholder, so its fill is the
 *   only thing a reader could identify it by, and a fill two steps below the page stands at 1.39:1
 *   from the panel around it rather than the 3:1 that identifying a control asks for.
 *   The wrapped looks are the same colors read through the control the box holds. `:read-only`
 *   matches every element that is not editable, a box among them, so an outlined textarea rested
 *   on the read-only fill whatever its control was doing. The colors are written once and the two
 *   sets differ only in where the state is read from.
 */

import { type LayerStyle } from "#pandacss.ts";
import { type Look } from "#preset/styles/look.ts";

/**
 * Selects one of the three looks a field rests in.
 */
type FieldLook = "flushed" | "outline" | "subtle";

/**
 * Describes one look: how it rests, and what it changes under a pointer, when it is wrong, and
 * when it takes no input.
 */
interface Stated {
  /**
   * The look where the control takes no input.
   */
  blocked: LayerStyle;

  /**
   * The look under a pointer.
   */
  hovered: LayerStyle;

  /**
   * How the look rests.
   */
  rested: LayerStyle;

  /**
   * The look where the control holds something wrong.
   */
  wrong: LayerStyle;
}

/**
 * Fixes what each look rests in and what each state changes.
 */
const LOOKS: Readonly<Record<FieldLook, Stated>> = {
  flushed: {
    blocked: { background: "bg.subtle" },
    hovered: { borderBlockEndColor: "fg.subtle" },
    rested: {
      background: "transparent",
      borderBlockEndColor: "border.emphasized",
      borderColor: "transparent",
      borderRadius: "0",
    },
    wrong: { borderBlockEndColor: "border.error" },
  },
  outline: {
    blocked: { background: "bg.subtle" },
    hovered: { borderColor: "fg.subtle" },
    rested: { background: "bg.panel", borderColor: "border.emphasized" },
    wrong: { borderColor: "border.error" },
  },
  subtle: {
    blocked: { background: "bg.subtle" },
    hovered: { borderBlockEndColor: "fg.subtle" },
    rested: {
      background: "bg.muted",
      borderBlockEndColor: "border.emphasized",
      borderBlockEndWidth: "control",
      borderColor: "transparent",
    },
    wrong: { borderBlockEndColor: "border.error" },
  },
};

/**
 * Writes one look for a control that carries its own states.
 */
function own({ blocked, hovered, rested, wrong }: Stated): Look {
  return { value: { _hover: hovered, _invalid: wrong, _readOnly: blocked, ...rested } };
}

/**
 * Writes one look for a box drawn around the control that carries the states.
 */
function around({ blocked, hovered, rested, wrong }: Stated): Look {
  return {
    value: {
      _hover: hovered,
      "&:has(> :read-only:not(:disabled))": blocked,
      "&:has(> :user-invalid, > [data-invalid], > [aria-invalid=true])": wrong,
      ...rested,
    },
  };
}

/**
 * Lists the field looks, each with its surface, its edge, and the states it restates.
 */
export const fieldLooks: Readonly<Record<FieldLook, Look>> = {
  flushed: own(LOOKS.flushed),
  outline: own(LOOKS.outline),
  subtle: own(LOOKS.subtle),
};

/**
 * Lists the same looks for a box that reads its states from the control inside it.
 */
export const wrappedFieldLooks: Readonly<Record<FieldLook, Look>> = {
  flushed: around(LOOKS.flushed),
  outline: around(LOOKS.outline),
  subtle: around(LOOKS.subtle),
};
