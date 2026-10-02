import { type ReactElement } from "react";

import { Card } from "@stealthscale/component-surfaces";
import { useWords } from "@stealthscale/specimen";

import { Loader, LoaderOverlay } from "#loader/index.ts";

export function Covered(props: Parameters<typeof LoaderOverlay>[0]): ReactElement {
  const { t } = useWords("loader");

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>{t("lines")}</Card.Title>
        <Card.Description>{t("ledger")}</Card.Description>
      </Card.Header>
      <LoaderOverlay {...props}>
        <Loader text={t("matching")} />
      </LoaderOverlay>
    </Card.Root>
  );
}
