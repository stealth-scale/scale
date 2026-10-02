import { type ReactElement } from "react";

import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { Checkbox } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Accordion from "#accordion/index.ts";

const GROUPS = [
  { options: ["coats", "knitwear", "shoes"], value: "category" },
  { options: ["under50", "under100", "over100"], value: "price" },
  { options: ["black", "navy", "sand"], value: "colour" },
] as const;

export function Filters(): ReactElement {
  const { t } = useWords("accordion");

  return (
    <Accordion.Root defaultValue={["category", "price"]} multiple size="sm">
      {GROUPS.map((group) => (
        <Accordion.Item key={group.value} value={group.value}>
          <Accordion.ItemHeading>
            <Accordion.ItemTrigger>
              {t(`filters.${group.value}`)}
              <Accordion.ItemIndicator>
                <ChevronDownIcon size="100%" />
              </Accordion.ItemIndicator>
            </Accordion.ItemTrigger>
          </Accordion.ItemHeading>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <Stack gap="sm">
                {group.options.map((option) => (
                  <Checkbox.Root key={option} size="sm" value={option}>
                    <Checkbox.Control>
                      <Checkbox.Indicator>
                        <CheckIcon strokeWidth={3} />
                      </Checkbox.Indicator>
                    </Checkbox.Control>
                    <Checkbox.Label>{t(`filters.${option}`)}</Checkbox.Label>
                  </Checkbox.Root>
                ))}
              </Stack>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
