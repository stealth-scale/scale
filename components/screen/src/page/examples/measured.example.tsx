import { type ReactElement } from "react";

import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Page from "#page/index.ts";

export function Measured(props: Page.RootProps): ReactElement {
  const { t } = useWords("page");

  return (
    <Page.Root measure="narrow" size="sm" {...props}>
      <Page.Header>
        <Page.Title as="h3">{t("measured.title")}</Page.Title>
        <Page.Description>{t("measured.about")}</Page.Description>
      </Page.Header>
      <Page.Body>
        <Text size="sm" tone="muted">
          {t("measured.body")}
        </Text>
      </Page.Body>
      <Page.Footer>
        <Text size="sm" tone="muted">
          {t("measured.updated")}
        </Text>
      </Page.Footer>
    </Page.Root>
  );
}
