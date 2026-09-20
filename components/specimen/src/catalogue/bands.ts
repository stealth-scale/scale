/**
 * Fixes the two bands a page is read in, which are the values its tabs are picked by.
 */

/**
 * Selects a band of a page.
 */
export type Band = "examples" | "props";

/**
 * Pairs each band with the value its tab carries.
 */
export const BANDS: Readonly<Record<Band, Band>> = { examples: "examples", props: "props" };
