/**
 * Writes the base of a form field: its surface, edge, ink and states, for a control that has its
 * own states and for a box around one or more controls.
 */

import type { SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * Custom property that carries the field's edge color. The hover state, the invalid state and the
 * status axis write it, and each field look paints its edges with it.
 *
 * @remarks
 *   The compiler puts a recipe's variants in a later cascade layer than its base, and a look is a
 *   variant. A look that wrote a color would apply over every state in the base. Through the
 *   property, a look sets which edges are drawn and the states set their color.
 */
export const FIELD_EDGE = "--field-edge";

/**
 * Selects the text and choice controls a field box can contain.
 */
const CONTROL = ":is(input, select, textarea)";

/**
 * Selects a box that contains a control with keyboard focus. A focused button in the box does not
 * match.
 */
export const WITHIN_FOCUS = `&:has(${CONTROL}:is(:focus-visible, [data-focus-visible]))`;

/**
 * Selects a box that contains no enabled control.
 */
export const WITHIN_DISABLED = `&:not(:has(${CONTROL}:enabled))`;

/**
 * Selects a box whose text controls are all read-only and none disabled.
 *
 * @remarks
 *   `:read-only` also matches a `select` and a disabled control, so the selector reads text
 *   controls only and requires one that is enabled.
 */
export const WITHIN_READ_ONLY =
  "&:has(:is(input, textarea):read-only:not(:disabled)):not(:has(:is(input, textarea):read-write))";

/**
 * Selects a control marked read-only by an attribute.
 *
 * @remarks
 *   `:read-only` also matches every element that is not editable, such as the `span` a switch
 *   renders as its track, so the selector reads the attributes an input, a machine and ARIA set.
 */
const MARKED_READ_ONLY = "&:is([readonly], [data-readonly], [aria-readonly=true])";

/**
 * Selects a box that contains an invalid control.
 */
export const WITHIN_INVALID = `&:has(${CONTROL}:is(:user-invalid, [data-invalid], [aria-invalid=true]))`;

/**
 * Returns the base of a control that has its own states.
 *
 * @remarks
 *   The edge is the control's boundary at the control stroke width, at the 3:1 ratio WCAG 1.4.11
 *   sets, and it darkens to the tertiary ink under a pointer. The placeholder reads the muted ink,
 *   which meets the text ratio. An invalid field renders its edge and ring in the error palette. A
 *   control marked read-only rests on the subtle surface. A coarse pointer raises the field to the
 *   middle control height, because no pseudo-element renders on a replaced element to widen its
 *   target. The focus ring is drawn over the edge, and the transition uses the press pace every
 *   control uses.
 */
export function field(): SystemStyleObject {
  return {
    _disabled: { layerStyle: "disabled" },
    _focusVisible: { outlineOffset: "calc({borderWidths.ring} * -1)" },
    _hover: { [FIELD_EDGE]: "{colors.fg.subtle}" },
    _invalid: { [FIELD_EDGE]: "{colors.border.error}", focusRingColor: "error.focusRing" },
    _placeholder: { color: "fg.muted" },
    _touch: { minBlockSize: "control.md" },
    background: "bg.panel",
    borderColor: `var(${FIELD_EDGE})`,
    borderWidth: "control",
    color: "fg",
    [FIELD_EDGE]: "{colors.border.emphasized}",
    focusRingColor: "colorPalette.focusRing",
    focusVisibleRing: "inside",
    [MARKED_READ_ONLY]: { background: "bg.subtle" },
    transitionDuration: "press",
    transitionProperty: "common",
    transitionTimingFunction: "press",
  };
}

/**
 * Color of the focus ring, read from the property the compiler's focus utilities write, with the
 * same fallbacks.
 *
 * @remarks
 *   A box that rings the control inside it sets `--focus-ring-color` to this value and paints its
 *   outline from `--focus-ring-color` under {@link WITHIN_FOCUS}.
 */
export const FOCUS_RING = "var(--focus-ring-color-prop, var(--global-color-focus-ring, #005FCC))";

/**
 * Returns the base of a box that draws the field around one or more controls.
 *
 * @remarks
 *   The box carries the edge and the surface, and reads every state from the controls inside it:
 *   the ring when one has keyboard focus, the error edge when one is invalid, the disabled look
 *   when none is enabled, and the subtle surface when every text control is read-only. A textarea
 *   that grows and an input group both use it. The controls keep their own placeholders.
 */
export function wrappedField(): SystemStyleObject {
  return {
    _hover: { [FIELD_EDGE]: "{colors.fg.subtle}" },
    _touch: { minBlockSize: "control.md" },
    "--focus-ring-color": FOCUS_RING,
    background: "bg.panel",
    borderColor: `var(${FIELD_EDGE})`,
    borderWidth: "control",
    color: "fg",
    [FIELD_EDGE]: "{colors.border.emphasized}",
    focusRingColor: "colorPalette.focusRing",
    transitionDuration: "press",
    transitionProperty: "common",
    transitionTimingFunction: "press",
    [WITHIN_DISABLED]: { layerStyle: "disabled" },
    [WITHIN_FOCUS]: {
      [FIELD_EDGE]: "var(--focus-ring-color)",
      outlineColor: "var(--focus-ring-color)",
      outlineOffset: "calc({borderWidths.ring} * -1)",
      outlineStyle: "var(--focus-ring-style, solid)",
      outlineWidth: "var(--focus-ring-width, 1px)",
    },
    [WITHIN_INVALID]: {
      [FIELD_EDGE]: "{colors.border.error}",
      focusRingColor: "error.focusRing",
    },
    [WITHIN_READ_ONLY]: { background: "bg.subtle" },
  };
}
