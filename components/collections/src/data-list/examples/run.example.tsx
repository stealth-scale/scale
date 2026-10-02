import { type ReactElement } from "react";

import { Status } from "@stealthscale/component-data";
import { Code, Span } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as DataList from "#data-list/index.ts";

export function Run(): ReactElement {
  const { t } = useWords("data-list");

  return (
    <DataList.Root orientation="horizontal">
      <DataList.Item>
        <DataList.ItemLabel>{t("run.status")}</DataList.ItemLabel>
        <DataList.ItemValue>
          <Status.Root palette="success" size="inherit">
            <Status.Indicator />
            {t("run.passed")}
          </Status.Root>
        </DataList.ItemValue>
      </DataList.Item>
      <DataList.Item>
        <DataList.ItemLabel>{t("run.branch")}</DataList.ItemLabel>
        <DataList.ItemValue>
          <Code size="sm">main</Code>
        </DataList.ItemValue>
      </DataList.Item>
      <DataList.Item>
        <DataList.ItemLabel>{t("run.duration")}</DataList.ItemLabel>
        <DataList.ItemValue>
          {t("run.took")}
          <Span tone="muted">{t("run.faster")}</Span>
        </DataList.ItemValue>
      </DataList.Item>
      <DataList.Item>
        <DataList.ItemLabel>{t("run.artifact")}</DataList.ItemLabel>
        <DataList.ItemValue>{t("run.urn")}</DataList.ItemValue>
      </DataList.Item>
    </DataList.Root>
  );
}
