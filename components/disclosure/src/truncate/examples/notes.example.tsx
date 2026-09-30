import { type ReactElement } from "react";

import { DataList } from "@stealthscale/component-collections";
import { Code } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { Truncate } from "#truncate/index.ts";

const SHIPMENTS = [
  { id: "NL-2291", key: "held" },
  { id: "NL-2292", key: "delivered" },
  { id: "NL-2293", key: "rerouted" },
] as const;

export function Notes(): ReactElement {
  const { t } = useWords("truncate");

  return (
    <DataList.Root orientation="horizontal">
      {SHIPMENTS.map(({ id, key }) => (
        <DataList.Item key={id}>
          <DataList.ItemLabel>
            <Code>{id}</Code>
          </DataList.ItemLabel>
          <DataList.ItemValue>
            <Truncate focusable>{t(`notes.items.${key}`)}</Truncate>
          </DataList.ItemValue>
        </DataList.Item>
      ))}
    </DataList.Root>
  );
}
