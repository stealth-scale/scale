import { type ReactElement, useEffect, useState } from "react";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronRightIcon,
  SparklesIcon,
  SquareIcon,
} from "lucide-react";

import { JsonTreeView, Markdown } from "@stealthscale/component-content";
import { Status } from "@stealthscale/component-data";
import { Details } from "@stealthscale/component-disclosure";
import { Stack } from "@stealthscale/component-layout";
import { Avatar } from "@stealthscale/component-media";
import { Code, Strong, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Composer from "#composer/index.ts";
import * as Conversation from "#conversation/index.ts";
import * as Message from "#message/index.ts";

const STEP = 12;

const TOOL = 20;

const CALL = {
  arguments: { metrics: ["revenue", "churn", "accounts"], quarter: "2026-Q3" },
  result: { accounts: 312, churn: 0.018, revenue: 4_200_000 },
};

const PALETTES = { cancelled: "neutral", done: "success", running: "info" } as const;

type Call = keyof typeof PALETTES;

function thinking(summary: string, reasoning: string): ReactElement {
  return (
    <Details.Root size="sm" variant="plain">
      <Details.Summary>
        <Details.Indicator>
          <ChevronRightIcon />
        </Details.Indicator>
        {summary}
      </Details.Summary>
      <Details.Content>
        <Text size="sm" tone="muted">
          {reasoning}
        </Text>
      </Details.Content>
    </Details.Root>
  );
}

function called(call: Call, name: string, state: string, label: string): ReactElement {
  return (
    <Details.Root size="sm">
      <Details.Summary>
        <Details.Indicator>
          <ChevronRightIcon />
        </Details.Indicator>
        <Stack as="span" direction="row" gap="sm" wrap>
          <Code>{name}</Code>
          <Status.Root palette={PALETTES[call]}>
            <Status.Indicator />
            {state}
          </Status.Root>
        </Stack>
      </Details.Summary>
      <Details.Content>
        <JsonTreeView.Root data={CALL} defaultExpandedDepth={2}>
          <JsonTreeView.Tree aria-label={label} arrow={<ChevronRightIcon />} />
        </JsonTreeView.Root>
      </Details.Content>
    </Details.Root>
  );
}

export function Assistant(): ReactElement {
  const { t } = useWords("conversation");
  const conversation = Conversation.useConversation();
  const answer = t("answer");
  const [question, setQuestion] = useState<string | undefined>();
  const [tick, setTick] = useState(Number.POSITIVE_INFINITY);
  const [stopped, setStopped] = useState(false);
  const busy = !stopped && tick < TOOL + Math.ceil(answer.length / STEP);
  const length = Math.min(answer.length, Math.max(0, tick - TOOL) * STEP);
  const call: Call = tick >= TOOL ? "done" : stopped ? "cancelled" : "running";

  useEffect(() => {
    const timer = busy
      ? setInterval(() => {
          setTick((at) => at + 1);
        }, 40)
      : undefined;

    return (): void => {
      clearInterval(timer);
    };
  }, [busy]);

  return (
    <Stack gap="sm">
      <Conversation.Root
        conversation={conversation}
        inset="sm"
        label={t("assistantLabel")}
        maxHeight="sm"
      >
        <Conversation.Content>
          <Message.Root align="end" aria-label={t("you")} look="solid" palette="primary">
            <Message.Content>
              <Message.Bubble>{question ?? t("question")}</Message.Bubble>
            </Message.Content>
          </Message.Root>
          <Message.Root aria-busy={busy} look="plain">
            <Message.Avatar>
              <Avatar.Root aria-hidden size="sm">
                <Avatar.Fallback>
                  <SparklesIcon />
                </Avatar.Fallback>
              </Avatar.Root>
            </Message.Avatar>
            <Message.Content>
              <Message.Header>
                <Strong>{t("assistant")}</Strong>
              </Message.Header>
              {thinking(t("thought"), t("reasoning"))}
              {called(call, t("tool"), t(call), t("call"))}
              {length > 0 ? (
                <Message.Bubble>
                  <Markdown
                    headingLevel={3}
                    size="sm"
                    source={answer.slice(0, length)}
                    streaming={busy}
                  />
                </Message.Bubble>
              ) : null}
              {stopped ? <Message.Footer>{t("stopped")}</Message.Footer> : null}
            </Message.Content>
          </Message.Root>
        </Conversation.Content>
        <Conversation.JumpTrigger label={t("jump")}>
          <ArrowDownIcon size="1em" />
        </Conversation.JumpTrigger>
      </Conversation.Root>
      <Composer.Root
        busy={busy}
        onStop={() => {
          setStopped(true);
        }}
        onSubmit={(asked) => {
          setQuestion(asked);
          setStopped(false);
          setTick(0);
          conversation.scrollToEnd();
        }}
      >
        <Composer.Input label={t("ask")} placeholder={t("askPlaceholder")} />
        <Composer.Toolbar>
          <Composer.Submit
            label={t("send")}
            stopIcon={<SquareIcon size="1em" />}
            stopLabel={t("stop")}
          >
            <ArrowUpIcon size="1em" />
          </Composer.Submit>
        </Composer.Toolbar>
      </Composer.Root>
    </Stack>
  );
}
