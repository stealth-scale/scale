/**
 * Draws the mark of the device a window of some width is: a phone, a tablet, a laptop or a
 * monitor.
 */

import { type ReactElement } from "react";

import { LaptopIcon, type LucideIcon, MonitorIcon, SmartphoneIcon, TabletIcon } from "lucide-react";

import { type Device } from "#chrome/devices.ts";

/**
 * The icon each device is drawn with.
 */
const ICONS: Readonly<Record<Device, LucideIcon>> = {
  laptop: LaptopIcon,
  monitor: MonitorIcon,
  phone: SmartphoneIcon,
  tablet: TabletIcon,
};

/**
 * The size the mark is drawn at, in pixels, which is the small icon size.
 */
const GLYPH = 16;

/**
 * Describes what the glyph is told.
 */
export interface DeviceGlyphProps {
  /**
   * The device drawn.
   */
  readonly device: Device;
}

/**
 * Draws a device's mark at the small icon size.
 *
 * @remarks
 *   The icon set's own drawing, hidden from a screen reader, which reads the width's name beside
 *   it.
 * @param props - Which device to draw.
 * @returns The mark, carrying the device's name as data.
 */
export function DeviceGlyph({ device }: DeviceGlyphProps): ReactElement {
  const Icon = ICONS[device];

  return <Icon aria-hidden="true" data-device={device} size={GLYPH} />;
}
