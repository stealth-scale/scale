/**
 * Renders the band above the header, for a notice about the whole page.
 *
 * @remarks
 *   A trial ending, a read-only environment or an incident in progress. The band keeps the page's
 *   gutter and measure, so a notice lines up with the title under it. The band has no role. Put
 *   the feedback package's `Alert` in it for the role and the live region a notice needs.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Renders the `div` with the recipe's banner class.
 */
export const Banner = withContext("div", "banner");

/**
 * Describes the props of the banner: the props of a `div`.
 */
export type BannerProps = ComponentProps<typeof Banner>;
