/**
 * Renders a button that saves data built in the page to a file.
 *
 * @remarks
 *   The trigger is the library's `Button`, so it takes every button axis and the variants a
 *   `ButtonPropsProvider` above it sets. The data is resolved on each press, so a function passed
 *   as `data` builds the file when the reader asks for it and not when the page renders.
 */

import { type MouseEvent, type ReactElement } from "react";

import { Button, type ButtonProps } from "#button/button.ts";
import { download, type DownloadOptions } from "#download-trigger/download.ts";

/**
 * Props of `DownloadTrigger`: the download options and the props of `Button`.
 */
export interface DownloadTriggerProps extends ButtonProps, DownloadOptions {}

/**
 * Renders a button that downloads `data` as `fileName` when pressed.
 *
 * @remarks
 *   `onClick` runs first. A handler that calls `preventDefault` cancels the download.
 */
export function DownloadTrigger({
  data,
  fileName,
  mimeType,
  onClick,
  ...rest
}: DownloadTriggerProps): ReactElement {
  /**
   * Calls the caller's handler, then downloads unless that handler prevented the default.
   */
  function pressed(event: MouseEvent<HTMLButtonElement>): void {
    onClick?.(event);

    if (!event.defaultPrevented) void download({ data, fileName, mimeType });
  }

  return <Button {...rest} onClick={pressed} />;
}
