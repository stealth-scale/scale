import { type ReactElement } from "react";

import { Badge } from "@stealthscale/component-data";
import { Link } from "@stealthscale/component-navigation";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Card from "#card/index.ts";

import dunes from "./dunes.webp";

export function Article(props: Card.RootProps): ReactElement {
  const { t } = useWords("card");

  return (
    <Card.Root aria-label={t("article.title")} interactive scrim {...props}>
      <Card.Media>
        <img alt="" src={dunes} />
        <Card.Overlay>
          <Badge variant="solid">{t("article.topic")}</Badge>
          <Text size="sm">{t("article.read")}</Text>
        </Card.Overlay>
      </Card.Media>
      <Card.Header>
        <Card.Title>
          <Link href="#settlement" inherit>
            {t("article.title")}
          </Link>
        </Card.Title>
        <Card.Description>{t("article.date")}</Card.Description>
      </Card.Header>
      <Card.Content>{t("article.summary")}</Card.Content>
    </Card.Root>
  );
}
