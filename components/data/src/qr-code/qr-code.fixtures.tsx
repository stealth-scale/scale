/**
 * Fixtures for the QR code specs: a code with its frame, its pattern, an optional mark and a
 * download trigger.
 */

import { type ReactElement } from "react";

import { DownloadTrigger, type DownloadTriggerProps } from "#qr-code/download-trigger.tsx";
import { Frame } from "#qr-code/frame.tsx";
import { Overlay } from "#qr-code/overlay.tsx";
import { Pattern } from "#qr-code/pattern.tsx";
import { Root, type RootProps } from "#qr-code/root.tsx";

/**
 * Value the fixtures encode: version 2 at error correction `L`, version 3 at `H`.
 */
export const VALUE = "https://stealthscale.io";

/**
 * Describes what a case sets on the fixture beside the root's props.
 */
export interface Composition {
  /**
   * Accessible name of the frame.
   */
  readonly label?: string;

  /**
   * Whether a mark renders over the code.
   */
  readonly marked?: boolean;

  /**
   * Props of the download trigger.
   */
  readonly trigger?: Partial<DownloadTriggerProps>;
}

/**
 * Renders a code with the props the case sets on the root, a mark when the case asks for one, and a
 * download trigger named "Download" that writes an SVG.
 *
 * @param props - The props the case sets on the root.
 * @param composition - The frame's name, the mark and the download trigger's props.
 * @returns The code.
 */
export function composed(props: RootProps = {}, composition: Composition = {}): ReactElement {
  const { label, marked = false, trigger } = composition;

  return (
    <Root value={VALUE} {...props}>
      <Frame label={label}>
        <Pattern />
      </Frame>
      {marked ? (
        <Overlay>
          <svg viewBox="0 0 10 10" />
        </Overlay>
      ) : null}
      <DownloadTrigger fileName="code.svg" mimeType="image/svg+xml" {...trigger}>
        Download
      </DownloadTrigger>
    </Root>
  );
}
