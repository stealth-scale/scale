import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as RadioGroup from "#radio-group/index.ts";

const SCHEDULES = ["instant", "batched"] as const;

export function Schedule(props: RadioGroup.RootProps): ReactElement {
  const { t } = useWords("radio-group");

  return (
    <RadioGroup.Root defaultValue="batched" {...props}>
      <RadioGroup.Label>{t("schedule")}</RadioGroup.Label>
      {SCHEDULES.map((schedule) => (
        <RadioGroup.Item key={schedule} value={schedule}>
          <RadioGroup.ItemControl />
          <RadioGroup.ItemText>{t(`schedules.${schedule}`)}</RadioGroup.ItemText>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}
