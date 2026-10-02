import { type ReactElement } from "react";

import { ChevronRightIcon, CircleAlertIcon } from "lucide-react";

import { DataList } from "@stealthscale/component-collections";
import { Alert } from "@stealthscale/component-feedback";
import { Stack } from "@stealthscale/component-layout";
import { Code } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Details from "#details/index.ts";

const FIELDS = [
  ["code", "card_declined"],
  ["reason", "insufficient_funds"],
  ["request", "req_7Hq2Lx9"],
];

export function Declined(): ReactElement {
  const { t } = useWords("details");

  return (
    <Stack gap="sm">
      <Alert.Root status="error">
        <Alert.Indicator>
          <CircleAlertIcon />
        </Alert.Indicator>
        <Alert.Content>
          <Alert.Title>{t("declined.heading")}</Alert.Title>
          <Alert.Description>{t("declined.description")}</Alert.Description>
        </Alert.Content>
      </Alert.Root>
      <Details.Root size="sm">
        <Details.Summary>
          <Details.Indicator>
            <ChevronRightIcon />
          </Details.Indicator>
          {t("declined.show")}
        </Details.Summary>
        <Details.Content>
          <DataList.Root size="sm">
            {FIELDS.map(([field, value]) => (
              <DataList.Item key={field}>
                <DataList.ItemLabel>{t(`declined.fields.${field}`)}</DataList.ItemLabel>
                <DataList.ItemValue>
                  <Code>{value}</Code>
                </DataList.ItemValue>
              </DataList.Item>
            ))}
          </DataList.Root>
        </Details.Content>
      </Details.Root>
    </Stack>
  );
}
