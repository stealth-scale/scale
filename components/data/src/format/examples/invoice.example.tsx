import { type ReactElement } from "react";

import { DataList } from "@stealthscale/component-collections";
import { useWords } from "@stealthscale/specimen";

import * as Format from "#format/index.ts";

const EUROS: Intl.NumberFormatOptions = { currency: "EUR", style: "currency" };

export function Invoice(): ReactElement {
  const { t } = useWords("format");

  return (
    <DataList.Root orientation="horizontal">
      <DataList.Item>
        <DataList.ItemLabel>{t("invoice.subtotal")}</DataList.ItemLabel>
        <DataList.ItemValue>
          <Format.Number options={EUROS} value={1_056_430.5} />
        </DataList.ItemValue>
      </DataList.Item>
      <DataList.Item>
        <DataList.ItemLabel>{t("invoice.rate")}</DataList.ItemLabel>
        <DataList.ItemValue>
          <Format.Number options={{ style: "percent" }} value={0.21} />
        </DataList.ItemValue>
      </DataList.Item>
      <DataList.Item>
        <DataList.ItemLabel>{t("invoice.total")}</DataList.ItemLabel>
        <DataList.ItemValue>
          <Format.Number options={EUROS} value={1_278_280.91} />
        </DataList.ItemValue>
      </DataList.Item>
    </DataList.Root>
  );
}
