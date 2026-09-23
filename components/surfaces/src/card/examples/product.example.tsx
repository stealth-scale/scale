import { type ReactElement } from "react";

import { ShoppingBagIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Badge } from "@stealthscale/component-data";
import { Heading } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Card from "#card/index.ts";

import studio from "./studio.webp";

export function Product(): ReactElement {
  const { t } = useWords("card");

  return (
    <Card.Root aria-label={t("product.name")}>
      <Card.Media>
        <img alt="" src={studio} />
        <Card.Overlay>
          <Badge palette="success" variant="solid">
            {t("product.new")}
          </Badge>
        </Card.Overlay>
      </Card.Media>
      <Card.Header>
        <Card.Title>{t("product.name")}</Card.Title>
        <Card.Description>{t("product.detail")}</Card.Description>
      </Card.Header>
      <Card.Content>
        <Heading as="p" size="lg">
          {t("product.price")}
        </Heading>
      </Card.Content>
      <Card.Footer>
        <Button>
          <ShoppingBagIcon aria-hidden />
          {t("product.add")}
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}
