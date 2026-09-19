/**
 * Puts a control of the bar on the neutral palette.
 *
 * @remarks
 *   A control draws itself on the primary palette, which is right for a page and loud for a bar. A
 *   glyph in the bar reads in the ink of the words beside it, so the two glyph controls take the
 *   neutral palette through this class.
 */

import { css } from "@stealthscale/theme";

/**
 * The class that moves a control onto the neutral palette.
 */
export const quiet = css({ colorPalette: "neutral" });
