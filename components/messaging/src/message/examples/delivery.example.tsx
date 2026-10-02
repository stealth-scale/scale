import { type ReactElement } from "react";

import { CheckCheckIcon, CheckIcon, ClockIcon } from "lucide-react";

import { Timestamp } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Message from "#message/index.ts";

const TIME: Intl.DateTimeFormatOptions = { timeStyle: "short", timeZone: "UTC" };

const SENT = [
  ["read", CheckCheckIcon, "09:14"],
  ["delivered", CheckCheckIcon, "09:20"],
  ["sent", CheckIcon, "09:21"],
  ["sending", ClockIcon, "09:22"],
] as const;

export function Delivery(): ReactElement {
  const { t } = useWords("message");

  return (
    <Stack gap="md">
      {SENT.map(([status, Glyph, at]) => (
        <Message.Root align="end" aria-label={t("you")} key={status} look="solid" palette="primary">
          <Message.Content>
            <Message.Bubble>{t(`${status}Text`)}</Message.Bubble>
            <Message.Footer>
              <Timestamp options={TIME} value={`2026-09-30T${at}:00Z`} />
              <Message.Status status={status}>
                <Glyph aria-hidden />
                {t(status)}
              </Message.Status>
            </Message.Footer>
          </Message.Content>
        </Message.Root>
      ))}
    </Stack>
  );
}
