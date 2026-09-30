import { type ReactElement } from "react";

import { CircleAlertIcon, FileTextIcon, RotateCcwIcon, XIcon } from "lucide-react";

import { IconButton } from "@stealthscale/component-actions";
import { Spinner } from "@stealthscale/component-feedback";
import { useWords } from "@stealthscale/specimen";

import * as Attachment from "#attachment/index.ts";

const STATES = ["idle", "uploading", "processing", "error", "done"] as const;

export function States(): ReactElement {
  const { t } = useWords("attachment");

  return (
    <Attachment.Group aria-label={t("label")}>
      {STATES.map((state) => (
        <Attachment.Root key={state} state={state}>
          <Attachment.Media>
            {state === "uploading" || state === "processing" ? (
              <Spinner aria-hidden size="sm" />
            ) : null}
            {state === "error" ? <CircleAlertIcon aria-hidden /> : null}
            {state === "idle" || state === "done" ? <FileTextIcon aria-hidden /> : null}
          </Attachment.Media>
          <Attachment.Content>
            <Attachment.Title>{t(`${state}.name`)}</Attachment.Title>
            <Attachment.Description>{t(`${state}.detail`)}</Attachment.Description>
          </Attachment.Content>
          <Attachment.Actions>
            {state === "error" ? (
              <IconButton
                aria-label={t("retry", { name: t(`${state}.name`) })}
                size="xs"
                variant="ghost"
              >
                <RotateCcwIcon size="1em" />
              </IconButton>
            ) : null}
            <IconButton
              aria-label={t("remove", { name: t(`${state}.name`) })}
              size="xs"
              variant="ghost"
            >
              <XIcon size="1em" />
            </IconButton>
          </Attachment.Actions>
        </Attachment.Root>
      ))}
    </Attachment.Group>
  );
}
