import { type ReactElement } from "react";

import { CopyIcon, RefreshCwIcon, SparklesIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

import { IconButton } from "@stealthscale/component-actions";
import { Markdown } from "@stealthscale/component-content";
import { Avatar } from "@stealthscale/component-media";
import { Strong } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Message from "#message/index.ts";

const ACTIONS = [
  ["copy", CopyIcon],
  ["regenerate", RefreshCwIcon],
  ["good", ThumbsUpIcon],
  ["bad", ThumbsDownIcon],
] as const;

export function Answer(): ReactElement {
  const { t } = useWords("message");

  return (
    <Message.Root look="plain" reveal="always">
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
        <Message.Bubble>
          <Markdown headingLevel={3} source={t("summary")} />
        </Message.Bubble>
        <Message.Footer>
          <Message.Actions>
            {ACTIONS.map(([action, Glyph]) => (
              <IconButton aria-label={t(action)} key={action} size="xs" variant="ghost">
                <Glyph size="1em" />
              </IconButton>
            ))}
          </Message.Actions>
        </Message.Footer>
      </Message.Content>
    </Message.Root>
  );
}
