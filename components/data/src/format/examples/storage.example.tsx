import { type ReactElement } from "react";

import { DataList } from "@stealthscale/component-collections";
import { useWords } from "@stealthscale/specimen";

import * as Format from "#format/index.ts";

const FILES = [
  { key: "report", size: 1_450_000 },
  { key: "archive", size: 3_221_225_472 },
  { key: "notes", size: 512 },
] as const;

export function Storage(): ReactElement {
  const { t } = useWords("format");

  return (
    <DataList.Root orientation="horizontal">
      {FILES.map(({ key, size }) => (
        <DataList.Item key={key}>
          <DataList.ItemLabel>{t(`storage.files.${key}`)}</DataList.ItemLabel>
          <DataList.ItemValue>
            <Format.Byte value={size} />
          </DataList.ItemValue>
        </DataList.Item>
      ))}
      <DataList.Item>
        <DataList.ItemLabel>{t("storage.memory")}</DataList.ItemLabel>
        <DataList.ItemValue>
          <Format.Byte unitSystem="binary" value={17_179_869_184} />
        </DataList.ItemValue>
      </DataList.Item>
      <DataList.Item>
        <DataList.ItemLabel>{t("storage.link")}</DataList.ItemLabel>
        <DataList.ItemValue>
          <Format.Byte unit="bit" unitDisplay="long" value={250_000_000} />
        </DataList.ItemValue>
      </DataList.Item>
    </DataList.Root>
  );
}
