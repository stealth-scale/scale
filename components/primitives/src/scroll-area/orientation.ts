/**
 * Provides a bar's orientation to the thumb inside it.
 *
 * @remarks
 *   The machine finds a thumb inside the bar of the same orientation, so a thumb reads the
 *   orientation from the bar it is rendered in. Outside a bar the orientation is vertical.
 */

import { createContext } from "react";

/**
 * Describes the axis a bar scrolls.
 */
export type Orientation = "horizontal" | "vertical";

/**
 * Creates the context through which a bar provides its orientation to its thumb.
 */
export const OrientationContext = createContext<Orientation>("vertical");
