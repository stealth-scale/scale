import { type ReactElement } from "react";

import { CopyIcon } from "lucide-react";

import { IconButton } from "@stealthscale/component-actions";
import { Timestamp } from "@stealthscale/component-data";
import { Avatar } from "@stealthscale/component-media";
import { Strong } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Message from "#message/index.ts";

const TIME: Intl.DateTimeFormatOptions = { timeStyle: "short", timeZone: "UTC" };

export function Turn(props: Message.RootProps): ReactElement {
  const { t } = useWords("message");

  return (
    <Message.Root {...props}>
      <Message.Avatar>
        <Avatar.Root aria-hidden name={t("ada")} size="sm">
          <Avatar.Fallback />
        </Avatar.Root>
      </Message.Avatar>
      <Message.Content>
        <Message.Header>
          <Strong>{t("ada")}</Strong>
          <Timestamp options={TIME} value="2026-09-30T09:12:00Z" />
        </Message.Header>
        <Message.Bubble>{t("invoice")}</Message.Bubble>
        <Message.Bubble>{t("approve")}</Message.Bubble>
        <Message.Footer>
          <Message.Actions>
            <IconButton aria-label={t("copy")} size="xs" variant="ghost">
              <CopyIcon size="1em" />
            </IconButton>
          </Message.Actions>
        </Message.Footer>
      </Message.Content>
    </Message.Root>
  );
}
