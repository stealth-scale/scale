import { type ReactElement, useState } from "react";

import { XIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Tag from "#tag/index.ts";

const FILTERS = ["ledger", "payouts", "archived", "settled", "returned"] as const;

export function Filters(): ReactElement {
  const { t } = useWords("tag");
  const [kept, setKept] = useState<ReadonlyArray<(typeof FILTERS)[number]>>(FILTERS);

  return (
    <Stack direction="row" gap="sm" wrap>
      {kept.map((filter) => (
        <Tag.Root key={filter} palette="primary">
          <Tag.Label>{t(`words.${filter}`)}</Tag.Label>
          <Tag.CloseTrigger
            aria-label={t("remove", { name: t(`words.${filter}`) })}
            onClick={() => {
              setKept((left) => left.filter((one) => one !== filter));
            }}
          >
            <XIcon aria-hidden />
          </Tag.CloseTrigger>
        </Tag.Root>
      ))}
      <Button
        onClick={() => {
          setKept(FILTERS);
        }}
        size="xs"
        variant="ghost"
      >
        {t("reset")}
      </Button>
    </Stack>
  );
}
