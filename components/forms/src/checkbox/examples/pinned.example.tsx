import { type ReactElement, useState } from "react";

import { CheckIcon } from "lucide-react";

import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Checkbox from "#checkbox/index.ts";
import * as Fieldset from "#fieldset/index.ts";

const REPORTS = ["revenue", "payouts", "refunds", "disputes", "fees"];

const LIMIT = 3;

export function Pinned(): ReactElement {
  const { t } = useWords("checkbox");
  const [pinned, setPinned] = useState(["revenue", "payouts"]);

  return (
    <Fieldset.Root>
      <Fieldset.Legend>{t("pinned.legend")}</Fieldset.Legend>
      <Fieldset.HelperText>{t("pinned.helper", { limit: LIMIT })}</Fieldset.HelperText>
      <Checkbox.Group
        maxSelectedValues={LIMIT}
        name="pinned"
        onValueChange={setPinned}
        value={pinned}
      >
        {REPORTS.map((report) => (
          <Checkbox.Root key={report} value={report}>
            <Checkbox.Control>
              <Checkbox.Indicator>
                <CheckIcon strokeWidth={3} />
              </Checkbox.Indicator>
            </Checkbox.Control>
            <Checkbox.Label>{t(`pinned.reports.${report}`)}</Checkbox.Label>
          </Checkbox.Root>
        ))}
      </Checkbox.Group>
      <Text as="output">{t("pinned.count", { limit: LIMIT, pinned: pinned.length })}</Text>
    </Fieldset.Root>
  );
}
