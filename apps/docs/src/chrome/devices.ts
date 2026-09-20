/**
 * The devices a window of some width is.
 */

/**
 * Selects one of the devices a window is drawn as.
 */
export type Device = "laptop" | "monitor" | "phone" | "tablet";

/**
 * The width a tablet, a laptop and a monitor start at, in pixels.
 */
const STARTS = { laptop: 1024, monitor: 1280, tablet: 640 };

/**
 * Says which device a window of a width is: a phone under a tablet's width, a monitor from a
 * desk's, and the window itself a monitor.
 *
 * @param width - The width in pixels, or nothing for the window.
 * @returns A phone, a tablet, a laptop or a monitor.
 */
export function deviceOf(width?: number): Device {
  if (width === undefined || width >= STARTS.monitor) return "monitor";
  if (width >= STARTS.laptop) return "laptop";
  if (width >= STARTS.tablet) return "tablet";

  return "phone";
}
