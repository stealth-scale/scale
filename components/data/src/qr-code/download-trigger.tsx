/**
 * Renders a button that downloads the code as an image.
 *
 * @remarks
 *   The element is the library's `Button`. The image is black on white, at the size the code
 *   renders at times the device pixel ratio, with the mark when one renders.
 */

import { type JSX, type ReactElement } from "react";

import type * as qrCode from "@zag-js/qr-code";
import { mergeProps } from "@zag-js/react";

import { Button, type ButtonProps } from "@stealthscale/component-actions";
import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#qr-code/context.ts";
import { useQrCode } from "#qr-code/machine.ts";

/**
 * Renders the library's `Button` with the QR code's download trigger class.
 */
const Pressed: (props: ButtonProps) => JSX.Element = withContext(Button, "downloadTrigger");

/**
 * Lists the image formats a download writes: PNG, JPEG or SVG.
 */
export type ImageType = qrCode.DownloadTriggerProps["mimeType"];

/**
 * Describes the props of a download trigger: the file and the props of a `Button`, without `ref`.
 */
export interface DownloadTriggerProps extends Omit<ButtonProps, "ref"> {
  /**
   * Name of the downloaded file, with its extension.
   */
  readonly fileName: string;

  /**
   * Format of the image, `image/png` by default.
   */
  readonly mimeType?: ImageType | undefined;

  /**
   * Quality of a JPEG image, from 0 to 1.
   */
  readonly quality?: number | undefined;
}

/**
 * Renders the trigger with the machine's props merged under the caller's.
 *
 * @param props - The file and the props of a `Button`.
 * @returns The `button` element.
 */
export function DownloadTrigger({
  fileName,
  mimeType = "image/png",
  quality,
  ...props
}: DownloadTriggerProps): ReactElement {
  const { api } = useQrCode();
  const trigger: ButtonProps = api.getDownloadTriggerProps({
    fileName,
    mimeType,
    ...omitUndefined({ quality }),
  });

  return <Pressed {...mergeProps(trigger, props)} />;
}
