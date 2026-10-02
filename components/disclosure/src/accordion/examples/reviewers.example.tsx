import { type ReactElement } from "react";

import { ChevronDownIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { Avatar } from "@stealthscale/component-media";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Accordion from "#accordion/index.ts";

const REVIEWERS = ["ada", "tomas", "iris"] as const;

export function Reviewers(): ReactElement {
  const { t } = useWords("accordion");

  return (
    <Accordion.Root collapsible defaultValue={["tomas"]} variant="subtle">
      {REVIEWERS.map((reviewer) => (
        <Accordion.Item key={reviewer} value={reviewer}>
          <Accordion.ItemHeading>
            <Accordion.ItemTrigger>
              <Avatar.Root
                aria-hidden
                name={t(`reviewers.${reviewer}.name`)}
                size="xs"
                variant="surface"
              >
                <Avatar.Fallback />
              </Avatar.Root>
              <Stack as="span" gap="xs">
                {t(`reviewers.${reviewer}.name`)}
                <Text as="span" size="sm" tone="muted" weight="normal">
                  {t(`reviewers.${reviewer}.role`)}
                </Text>
              </Stack>
              <Accordion.ItemIndicator>
                <ChevronDownIcon size="100%" />
              </Accordion.ItemIndicator>
            </Accordion.ItemTrigger>
          </Accordion.ItemHeading>
          <Accordion.ItemContent>
            <Accordion.ItemBody>{t(`reviewers.${reviewer}.note`)}</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
