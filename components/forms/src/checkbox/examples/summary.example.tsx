import { type ReactElement } from "react";

import { CheckIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Checkbox from "#checkbox/index.ts";

export function Summary(props: Checkbox.RootProps): ReactElement {
  const { t } = useWords("checkbox");

  return (
    <Checkbox.Root {...props}>
      <Checkbox.Control>
        <Checkbox.Indicator>
          <CheckIcon strokeWidth={3} />
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Label>{t("long")}</Checkbox.Label>
    </Checkbox.Root>
  );
}
