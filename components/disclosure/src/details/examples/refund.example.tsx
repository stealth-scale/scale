import { type ReactElement } from "react";

import { ChevronRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Details from "#details/index.ts";

export function Refund(props: Details.RootProps): ReactElement {
  const { t } = useWords("details");

  return (
    <Details.Root {...props}>
      <Details.Summary>
        <Details.Indicator>
          <ChevronRightIcon />
        </Details.Indicator>
        {t("refund.question")}
      </Details.Summary>
      <Details.Content>{t("refund.answer")}</Details.Content>
    </Details.Root>
  );
}
