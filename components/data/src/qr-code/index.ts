/**
 * Exports the QR code's parts, composed as `QrCode.Root` around `QrCode.Frame` with its
 * `QrCode.Pattern`, an optional `QrCode.Overlay` and `QrCode.DownloadTrigger` buttons.
 */

export {
  DownloadTrigger,
  type DownloadTriggerProps,
  type ImageType,
} from "#qr-code/download-trigger.tsx";
export { Frame, type FrameProps } from "#qr-code/frame.tsx";
export { Overlay, type OverlayProps } from "#qr-code/overlay.tsx";
export { Pattern, type PatternProps } from "#qr-code/pattern.tsx";
export { Root, type RootProps } from "#qr-code/root.tsx";
