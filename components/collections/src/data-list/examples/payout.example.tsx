import { type ReactElement } from "react";

import { Badge } from "@stealthscale/component-data";
import { useWords } from "@stealthscale/specimen";

import * as DataList from "#data-list/index.ts";

const FIELDS = ["account", "raised", "amount"] as const;

export function Payout(props: DataList.RootProps): ReactElement {
  const { t } = useWords("data-list");

  return (
    <DataList.Root {...props}>
      {FIELDS.map((field) => (
        <DataList.Item key={field}>
          <DataList.ItemLabel>{t(`${field}.label`)}</DataList.ItemLabel>
          <DataList.ItemValue>{t(`${field}.value`)}</DataList.ItemValue>
        </DataList.Item>
      ))}
      <DataList.Item>
        <DataList.ItemLabel>{t("state")}</DataList.ItemLabel>
        <DataList.ItemValue>
          <Badge palette="success">{t("settled")}</Badge>
        </DataList.ItemValue>
      </DataList.Item>
    </DataList.Root>
  );
}
