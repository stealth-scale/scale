/**
 * Titles the document after the page a person is on.
 */

import { useEffect } from "react";

import { useTranslation } from "@stealthscale/provider-i18n";
import { useChildMatches } from "@stealthscale/provider-router";

import { useHost } from "#host/use-host.ts";

/**
 * Titles the document `<title> · <product name>` for as long as the caller is mounted.
 *
 * @remarks
 *   The deepest matched page titles the document, so a list that renders its detail beside it
 *   leaves the title to the detail. Once the caller unmounts, the document is titled with the
 *   product's name alone: the product's `name` key, translated in the product's own namespace.
 * @param title - The page's title, translated.
 */
export function useDocumentTitle(title: string): void {
  const { product } = useHost("useDocumentTitle");
  const { t } = useTranslation(product.productId);
  const name = t(product.name);
  const titled = useChildMatches({ select: (matches) => matches.length }) === 0;

  useEffect(() => {
    if (titled) document.title = `${title} · ${name}`;

    return (): void => {
      if (titled) document.title = name;
    };
  }, [name, title, titled]);
}
