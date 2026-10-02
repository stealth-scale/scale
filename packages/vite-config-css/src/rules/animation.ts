/**
 * Restricts a stylesheet's animations to the properties the compositor can run.
 */

/**
 * Rejects an animation of a property the browser cannot run on the compositor.
 *
 * @remarks
 *   Animating anything but transform or opacity puts layout or paint on the
 *   main thread for every frame, which drops the frame rate below the display's
 *   refresh rate on a mid-range device. The rule covers a transition as well as
 *   a keyframe.
 */
export const ANIMATION = {
  "plugin/no-low-performance-animation-properties": true,
};
