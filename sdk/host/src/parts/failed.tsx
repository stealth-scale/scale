/**
 * Renders the page that states the product could not render, with a button that reloads it.
 */

import { type ReactNode } from "react";

import { Button } from "@stealthscale/component-actions";
import { EmptyState } from "@stealthscale/component-feedback";
import { useTranslation } from "@stealthscale/provider-i18n";
import { type Product } from "@stealthscale/sdk-core";

import { useProductName } from "#host/words.ts";

/**
 * Describes the props of the failure page.
 */
export interface HostFailedProps {
  /**
   * The product, whose name the heading states.
   */
  readonly product: Pick<Product, "name" | "productId">;
}

/**
 * Renders the failure page as the document's main landmark, with the product's name in its
 * heading.
 *
 * @remarks
 *   The page replaces the frame, so it renders the landmark the frame's own main region was.
 */
export function HostFailed({ product }: HostFailedProps): ReactNode {
  const { t } = useTranslation("host");
  const name = useProductName(product);

  return (
    <EmptyState.Root as="main">
      <EmptyState.Content>
        <EmptyState.Title as="h1">{t("failed.title", { product: name })}</EmptyState.Title>
        <EmptyState.Description>{t("failed.description")}</EmptyState.Description>
        <Button
          onClick={() => {
            window.location.reload();
          }}
        >
          {t("failed.reload")}
        </Button>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
