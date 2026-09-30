import { type ReactElement, useState } from "react";
import { createPortal } from "react-dom";

import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { useListCollection } from "@stealthscale/component-collections";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Select from "#select/index.ts";

interface Currency {
  readonly code: string;
  readonly name: string;
}

const CODES = ["EUR", "GBP", "USD", "JPY"] as const;

export function Currencies(): ReactElement {
  const { t } = useWords("select");
  const [code, setCode] = useState("EUR");
  const { collection } = useListCollection<Currency>({
    itemToString: (currency) => currency.name,
    itemToValue: (currency) => currency.code,
    rows: CODES.map((each) => ({ code: each, name: t(`currency.${each}`) })),
  });
  const amount = new Intl.NumberFormat("en", { currency: code, style: "currency" }).format(4200);

  return (
    <Stack gap="md">
      <Select.Root
        collection={collection}
        onValueChange={({ value }) => {
          setCode(value[0] ?? "EUR");
        }}
        value={[code]}
      >
        <Select.Label>{t("currency.label")}</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText />
          </Select.Trigger>
          <Select.Indicator>
            <ChevronDownIcon />
          </Select.Indicator>
        </Select.Control>
        {createPortal(
          <Select.Positioner>
            <Select.Content>
              {collection.items.map((currency) => (
                <Select.Item item={currency} key={currency.code}>
                  <Select.ItemText item={currency}>{currency.name}</Select.ItemText>
                  <Select.ItemIndicator item={currency}>
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>,
          document.body,
        )}
      </Select.Root>
      <Text as="output">{t("currency.total", { amount })}</Text>
    </Stack>
  );
}
