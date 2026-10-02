/**
 * Renders a file's size.
 *
 * @remarks
 *   The element is a `span` in the muted ink. It renders the size in the upload's `locale` unless
 *   the caller passes children: in decimal units to three significant digits from a kilobyte up,
 *   such as `200 kB` or `5.24 MB`, and in the long unit below, such as `520 bytes`, because the
 *   short unit reads `520 byte` in English.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#file-upload/context.ts";
import { useFileUpload } from "#file-upload/machine.ts";
import { useItem, useShared } from "#file-upload/state.ts";

/**
 * Renders the `span` with the file upload's item size text class.
 */
const Sized = withContext("span", "itemSizeText");

/**
 * Describes the props of the size text: the props of a `span`.
 */
export type ItemSizeTextProps = ComponentProps<typeof Sized>;

/**
 * Size in bytes from which the machine's formatter states a size in kilobytes.
 */
const KILOBYTE = 1000;

/**
 * Returns a size below a kilobyte in the long unit of a locale, such as `520 bytes`.
 */
function bytes(size: number, locale: string): string {
  return new Intl.NumberFormat(locale, { style: "unit", unit: "byte", unitDisplay: "long" }).format(
    size,
  );
}

/**
 * Renders the size text with the machine's props.
 *
 * @param props - Attributes and children of the `span` element, merged over the machine's.
 * @returns The `span` element.
 */
export function ItemSizeText({ children, ...rest }: ItemSizeTextProps): ReactElement {
  const api = useFileUpload();
  const item = useItem();
  const { locale } = useShared();
  const { size } = item.file;

  return (
    <Sized {...mergeProps(api.getItemSizeTextProps(item), rest)}>
      {children ?? (size < KILOBYTE ? bytes(size, locale) : api.getFileSize(item.file))}
    </Sized>
  );
}
