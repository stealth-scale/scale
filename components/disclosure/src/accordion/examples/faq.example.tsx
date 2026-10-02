import { type ReactElement } from "react";

import { ChevronDownIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Accordion from "#accordion/index.ts";

const QUESTIONS = ["delivery", "returns", "abroad"] as const;

export function Faq(props: Accordion.RootProps): ReactElement {
  const { t } = useWords("accordion");

  return (
    <Accordion.Root collapsible defaultValue={["delivery"]} {...props}>
      {QUESTIONS.map((question) => (
        <Accordion.Item key={question} value={question}>
          <Accordion.ItemHeading>
            <Accordion.ItemTrigger>
              {t(`faq.${question}.question`)}
              <Accordion.ItemIndicator>
                <ChevronDownIcon size="100%" />
              </Accordion.ItemIndicator>
            </Accordion.ItemTrigger>
          </Accordion.ItemHeading>
          <Accordion.ItemContent>
            <Accordion.ItemBody>{t(`faq.${question}.answer`)}</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
