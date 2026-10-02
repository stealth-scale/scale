import { type ReactElement } from "react";

import { ChevronDownIcon, FileTextIcon, ScaleIcon, ShieldIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Accordion from "#accordion/index.ts";

const CLAUSES = [
  { Icon: FileTextIcon, value: "scope" },
  { Icon: ScaleIcon, value: "payment" },
  { Icon: ShieldIcon, value: "liability" },
] as const;

export function Clauses(): ReactElement {
  const { t } = useWords("accordion");

  return (
    <Accordion.Root collapsible defaultValue={["payment"]} variant="outline">
      {CLAUSES.map(({ Icon, value }) => (
        <Accordion.Item key={value} value={value}>
          <Accordion.ItemHeading>
            <Accordion.ItemTrigger>
              <Icon />
              {t(`clauses.${value}.title`)}
              <Accordion.ItemIndicator>
                <ChevronDownIcon size="100%" />
              </Accordion.ItemIndicator>
            </Accordion.ItemTrigger>
          </Accordion.ItemHeading>
          <Accordion.ItemContent>
            <Accordion.ItemBody>{t(`clauses.${value}.body`)}</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
