import { type ReactElement } from "react";

import { CheckCheckIcon } from "lucide-react";

import { Timestamp } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { Avatar } from "@stealthscale/component-media";
import { Strong } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Message from "#message/index.ts";

const TIME: Intl.DateTimeFormatOptions = { timeStyle: "short", timeZone: "UTC" };

export function Exchange(): ReactElement {
  const { t } = useWords("message");

  return (
    <Stack gap="lg">
      <Message.Root>
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
        </Message.Content>
      </Message.Root>
      <Message.Root align="end" aria-label={t("you")} look="solid" palette="primary">
        <Message.Content>
          <Message.Bubble>{t("approved")}</Message.Bubble>
          <Message.Footer>
            <Timestamp options={TIME} value="2026-09-30T09:14:00Z" />
            <Message.Status status="read">
              <CheckCheckIcon aria-hidden />
              {t("read")}
            </Message.Status>
          </Message.Footer>
        </Message.Content>
      </Message.Root>
    </Stack>
  );
}
