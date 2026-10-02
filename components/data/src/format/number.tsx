/**
 * Renders a number the way a locale writes it.
 *
 * @remarks
 *   The element is a `data` element whose `value` is the number as the machine reads it, and whose
 *   text is the figure in the locale: the separators, the symbol and where the symbol sits all come
 *   from the locale and `options`. `options` takes the options of `Intl.NumberFormat` as one
 *   object, the shape the constructor takes, so none of them meets a prop of the element: `style`
 *   is both an option and the element's inline style.
 */

import { type ComponentProps, type ReactElement } from "react";

import { formatNumber } from "@zag-js/i18n-utils";

import { withContext } from "#format/context.ts";
import { useFormatLocale } from "#format/locale.ts";

/**
 * Renders the `data` element with the format class.
 */
const Drawn = withContext("data");

/**
 * Describes the props of the figure: the number, the locale, the options of `Intl.NumberFormat`
 * and the props of a `data` element.
 */
export interface FormatNumberProps extends Omit<
  ComponentProps<typeof Drawn>,
  "children" | "value"
> {
  /**
   * Locale the figure is written in, the locale in scope unless stated.
   */
  readonly locale?: string | undefined;

  /**
   * Options of `Intl.NumberFormat`, such as `{ style: "currency", currency: "EUR" }`.
   */
  readonly options?: Intl.NumberFormatOptions | undefined;

  /**
   * Number to write.
   */
  readonly value: number;
}

/**
 * Renders the figure.
 *
 * @param props - The number, the locale, the formatting options and the props of a `data` element.
 * @returns The `data` element.
 */
export function FormatNumber({
  locale,
  options,
  value,
  ...props
}: FormatNumberProps): ReactElement {
  const written = formatNumber(value, useFormatLocale(locale), options);

  return (
    <Drawn {...props} value={String(value)}>
      {written}
    </Drawn>
  );
}
