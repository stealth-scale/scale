import { type ReactElement } from "react";

import { EllipsisIcon, ReceiptTextIcon } from "lucide-react";

import { Button, IconButton } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import * as Card from "#card/index.ts";

export function Invoice(props: Card.RootProps): ReactElement {
  const { t } = useWords("card");

  return (
    <Card.Root aria-label={t("invoice.title")} {...props}>
      <Card.Header>
        <Card.Indicator>
          <ReceiptTextIcon aria-hidden />
        </Card.Indicator>
        <Card.Title>{t("invoice.title")}</Card.Title>
        <Card.Description>{t("invoice.issued")}</Card.Description>
        <Card.Aside>
          <IconButton aria-label={t("invoice.more")} size="sm" variant="ghost">
            <EllipsisIcon aria-hidden />
          </IconButton>
        </Card.Aside>
      </Card.Header>
      <Card.Content>{t("invoice.lines")}</Card.Content>
      <Card.Footer>
        <Button size="sm" variant="subtle">
          {t("invoice.remind")}
        </Button>
        <Button size="sm">{t("invoice.send")}</Button>
      </Card.Footer>
    </Card.Root>
  );
}
