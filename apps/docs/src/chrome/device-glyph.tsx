/**
 * Draws the mark of the device a window of some width is: a phone, a tablet, a laptop or a
 * monitor.
 */

import { type ReactElement } from "react";

import { Icon } from "@stealthscale/component-typography";

import { type Device, PATHS } from "#chrome/devices.ts";

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
 *   Inline rather than from an icon set, because the library ships none and the bar needs four
 *   marks. It is hidden from a screen reader, which reads the width's name beside it.
 * @param props - Which device to draw.
 * @returns The mark, carrying the device's name as data.
 */
export function DeviceGlyph({ device }: DeviceGlyphProps): ReactElement {
  return (
    <Icon data-device={device} size="sm" viewBox="0 0 24 24">
      <path
        d={PATHS[device]}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </Icon>
  );
}
