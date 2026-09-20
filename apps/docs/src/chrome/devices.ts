/**
 * The devices a window of some width is, and the mark of each.
 */

/**
 * Selects one of the devices a window is drawn as.
 */
export type Device = "laptop" | "monitor" | "phone" | "tablet";

/**
 * The path of each device's mark, in a 24 unit box.
 */
export const PATHS: Readonly<Record<Device, string>> = {
  laptop: "M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v10H4zM2 18h20",
  monitor: "M3 4h18v12H3zM8 20h8M12 16v4",
  phone: "M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2zM11 18h2",
  tablet: "M5 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM11 19h2",
};

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
