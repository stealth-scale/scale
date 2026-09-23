import { type ReactElement } from "react";

import { Skeleton, SkeletonText } from "@stealthscale/component-feedback";
import { useWords } from "@stealthscale/specimen";

import * as Card from "#card/index.ts";

import portrait from "./portrait.webp";

export function Loading(): ReactElement {
  const { t } = useWords("card");

  return (
    <Card.Root aria-busy aria-label={t("loading.label")}>
      <Card.Header>
        <Card.Indicator>
          <Skeleton radius="full">
            <img alt="" src={portrait} />
          </Skeleton>
        </Card.Indicator>
        <Card.Title as="p">
          <Skeleton as="span">
            <span>{t("profile.name")}</span>
          </Skeleton>
        </Card.Title>
        <Card.Description>
          <Skeleton as="span">
            <span>{t("profile.role")}</span>
          </Skeleton>
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <SkeletonText />
      </Card.Content>
    </Card.Root>
  );
}
