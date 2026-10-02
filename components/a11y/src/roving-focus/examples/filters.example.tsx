import { type ReactElement } from "react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as RovingFocus from "#roving-focus/index.ts";

const SMALL = { size: "sm", variant: "outline" } as const;

const STATUSES = [
  "paid",
  "pending",
  "overdue",
  "refunded",
  "disputed",
  "draft",
  "scheduled",
  "void",
] as const;

export function Filters(): ReactElement {
  const { t } = useWords("roving-focus");

  return (
    <RovingFocus.Root aria-label={t("filters")} orientation="both" role="toolbar">
      <ButtonPropsProvider value={SMALL}>
        <Stack direction="row" gap="sm" wrap>
          {STATUSES.map((status) => (
            <RovingFocus.Item as={Button} key={status}>
              {t(`statuses.${status}`)}
            </RovingFocus.Item>
          ))}
        </Stack>
      </ButtonPropsProvider>
    </RovingFocus.Root>
  );
}
