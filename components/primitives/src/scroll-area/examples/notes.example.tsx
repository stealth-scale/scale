import { type ReactElement, useId } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Card } from "@stealthscale/component-surfaces";
import { Strong, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as ScrollArea from "#scroll-area/index.ts";

const RELEASES = ["r42", "r41", "r40", "r39", "r38", "r37", "r36", "r35"];

export function Notes(props: ScrollArea.RootProps): ReactElement {
  const { t } = useWords("scroll-area");
  const heading = useId();

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title id={heading}>{t("notes.heading")}</Card.Title>
      </Card.Header>
      <ScrollArea.Root maxHeight="xs" {...props}>
        <ScrollArea.Viewport aria-labelledby={heading}>
          <ScrollArea.Content>
            <Stack gap="md">
              {RELEASES.map((release) => (
                <Stack gap="xs" key={release}>
                  <Strong>{t(`notes.releases.${release}.version`)}</Strong>
                  <Text size="sm" tone="muted">
                    {t(`notes.releases.${release}.date`)}
                  </Text>
                  <Text size="sm">{t(`notes.releases.${release}.summary`)}</Text>
                </Stack>
              ))}
            </Stack>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar />
      </ScrollArea.Root>
    </Card.Root>
  );
}
