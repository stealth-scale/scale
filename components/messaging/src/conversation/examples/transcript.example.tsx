import { Fragment, type ReactElement } from "react";

import { ArrowDownIcon, CheckCheckIcon } from "lucide-react";

import { Timestamp } from "@stealthscale/component-data";
import { Divider } from "@stealthscale/component-layout";
import { Avatar } from "@stealthscale/component-media";
import { Strong } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Conversation from "#conversation/index.ts";
import * as Message from "#message/index.ts";
import { groupTurns, type Turn } from "#turns/index.ts";

const TIME: Intl.DateTimeFormatOptions = { timeStyle: "short", timeZone: "UTC" };

const DAY: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeZone: "UTC" };

const SAID = [
  { author: "ada", id: "m1", key: "hello", sentAt: "2026-09-29T08:02:00Z" },
  { author: "ada", id: "m2", key: "check", sentAt: "2026-09-29T08:03:00Z" },
  { author: "me", id: "m3", key: "please", sentAt: "2026-09-29T08:20:00Z" },
  { author: "ada", id: "m4", key: "matches", sentAt: "2026-09-30T09:12:00Z" },
  { author: "ada", id: "m5", key: "approve", sentAt: "2026-09-30T09:12:30Z" },
  { author: "me", id: "m6", key: "approved", sentAt: "2026-09-30T09:14:00Z" },
  { author: "ada", id: "m7", key: "thanks", sentAt: "2026-09-30T09:15:00Z" },
] as const;

interface Said {
  readonly author: string;
  readonly id: string;
  readonly sentAt: string;
  readonly text: string;
}

interface Words {
  readonly ada: string;
  readonly read: string;
  readonly you: string;
}

function turnOf(turn: Turn<Said>, words: Words): ReactElement {
  const bubbles = turn.messages.map((said) => (
    <Message.Bubble key={said.id}>{said.text}</Message.Bubble>
  ));

  return turn.own ? (
    <Message.Root
      align="end"
      aria-label={words.you}
      key={turn.first.id}
      look="solid"
      palette="primary"
    >
      <Message.Content>
        {bubbles}
        <Message.Footer>
          <Timestamp options={TIME} value={turn.last.sentAt} />
          <Message.Status status="read">
            <CheckCheckIcon aria-hidden />
            {words.read}
          </Message.Status>
        </Message.Footer>
      </Message.Content>
    </Message.Root>
  ) : (
    <Message.Root key={turn.first.id}>
      <Message.Avatar>
        <Avatar.Root aria-hidden name={words.ada} size="sm">
          <Avatar.Fallback />
        </Avatar.Root>
      </Message.Avatar>
      <Message.Content>
        <Message.Header>
          <Strong>{words.ada}</Strong>
          <Timestamp options={TIME} value={turn.first.sentAt} />
        </Message.Header>
        {bubbles}
      </Message.Content>
    </Message.Root>
  );
}

export function Transcript(): ReactElement {
  const { t } = useWords("conversation");
  const words = { ada: t("ada"), read: t("read"), you: t("you") };
  const said = SAID.map((one) => ({
    author: one.author,
    id: one.id,
    sentAt: one.sentAt,
    text: t(one.key),
  }));

  return (
    <Conversation.Root inset="sm" label={t("label")} maxHeight="xs">
      <Conversation.Content>
        {groupTurns(said, { self: "me", timeZone: "UTC" }).map((day) => (
          <Fragment key={day.key}>
            {day.day === undefined ? null : (
              <Divider label={<Timestamp options={DAY} value={day.day} />} />
            )}
            {day.turns.map((turn) => turnOf(turn, words))}
          </Fragment>
        ))}
        <Conversation.Typing>{t("typing")}</Conversation.Typing>
      </Conversation.Content>
      <Conversation.JumpTrigger label={t("jump")}>
        <ArrowDownIcon size="1em" />
      </Conversation.JumpTrigger>
    </Conversation.Root>
  );
}
