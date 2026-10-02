import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { Spacer, Stack } from "@stealthscale/component-layout";
import { Heading, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { VisuallyHidden } from "#visually-hidden/index.ts";

export function Shortcuts(): ReactElement {
  const { t } = useWords("visually-hidden");

  return (
    <Stack gap="md">
      <Stack direction="row">
        <VisuallyHidden as={Button} focusable>
          {t("shortcuts")}
        </VisuallyHidden>
        <Heading as="h3" size="sm">
          {t("invoices")}
        </Heading>
        <Spacer />
        <Button size="sm">{t("create")}</Button>
      </Stack>
      <Text>{t("summary")}</Text>
    </Stack>
  );
}
