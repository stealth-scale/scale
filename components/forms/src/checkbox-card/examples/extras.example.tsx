import { type ReactElement } from "react";

import { CheckIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as CheckboxCard from "#checkbox-card/index.ts";
import * as Fieldset from "#fieldset/index.ts";

const EXTRAS = ["support", "audit", "sso"] as const;

export function Extras(): ReactElement {
  const { t } = useWords("checkbox-card");

  return (
    <Fieldset.Root>
      <Fieldset.Legend>{t("add")}</Fieldset.Legend>
      {EXTRAS.map((extra) => (
        <CheckboxCard.Root
          defaultChecked={extra === "audit"}
          disabled={extra === "sso"}
          key={extra}
          name="extras"
          value={extra}
        >
          <CheckboxCard.Content>
            <CheckboxCard.Label>{t(`options.${extra}.title`)}</CheckboxCard.Label>
            <CheckboxCard.Description>{t(`options.${extra}.about`)}</CheckboxCard.Description>
            <CheckboxCard.Control>
              <CheckboxCard.Indicator>
                <CheckIcon strokeWidth={3} />
              </CheckboxCard.Indicator>
            </CheckboxCard.Control>
          </CheckboxCard.Content>
          <CheckboxCard.Addon>{t(`options.${extra}.price`)}</CheckboxCard.Addon>
        </CheckboxCard.Root>
      ))}
    </Fieldset.Root>
  );
}
