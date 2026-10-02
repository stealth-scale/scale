/**
 * Renders a size in bytes or bits the way a locale writes it.
 *
 * @remarks
 *   The element is a `data` element whose `value` is the size in the unit, and whose text picks the
 *   largest unit the size reaches: 1,450,000 bytes is "1.45 MB". A size under one kilo-unit writes
 *   the unit's long name, "512 bytes".
 */

import { type ComponentProps, type ReactElement } from "react";

import { type ByteOptions, bytesOf } from "#format/bytes.ts";
import { withContext } from "#format/context.ts";
import { useFormatLocale } from "#format/locale.ts";

/**
 * Renders the `data` element with the format class.
 */
const Drawn = withContext("data");

/**
 * Describes the props of the size: the size, the locale, the unit and how it is written, and the
 * props of a `data` element.
 */
export interface FormatByteProps
  extends Omit<ComponentProps<typeof Drawn>, "children" | "value">, Partial<ByteOptions> {
  /**
   * Locale the size is written in, the locale in scope unless stated.
   */
  readonly locale?: string | undefined;

  /**
   * Size to write, in bytes, or in bits under `unit="bit"`.
   */
  readonly value: number;
}

/**
 * Renders the size.
 *
 * @param props - The size, the locale, the unit options and the props of a `data` element.
 * @returns The `data` element.
 */
export function FormatByte({
  locale,
  precision,
  unit = "byte",
  unitDisplay = "short",
  unitSystem = "decimal",
  value,
  ...props
}: FormatByteProps): ReactElement {
  const written = bytesOf(value, useFormatLocale(locale), {
    precision,
    unit,
    unitDisplay,
    unitSystem,
  });

  return (
    <Drawn {...props} value={String(value)}>
      {written}
    </Drawn>
  );
}
