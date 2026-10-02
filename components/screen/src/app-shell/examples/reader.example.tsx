import { type ReactElement } from "react";

import { Tag } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { Link } from "@stealthscale/component-navigation";
import { Blockquote, Heading, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as AppShell from "#app-shell/index.ts";
import * as Toolbar from "#toolbar/index.ts";

const NOTES = ["retries", "idempotency", "outage"] as const;

const TOPICS = ["reliability", "queues"] as const;

export function Reader(props: AppShell.RootProps): ReactElement {
  const { t } = useWords("app-shell");

  return (
    <AppShell.Root {...props}>
      <AppShell.Header>
        <Toolbar.Root aria-label={t("fieldNotes")} size="sm">
          <Toolbar.Start>
            <Text as="span" size="sm" weight="semibold">
              {t("fieldNotes")}
            </Text>
          </Toolbar.Start>
          <Toolbar.End>
            <Toolbar.Item as={AppShell.Trigger} panel="aside">
              {t("related")}
            </Toolbar.Item>
          </Toolbar.End>
        </Toolbar.Root>
      </AppShell.Header>
      <AppShell.Body>
        <AppShell.Main>
          <AppShell.Section>
            <Heading as="h2" size="md">
              {t("whyMoved")}
            </Heading>
            <Text size="sm" tone="muted">
              {t("byline")}
            </Text>
            <Text size="sm">{t("movedOne")}</Text>
            <Blockquote.Root size="sm">
              <Blockquote.Content>{t("movedQuote")}</Blockquote.Content>
            </Blockquote.Root>
            <Heading as="h3" size="xs">
              {t("whatBroke")}
            </Heading>
            <Text size="sm">{t("brokeOne")}</Text>
            <Text size="sm">{t("brokeTwo")}</Text>
          </AppShell.Section>
        </AppShell.Main>
        <AppShell.Aside folds="under" width="15rem">
          <AppShell.Section>
            <Heading as="h2" size="xs">
              {t("related")}
            </Heading>
            {NOTES.map((note) => (
              <Text key={note} size="sm">
                <Link href={`#${note}`}>{t(note)}</Link>
              </Text>
            ))}
            <Stack direction="row" gap="xs" wrap>
              {TOPICS.map((topic) => (
                <Tag.Root key={topic} size="sm">
                  <Tag.Label>{t(topic)}</Tag.Label>
                </Tag.Root>
              ))}
            </Stack>
          </AppShell.Section>
        </AppShell.Aside>
      </AppShell.Body>
    </AppShell.Root>
  );
}
