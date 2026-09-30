import { type ReactElement } from "react";

import { ChevronRightIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Details from "#details/index.ts";

const QUESTIONS = ["timing", "fees", "currencies"];

export function Faq(): ReactElement {
  const { t } = useWords("details");

  return (
    <Stack gap="sm">
      {QUESTIONS.map((question) => (
        <Details.Root key={question} name="payout-questions">
          <Details.Summary>
            <Details.Indicator>
              <ChevronRightIcon />
            </Details.Indicator>
            {t(`faq.${question}.question`)}
          </Details.Summary>
          <Details.Content>{t(`faq.${question}.answer`)}</Details.Content>
        </Details.Root>
      ))}
    </Stack>
  );
}
