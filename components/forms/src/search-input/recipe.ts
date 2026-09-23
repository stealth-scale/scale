/**
 * Recipe for the control that clears a search field.
 *
 * @remarks
 *   The clear control is the only element this component adds to the input group. It is a square
 *   of the tag height at its size and never under 24px, the WCAG 2.5.8 target size. The group
 *   places the mark that holds it 4px from the box's end, as it places every button at an end, so
 *   the square never leaves its mark or the box. The size comes from the
 *   group's size through its context, so the control and the box change size together. The recipe
 *   has no `palette` axis, because the control takes the field's muted ink, and no `effect` axis,
 *   because an effect on a control inside a field would compete with the field's focus ring.
 */

import {
  defineRecipe,
  dense,
  interactive,
  type Scale,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Returns the side of the square at one size: the tag height, at least 24px.
 */
function square(size: Scale): string {
  return `max({sizes.6}, ${dense(`{sizes.tag.${size}}`)})`;
}

/**
 * Defines the clear control recipe: a square at size `md` by default.
 */
export const recipe = defineRecipe({
  base: {
    ...interactive(),
    _hover: { color: "fg" },
    alignItems: "center",
    borderRadius: "l1",
    color: "fg.muted",
    display: "inline-flex",
    flexShrink: "0",
    justifyContent: "center",
    padding: "0",
  },
  className: "search-input",
  defaultVariants: { size: "md" },
  jsx: [/^SearchInput$/u],
  variants: {
    /**
     * Side of the square. Each value reads the tag scale at the same size, at least 24px.
     */
    size: sizeVariants((size) => ({ boxSize: square(size) })),
  },
});
