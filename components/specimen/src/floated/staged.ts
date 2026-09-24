/**
 * Positioning options that keep a floating part still in a scene.
 */

/**
 * Turns off the three machine options that move a floating part against the window.
 *
 * @remarks
 *   A machine flips a panel to the other side, slides it along its edge and caps its height at the
 *   room left in the window. A scene staged open far down the page would open upwards, shrink to
 *   the height under the fold, and move again as the reader scrolls. With the three off, the part
 *   renders at the placement the scene sets and at its full height at any scroll position, and the
 *   `Floated` box around it pads once. Pass it as the machine's `positioning`, with the scene's
 *   placement spread over it.
 */
export const STAGED = { flip: false, sizeMiddleware: false, slide: false } as const;
