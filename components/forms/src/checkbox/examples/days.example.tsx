import { type ReactElement } from "react";

import { CheckIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Checkbox from "#checkbox/index.ts";
import * as Fieldset from "#fieldset/index.ts";

const DAYS = ["mon", "tue", "wed", "thu", "fri"];

const CHOSEN = ["mon", "wed", "fri"];

const MONDAY = Date.UTC(2026, 0, 5);

const DAY = 86_400_000;

export function Days(): ReactElement {
  const { i18n, t } = useWords("checkbox");
  const weekday = new Intl.DateTimeFormat(i18n.language, { timeZone: "UTC", weekday: "long" });

  return (
    <Fieldset.Root>
      <Fieldset.Legend>{t("days")}</Fieldset.Legend>
      <Checkbox.Group defaultValue={CHOSEN} name="days" orientation="horizontal">
        {DAYS.map((day, index) => (
          <Checkbox.Root key={day} value={day}>
            <Checkbox.Control>
              <Checkbox.Indicator>
                <CheckIcon strokeWidth={3} />
              </Checkbox.Indicator>
            </Checkbox.Control>
            <Checkbox.Label>{weekday.format(MONDAY + index * DAY)}</Checkbox.Label>
          </Checkbox.Root>
        ))}
      </Checkbox.Group>
    </Fieldset.Root>
  );
}
