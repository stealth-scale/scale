/**
 * Defines the looks a field rests in: outlined on the panel, subtle on the muted well, and flushed
 * with its block-end edge alone, each for a control that carries its own states and for a box
 * drawn around one that does.
 *
 * @remarks
 *   A look decides which edges are drawn and what the field rests on. What those edges are drawn in
 *   is the field fragment's `--field-edge`, which the hover, the invalid state and the status axis
 *   write and every look reads. Each look used to restate those three rules, because the compiler
 *   layers a recipe's variants over its base and a look that wrote a color won over them; read
 *   through the property there is nothing left to restate and nothing left to fall out of step.
 *   The edge is the control's boundary, which stands from every surface at the ratio 1.4.11 asks of
 *   a control. The subtle look carries that edge at its block end alone, because an empty field has
 *   no text and no placeholder, so its fill is the only thing a reader could identify it by, and a
 *   fill two steps below the page stands at 1.39:1 from the panel around it rather than the 3:1
 *   that identifying a control asks for.
 *   A look drawn at its block end alone reports focus by that edge rather than by a ring. A ring
 *   round a field with no box drew the box the look had taken away, which is what a reader saw
 *   instead of the field they had reached.
 *   The wrapped looks are the same declarations read through the control the box holds.
 *   `:read-only` matches every element that is not editable, a box among them, so an outlined
 *   textarea rested on the read-only fill whatever its control was doing.
 */

import { FIELD_EDGE } from "#authoring/recipes/field.ts";
import { type LayerStyle } from "#pandacss.ts";
import { type Look } from "#preset/styles/look.ts";

/**
 * Selects one of the three looks a field rests in.
 */
type FieldLook = "flushed" | "outline" | "subtle";

/**
 * Reports focus by the edge the look already draws, with no ring over it.
 */
const EDGED: LayerStyle = { outlineStyle: "none" };

/**
 * Describes one look: what it rests on, and what it rests on where the control takes no input.
 */
interface Stated {
  /**
   * The look where the control takes no input.
   */
  blocked: LayerStyle;

  /**
   * The look where the control holds focus. A look that reports focus with the ring the fragment
   * already draws leaves it out.
   */
  focused?: LayerStyle | undefined;

  /**
   * How the look rests, its edges read from the field's own property.
   */
  rested: LayerStyle;
}

/**
 * Fixes what each look rests in and which of its edges are drawn.
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
      background: "bg.muted",
      borderBlockEndColor: `var(${FIELD_EDGE})`,
      borderBlockEndWidth: "control",
      borderColor: "transparent",
    },
  },
};

/**
 * Writes one look for a control that carries its own states.
 */
function own({ blocked, focused, rested }: Stated): Look {
  return {
    value: {
      _readOnly: blocked,
      ...(focused === undefined ? {} : { _focusVisible: focused }),
      ...rested,
    },
  };
}

/**
 * Writes one look for a box drawn around the control that carries the states.
 *
 * @remarks
 *   The focused rule is keyed off the control rather than off the box, because a box holds no focus
 *   of its own.
 */
function around({ blocked, focused, rested }: Stated): Look {
  return {
    value: {
      "&:has(> :read-only:not(:disabled))": blocked,
      ...(focused === undefined
        ? {}
        : { "&:has(> :focus-visible, > [data-focus-visible])": focused }),
      ...rested,
    },
  };
}

/**
 * Lists the field looks, each with its surface, its edges, and where it takes no input.
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
