/**
 * Writes the base of a form field: its surface, its edge, its ink, and the states a field enters.
 */

import type { SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * The property a field reads its edge from, which its state and its status write and its look
 * paints with.
 *
 * @remarks
 *   The edge is a property rather than a color on each rule, because the compiler layers a recipe's
 *   variants over its base and a look states its edge in a variant. A look that wrote a color there
 *   beat every state the base had written, so a flushed field neither darkened under a pointer nor
 *   took the color of the status it reported. Written through one property, a look decides which
 *   edges are drawn and the state decides what they are drawn in, and neither overrules the other.
 */
export const FIELD_EDGE = "--field-edge";

/**
 * Writes the base of a field.
 *
 * @remarks
 *   The edge is the control's boundary, which stands from every surface at the ratio 1.4.11 asks
 *   of a control, at the control's stroke width, and it darkens to the tertiary ink under a
 *   pointer. The placeholder reads the muted ink, which clears the text ratio, because a
 *   placeholder is text under WCAG. An invalid field draws its edge and its ring in the error
 *   palette, and a read-only field sits on the subtle surface so a reader can tell it from one
 *   that takes input. A coarse pointer raises the field to the middle control height rather than
 *   growing a target around it, because a field is a replaced element and no pseudo-element
 *   renders on one. The transition matches the one every pressed control carries, so a field and a
 *   button in one row settle together.
 *   The focus ring is drawn over the edge rather than outside it. Offset from the edge it stood
 *   beside the control's own stroke, so a focused field carried four and a half pixels of edge and
 *   read as a box redrawn rather than a field a reader had reached.
 */
export function field(): SystemStyleObject {
  return {
    _disabled: { layerStyle: "disabled" },
    _focusVisible: { outlineOffset: "calc({borderWidths.ring} * -1)" },
    _hover: { [FIELD_EDGE]: "{colors.fg.subtle}" },
    _invalid: { [FIELD_EDGE]: "{colors.border.error}", focusRingColor: "error.focusRing" },
    _placeholder: { color: "fg.muted" },
    _readOnly: { background: "bg.subtle" },
    _touch: { minBlockSize: "control.md" },
    background: "bg.panel",
    borderColor: `var(${FIELD_EDGE})`,
    borderWidth: "control",
    color: "fg",
    [FIELD_EDGE]: "{colors.border.emphasized}",
    focusRingColor: "colorPalette.focusRing",
    focusVisibleRing: "inside",
    transitionDuration: "press",
    transitionProperty: "common",
    transitionTimingFunction: "press",
  };
}

/**
 * Fixes the color a ring is drawn in, read from the property the compiler's focus utilities write
 * and falling back the way they do.
 */
const RING = "var(--focus-ring-color-prop, var(--global-color-focus-ring, #005FCC))";

/**
 * Writes the base of a field whose surface is a box around the control rather than the control
 * itself.
 *
 * @remarks
 *   A textarea that grows with its text is drawn inside a box that carries the edge, because the
 *   growth is measured by a copy of the text the box holds beside the control. The states belong
 *   to the control and the treatment belongs to the box, so every state is read from the control
 *   through it. {@link field} on such a box reaches nothing: the disabled and invalid attributes
 *   sit on the control, the focus lands on the control, and `:read-only` matches every box there
 *   is, so the surface rested on the read-only fill whatever the control was doing.
 *   The control keeps its own placeholder, because a placeholder is text the control renders.
 */
export function wrappedField(): SystemStyleObject {
  return {
    _hover: { [FIELD_EDGE]: "{colors.fg.subtle}" },
    _touch: { minBlockSize: "control.md" },
    "--focus-ring-color": RING,
    "&:has(> :disabled, > [data-disabled])": { layerStyle: "disabled" },
    "&:has(> :focus-visible, > [data-focus-visible])": {
      [FIELD_EDGE]: "var(--focus-ring-color)",
      outlineColor: "var(--focus-ring-color)",
      outlineOffset: "calc({borderWidths.ring} * -1)",
      outlineStyle: "var(--focus-ring-style, solid)",
      outlineWidth: "var(--focus-ring-width, 1px)",
    },
    "&:has(> :read-only:not(:disabled))": { background: "bg.subtle" },
    "&:has(> :user-invalid, > [data-invalid], > [aria-invalid=true])": {
      [FIELD_EDGE]: "{colors.border.error}",
      focusRingColor: "error.focusRing",
    },
    background: "bg.panel",
    borderColor: `var(${FIELD_EDGE})`,
    borderWidth: "control",
    color: "fg",
    [FIELD_EDGE]: "{colors.border.emphasized}",
    focusRingColor: "colorPalette.focusRing",
    transitionDuration: "press",
    transitionProperty: "common",
    transitionTimingFunction: "press",
  };
}
