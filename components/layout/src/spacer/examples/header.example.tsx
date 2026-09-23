import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { Heading } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { Spacer } from "#spacer/index.ts";
import { Stack } from "#stack/index.ts";

export function Header(): ReactElement {
  const { t } = useWords("spacer");

  return (
    <Stack direction="row">
      <Heading as="h3" size="sm">
        {t("invoices")}
      </Heading>
      <Spacer />
      <Button size="sm" variant="outline">
        {t("export")}
      </Button>
      <Button size="sm">{t("create")}</Button>
    </Stack>
  );
}
