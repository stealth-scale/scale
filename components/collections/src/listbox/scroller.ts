/**
 * Provides the element that scrolls a listbox's rows to a window inside it.
 *
 * @remarks
 *   The rows scroll in the viewport of the scroll area inside the content, so a window reads that
 *   viewport's scroll position and scrolls it to a row. The content provides the viewport once it
 *   renders, and null before.
 */

import { createContext } from "react";

/**
 * Context with the element that scrolls the rows, or null outside a listbox's content.
 */
export const ScrollerContext = createContext<HTMLElement | null>(null);
