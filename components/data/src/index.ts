/**
 * Exports the components that present one value: a badge, a colour swatch, a figure or a size in
 * the reader's locale, a QR code, a stat, a status, a tag, a timer and an instant. Each binds a
 * recipe that the preset at `./theme` registers with an application's style compiler.
 *
 * @packageDocumentation
 */

export * from "#badge/index.ts";
export * from "#color-swatch/index.ts";
export * as Format from "#format/index.ts";
export * as QrCode from "#qr-code/index.ts";
export * as Stat from "#stat/index.ts";
export * as Status from "#status/index.ts";
export * as Tag from "#tag/index.ts";
export * as Timer from "#timer/index.ts";
export * from "#timestamp/index.ts";
