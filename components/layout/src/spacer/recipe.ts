/**
 * Styles a spacer: an empty flex or grid item that takes the free space along the main axis.
 *
 * @remarks
 *   The spacer has a flex basis of 0 and grows by 1, so in a stack it takes the space its siblings
 *   leave and pushes the siblings after it to the end. The recipe has no axis, because an empty
 *   element has no variant a caller chooses, and no `palette` or `effect` axis, because it renders
 *   nothing.
 */

import { defineRecipe } from "@stealthscale/theme/authoring";

/**
 * Stretches the spacer across the free space of its container.
 */
export const recipe = defineRecipe({
  base: { alignSelf: "stretch", flexBasis: "0", flexGrow: "1", justifySelf: "stretch" },
  className: "spacer",
  jsx: [/^Spacer$/u],
});
