import { type ReactElement } from "react";

import { CheckIcon, MinusIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Checkbox from "#checkbox/index.ts";

export function Terms(props: Checkbox.RootProps): ReactElement {
  const { t } = useWords("checkbox");

  return (
    <Checkbox.Root defaultChecked {...props}>
      <Checkbox.Control>
        <Checkbox.Indicator>
          <CheckIcon strokeWidth={3} />
        </Checkbox.Indicator>
        <Checkbox.Indicator indeterminate>
          <MinusIcon strokeWidth={3} />
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Label>{t("terms")}</Checkbox.Label>
    </Checkbox.Root>
  );
}
