import { type ReactElement } from "react";

import { CheckIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Checkbox from "#checkbox/index.ts";

export function Setting(props: Checkbox.RootProps): ReactElement {
  const { t } = useWords("checkbox");

  return (
    <Checkbox.Root {...props}>
      <Checkbox.Label>{t("weekly")}</Checkbox.Label>
      <Checkbox.Control>
        <Checkbox.Indicator>
          <CheckIcon strokeWidth={3} />
        </Checkbox.Indicator>
      </Checkbox.Control>
    </Checkbox.Root>
  );
}
