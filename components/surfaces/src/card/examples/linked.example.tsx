import { type ReactElement } from "react";

import { ReceiptTextIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Link } from "@stealthscale/component-navigation";
import { useWords } from "@stealthscale/specimen";

import * as Card from "#card/index.ts";

export function Linked(props: Card.RootProps): ReactElement {
  const { t } = useWords("card");

  return (
    <Card.Root aria-label={t("invoice.title")} {...props}>
      <Card.Header>
        <Card.Indicator>
          <ReceiptTextIcon aria-hidden />
        </Card.Indicator>
        <Card.Title>
          <Link href="#invoice-4821" inherit>
            {t("invoice.title")}
          </Link>
        </Card.Title>
        <Card.Description>{t("invoice.issued")}</Card.Description>
      </Card.Header>
      <Card.Content>{t("invoice.lines")}</Card.Content>
      <Card.Footer>
        <Button size="sm" variant="subtle">
          {t("invoice.remind")}
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}
