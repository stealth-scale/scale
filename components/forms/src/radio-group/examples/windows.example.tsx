import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as RadioGroup from "#radio-group/index.ts";

const WINDOWS = ["same", "next", "weekly"] as const;

export function Windows(props: RadioGroup.RootProps): ReactElement {
  const { t } = useWords("radio-group");

  return (
    <RadioGroup.Root defaultValue="next" {...props}>
      <RadioGroup.Label>{t("window")}</RadioGroup.Label>
      {WINDOWS.map((window) => (
        <RadioGroup.Item key={window} value={window}>
          <RadioGroup.ItemControl />
          <RadioGroup.ItemText>{t(`windows.${window}`)}</RadioGroup.ItemText>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}
