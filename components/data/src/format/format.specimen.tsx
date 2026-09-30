/**
 * Catalogue page for the formats.
 *
 * @remarks
 *   The recipe has no axis, so every scene is hand-written. The invoice, metrics and storage
 *   scenes each show one example in the catalogue's own locale, and the locales scene writes one
 *   price in four locales through `locale`. The words are keys under `format` in
 *   `locales/en/specimen/format.json`.
 */

import { Matrix, type Scene, specimen } from "@stealthscale/specimen";

import * as invoice from "#format/examples/invoice.example.tsx";
import * as metrics from "#format/examples/metrics.example.tsx";
import * as price from "#format/examples/price.example.tsx";
import * as storage from "#format/examples/storage.example.tsx";
import type * as Format from "#format/index.ts";

/**
 * Locales of the locales scene.
 */
const LOCALES: ReadonlyArray<NonNullable<Format.NumberProps["locale"]>> = [
  "en-US",
  "de-DE",
  "fr-FR",
  "ja-JP",
];

/**
 * Hand-written scene for amounts and a rate on an invoice.
 */
export const billed: Scene = {
  about: "format.invoice.about",
  draw: invoice.Invoice,
  example: invoice,
  title: "format.invoice.title",
};

/**
 * Hand-written scene for compact, signed and unit figures in stats.
 */
export const counted: Scene = {
  about: "format.metrics.about",
  draw: metrics.Metrics,
  example: metrics,
  title: "format.metrics.title",
};

/**
 * Hand-written scene for file sizes and a link's speed.
 */
export const stored: Scene = {
  about: "format.storage.about",
  draw: storage.Storage,
  example: storage,
  title: "format.storage.title",
};

/**
 * Hand-written scene for one price in four locales.
 */
export const localized: Scene = {
  about: "format.locales.about",
  draw: () => (
    <Matrix knob="locale" of={LOCALES}>
      {(locale) => <price.Price locale={locale} />}
    </Matrix>
  ),
  example: price,
  props: { locale: "en-US" },
  title: "format.locales.title",
};

export default specimen({
  about: "format.about",
  id: "components/data/format",
  imports: 'import { Format } from "@stealthscale/component-data";',
  scenes: [billed, counted, stored, localized],
  title: "format.title",
});
