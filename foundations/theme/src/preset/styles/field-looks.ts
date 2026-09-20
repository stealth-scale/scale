/**
 * Defines the looks a field rests in: outlined on the panel, subtle on the muted well, and flushed
 * with its block-end edge alone.
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
 */

import { type Look } from "#preset/styles/look.ts";

/**
 * Selects one of the three looks a field rests in.
 */
type FieldLook = "flushed" | "outline" | "subtle";

/**
 * Lists the field looks, each with its surface, its edge, and the states it restates.
 */
export const fieldLooks: Readonly<Record<FieldLook, Look>> = {
  flushed: {
    value: {
      _hover: { borderBlockEndColor: "fg.subtle" },
      _invalid: { borderBlockEndColor: "border.error" },
      _readOnly: { background: "bg.subtle" },
      background: "transparent",
      borderBlockEndColor: "border.emphasized",
      borderColor: "transparent",
      borderRadius: "0",
    },
  },
  outline: {
    value: {
      _hover: { borderColor: "fg.subtle" },
      _invalid: { borderColor: "border.error" },
      _readOnly: { background: "bg.subtle" },
      background: "bg.panel",
      borderColor: "border.emphasized",
    },
  },
  subtle: {
    value: {
      _hover: { borderBlockEndColor: "fg.subtle" },
      _invalid: { borderBlockEndColor: "border.error" },
      _readOnly: { background: "bg.subtle" },
      background: "bg.muted",
      borderBlockEndColor: "border.emphasized",
      borderBlockEndWidth: "control",
      borderColor: "transparent",
    },
  },
};
