import { type ReactElement, useEffect, useState } from "react";

import { ArrowDownIcon, ArrowUpIcon, CheckCheckIcon, CheckIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { Avatar } from "@stealthscale/component-media";
import { useWords } from "@stealthscale/specimen";

import * as Composer from "#composer/index.ts";
import * as Conversation from "#conversation/index.ts";
import * as Message from "#message/index.ts";
import { groupTurns, type Turn } from "#turns/index.ts";

const REPLIES = ["scheduled", "confirmed", "archive", "thanks"] as const;

const OPENING = [
  { author: "ada", id: "hello", key: "hello" },
  { author: "ada", id: "check", key: "check" },
  { author: "me", id: "please", key: "please" },
  { author: "ada", id: "matches", key: "matches" },
  { author: "ada", id: "approve", key: "approve" },
  { author: "me", id: "approved", key: "approved" },
] as const;

type Said = (typeof OPENING)[number]["key"] | (typeof REPLIES)[number];

interface Sent {
  readonly author: string;
  readonly id: string;
  readonly key?: Said;
  readonly typed?: string;
}

interface Shown {
  readonly author: string;
  readonly id: string;
  readonly text: string;
}

interface Words {
  readonly ada: string;
  readonly delivered: string;
  readonly read: string;
  readonly you: string;
}

function turnOf(turn: Turn<Shown>, words: Words, unread: boolean): ReactElement {
  const bubbles = turn.messages.map((one) => (
    <Message.Bubble key={one.id}>{one.text}</Message.Bubble>
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
          <Message.Status status={unread ? "delivered" : "read"}>
            {unread ? <CheckIcon aria-hidden /> : <CheckCheckIcon aria-hidden />}
            {unread ? words.delivered : words.read}
          </Message.Status>
        </Message.Footer>
      </Message.Content>
    </Message.Root>
  ) : (
    <Message.Root aria-label={words.ada} key={turn.first.id}>
      <Message.Avatar>
        <Avatar.Root aria-hidden name={words.ada} size="sm">
          <Avatar.Fallback />
        </Avatar.Root>
      </Message.Avatar>
      <Message.Content>{bubbles}</Message.Content>
    </Message.Root>
  );
}

export function Chat(): ReactElement {
  const { t } = useWords("conversation");
  const conversation = Conversation.useConversation();
  const [sent, setSent] = useState<readonly Sent[]>(OPENING);
  const [typing, setTyping] = useState(false);
  const words = { ada: t("ada"), delivered: t("delivered"), read: t("read"), you: t("you") };
  const shown = sent.map((one) => ({
    author: one.author,
    id: one.id,
    text: one.key === undefined ? (one.typed ?? "") : t(one.key),
  }));
  const turns = groupTurns(shown, { self: "me" }).flatMap((day) => day.turns);

  useEffect(() => {
    const timer = typing
      ? setTimeout(() => {
          setTyping(false);
          setSent((was) => [
            ...was,
            {
              author: "ada",
              id: `ada-${String(was.length)}`,
              key: REPLIES[was.length % REPLIES.length] ?? "thanks",
            },
          ]);
        }, 1500)
      : undefined;

    return (): void => {
      clearTimeout(timer);
    };
  }, [typing]);

  return (
    <Stack gap="sm">
      <Conversation.Root conversation={conversation} inset="sm" label={t("label")} maxHeight="xs">
        <Conversation.Content>
          {turns.map((turn, at) => turnOf(turn, words, !typing && at === turns.length - 1))}
          {typing ? <Conversation.Typing>{t("typing")}</Conversation.Typing> : null}
        </Conversation.Content>
        <Conversation.JumpTrigger label={t("jump")}>
          <ArrowDownIcon size="1em" />
        </Conversation.JumpTrigger>
      </Conversation.Root>
      <Composer.Root
        onSubmit={(typed) => {
          setSent((was) => [...was, { author: "me", id: `me-${String(was.length)}`, typed }]);
          setTyping(true);
          conversation.scrollToEnd();
        }}
      >
        <Composer.Input label={t("message")} placeholder={t("placeholder")} />
        <Composer.Toolbar>
          <Composer.Submit label={t("send")}>
            <ArrowUpIcon size="1em" />
          </Composer.Submit>
        </Composer.Toolbar>
      </Composer.Root>
    </Stack>
  );
}
