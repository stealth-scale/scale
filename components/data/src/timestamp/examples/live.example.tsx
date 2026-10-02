import { type ReactElement, useState } from "react";

import { DataList } from "@stealthscale/component-collections";
import { useWords } from "@stealthscale/specimen";

import { Timestamp } from "#timestamp/index.ts";

export function Live(): ReactElement {
  const { t } = useWords("timestamp");
  const [posted] = useState(() => Date.now() - 59_500);

  return (
    <DataList.Root orientation="horizontal">
      <DataList.Item>
        <DataList.ItemLabel>{t("live.ticking")}</DataList.ItemLabel>
        <DataList.ItemValue>
          <Timestamp reads="relative" updateInterval={1000} value={posted} />
        </DataList.ItemValue>
      </DataList.Item>
      <DataList.Item>
        <DataList.ItemLabel>{t("live.once")}</DataList.ItemLabel>
        <DataList.ItemValue>
          <Timestamp reads="relative" value={posted} />
        </DataList.ItemValue>
      </DataList.Item>
    </DataList.Root>
  );
}
