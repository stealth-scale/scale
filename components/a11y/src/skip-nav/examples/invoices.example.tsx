import { type ReactElement, useId } from "react";

import { Button } from "@stealthscale/component-actions";
import { Group, Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as SkipNav from "#skip-nav/index.ts";

export function Invoices(): ReactElement {
  const { t } = useWords("skip-nav");
  const results = useId();

  return (
    <Stack gap="md">
      <SkipNav.Link href={`#${results}`}>{t("skip")}</SkipNav.Link>
      <Group aria-label={t("filters")} as="fieldset">
        <Button size="sm" variant="outline">
          {t("all")}
        </Button>
        <Button size="sm" variant="outline">
          {t("paid")}
        </Button>
        <Button size="sm" variant="outline">
          {t("overdue")}
        </Button>
      </Group>
      <SkipNav.Target id={results}>
        <Text>{t("results")}</Text>
      </SkipNav.Target>
    </Stack>
  );
}
