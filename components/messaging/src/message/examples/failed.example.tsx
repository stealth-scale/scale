import { type ReactElement } from "react";

import { CircleAlertIcon, RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import * as Message from "#message/index.ts";

export function Failed(): ReactElement {
  const { t } = useWords("message");

  return (
    <Message.Root align="end" aria-label={t("you")} look="solid" palette="primary" reveal="always">
      <Message.Content>
        <Message.Bubble failed>{t("failedText")}</Message.Bubble>
        <Message.Footer>
          <Message.Status status="failed">
            <CircleAlertIcon aria-hidden />
            {t("failed")}
          </Message.Status>
          <Message.Actions>
            <Button size="xs" variant="ghost">
              <RotateCcwIcon size="1em" />
              {t("retry")}
            </Button>
          </Message.Actions>
        </Message.Footer>
      </Message.Content>
    </Message.Root>
  );
}
