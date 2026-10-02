import { type ReactElement, useState } from "react";

import { DataList } from "@stealthscale/component-collections";
import { Badge } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { Avatar } from "@stealthscale/component-media";
import { Portal } from "@stealthscale/component-primitives";
import { Span, Strong } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as HoverCard from "#hover-card/index.ts";

const REVIEWS = [
  ["ada", "success"],
  ["grace", "warning"],
  ["alan", "neutral"],
] as const;

type Person = (typeof REVIEWS)[number][0];

export function Reviewers(): ReactElement {
  const { t } = useWords("hover-card");
  const [person, setPerson] = useState<null | Person>(null);

  return (
    <HoverCard.Root
      as="div"
      onTriggerValueChange={({ value }) => {
        setPerson(REVIEWS.find(([id]) => id === value)?.[0] ?? null);
      }}
      positioning={{ flip: ["bottom-start"], placement: "right" }}
    >
      <DataList.Root orientation="horizontal">
        {REVIEWS.map(([id, palette]) => (
          <DataList.Item key={id}>
            <DataList.ItemLabel>
              <HoverCard.Trigger href={`#people-${id}`} value={id}>
                {t(`people.${id}.name`)}
              </HoverCard.Trigger>
            </DataList.ItemLabel>
            <DataList.ItemValue>
              <Badge palette={palette}>{t(`people.${id}.verdict`)}</Badge>
            </DataList.ItemValue>
          </DataList.Item>
        ))}
      </DataList.Root>
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content>
            <HoverCard.Arrow>
              <HoverCard.ArrowTip />
            </HoverCard.Arrow>
            {person === null ? null : (
              <Stack direction="row" gap="sm">
                <Avatar.Root aria-hidden name={t(`people.${person}.name`)}>
                  <Avatar.Fallback />
                </Avatar.Root>
                <Stack gap="xs">
                  <Strong>{t(`people.${person}.name`)}</Strong>
                  <Span tone="muted">{t(`people.${person}.role`)}</Span>
                </Stack>
              </Stack>
            )}
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  );
}
