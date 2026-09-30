import { type ReactElement, type UIEvent, useState } from "react";

import { ArrowDownIcon } from "lucide-react";

import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Conversation from "#conversation/index.ts";
import * as Message from "#message/index.ts";

const PAGES = [
  ["opened", "asked", "sent", "found"],
  ["hello", "check", "please", "matches"],
] as const;

const LATEST = ["approve", "approved", "thanks"] as const;

export function History(): ReactElement {
  const { t } = useWords("conversation");
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const keys = [...PAGES.slice(PAGES.length - pages).flat(), ...LATEST];

  function reached(event: UIEvent<HTMLElement>): void {
    if (event.currentTarget.scrollTop > 0 || loading || pages === PAGES.length) return;

    setLoading(true);
    setTimeout(() => {
      setPages((was) => was + 1);
      setLoading(false);
    }, 600);
  }

  return (
    <Conversation.Root inset="sm" label={t("label")} maxHeight="xs">
      <Conversation.Content aria-busy={loading} onScroll={reached}>
        {loading ? <Text size="sm">{t("loading")}</Text> : null}
        {keys.map((key, index) => (
          <Message.Root
            align={index % 2 === 0 ? "start" : "end"}
            aria-label={index % 2 === 0 ? t("ada") : t("you")}
            key={key}
            look={index % 2 === 0 ? "subtle" : "solid"}
            palette={index % 2 === 0 ? "neutral" : "primary"}
          >
            <Message.Content>
              <Message.Bubble>{t(key)}</Message.Bubble>
            </Message.Content>
          </Message.Root>
        ))}
      </Conversation.Content>
      <Conversation.JumpTrigger label={t("jump")}>
        <ArrowDownIcon size="1em" />
      </Conversation.JumpTrigger>
    </Conversation.Root>
  );
}
