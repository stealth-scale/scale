/**
 * Draws the control that holds the page to a window's width, so a reader sees a page as a phone or
 * a tablet sees it.
 */

import { type ReactElement } from "react";

import { Menu } from "@stealthscale/component-disclosure";
import { Switcher, Toolbar } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";
import { type Size, useViewport } from "@stealthscale/provider-viewport";
import { PHONE, widthsOf } from "@stealthscale/specimen";

import { Chevron } from "#chrome/chevron.tsx";
import { DeviceGlyph } from "#chrome/device-glyph.tsx";
import { type Device, deviceOf } from "#chrome/devices.ts";

/**
 * The value the window is picked under, which no width is named.
 */
const WINDOW = "window";

/**
 * Describes one row of the list: the window, or a width.
 */
interface Row {
  /**
   * The device a window that wide is.
   */
  readonly device: Device;

  /**
   * The words the row reads.
   */
  readonly label: string;

  /**
   * The value the row is picked under.
   */
  readonly value: string;

  /**
   * The width in pixels, or nothing for the window.
   */
  readonly width: number | undefined;
}

/**
 * Describes the words the rows are written with.
 */
interface Words {
  /**
   * The words the phone's row reads.
   */
  readonly phone: string;

  /**
   * The words the window's row reads.
   */
  readonly window: string;
}

/**
 * Lists the rows: the window first, then the phone and every breakpoint, each with its device.
 *
 * @param sizes - The theme's breakpoints, as the viewport lists them.
 * @param words - The words the window's row and the phone's row read.
 * @returns The rows, the window first.
 */
function rowsOf(sizes: readonly Size[], words: Words): readonly [Row, ...Row[]] {
  return [
    { device: deviceOf(), label: words.window, value: WINDOW, width: undefined },
    ...widthsOf(sizes).map((size) => ({
      device: deviceOf(size.min),
      label: size.name === PHONE.name ? words.phone : `${size.name} ${String(size.min)}`,
      value: size.name,
      width: size.min,
    })),
  ];
}

/**
 * Draws the control naming the width in force, which opens the rest: the window, a phone, and
 * where each of the theme's breakpoints starts.
 *
 * @remarks
 *   The width is the shell's viewport, so picking one reaches every hook that reads the viewport
 *   as well as the catalogue, which holds each scene's stage to it and nothing else on the page.
 *   Each row carries the device a window that wide is, and a breakpoint's row names the
 *   breakpoint and the pixels it starts at. The control is an item of the bar's row, so draw it
 *   inside `Toolbar.Root`.
 */
export function WidthSwitcher(): ReactElement {
  const { t } = useTranslation("docs");
  const { setWidth, sizes, width } = useViewport();
  const rows = rowsOf(sizes, { phone: t("chrome.phone"), window: t("chrome.window") });
  const [window, ...widths] = rows;
  const picked = widths.find((row) => row.width === width) ?? window;

  return (
    <Switcher.Root
      placement="toolbar"
      positioning={{ placement: "bottom-end" }}
      size="sm"
      variant="outline"
    >
      <Toolbar.Item as={Switcher.Trigger} label={t("chrome.width")}>
        <Switcher.Mark>
          <DeviceGlyph device={picked.device} />
        </Switcher.Mark>
        <Switcher.Label>
          <Switcher.Name>{picked.label}</Switcher.Name>
        </Switcher.Label>
        <Switcher.Indicator>
          <Chevron />
        </Switcher.Indicator>
      </Toolbar.Item>
      <Menu.Positioner>
        <Switcher.Content>
          {rows.map((row) => (
            <Switcher.Option
              checked={row === picked}
              key={row.value}
              onCheckedChange={() => {
                setWidth(row.width);
              }}
              type="radio"
              value={row.value}
            >
              <Switcher.Mark>
                <DeviceGlyph device={row.device} />
              </Switcher.Mark>
              <Menu.ItemText>{row.label}</Menu.ItemText>
              <Switcher.Check>✓</Switcher.Check>
            </Switcher.Option>
          ))}
        </Switcher.Content>
      </Menu.Positioner>
    </Switcher.Root>
  );
}
