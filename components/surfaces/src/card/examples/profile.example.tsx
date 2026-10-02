import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { Badge } from "@stealthscale/component-data";
import { useWords } from "@stealthscale/specimen";

import * as Card from "#card/index.ts";

import harbour from "./harbour.webp";
import portrait from "./portrait.webp";

export function Profile(): ReactElement {
  const { t } = useWords("card");

  return (
    <Card.Root aria-label={t("profile.name")} justify="start">
      <Card.Media>
        <img alt="" src={harbour} />
      </Card.Media>
      <Card.Header>
        <Card.Indicator>
          <img alt="" src={portrait} />
        </Card.Indicator>
        <Card.Title>{t("profile.name")}</Card.Title>
        <Card.Description>{t("profile.role")}</Card.Description>
        <Card.Aside>
          <Button size="sm" variant="outline">
            {t("profile.message")}
          </Button>
        </Card.Aside>
      </Card.Header>
      <Card.Content>{t("profile.bio")}</Card.Content>
      <Card.Footer>
        <Badge>{t("profile.payouts")}</Badge>
        <Badge>{t("profile.close")}</Badge>
        <Badge>{t("profile.treasury")}</Badge>
      </Card.Footer>
    </Card.Root>
  );
}
