import { type ReactElement } from "react";

import { DownloadIcon, FileSpreadsheetIcon, XIcon } from "lucide-react";

import { DownloadTrigger, IconButton } from "@stealthscale/component-actions";
import { Spinner } from "@stealthscale/component-feedback";
import { useWords } from "@stealthscale/specimen";

import * as Attachment from "#attachment/index.ts";

import whiteboard from "./whiteboard.webp";

export function Files(props: Attachment.GroupProps): ReactElement {
  const { t } = useWords("attachment");

  return (
    <Attachment.Group aria-label={t("label")} {...props}>
      <Attachment.Root>
        <Attachment.Media>
          <FileSpreadsheetIcon aria-hidden />
        </Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>{t("payouts")}</Attachment.Title>
          <Attachment.Description>{t("payoutsDetail")}</Attachment.Description>
        </Attachment.Content>
        <Attachment.Actions>
          <DownloadTrigger
            aria-label={t("download", { name: t("payouts") })}
            data={t("csv")}
            fileName={t("payouts")}
            mimeType="text/csv"
            shape="square"
            size="xs"
            variant="ghost"
          >
            <DownloadIcon size="1em" />
          </DownloadTrigger>
        </Attachment.Actions>
      </Attachment.Root>
      <Attachment.Root>
        <Attachment.Media>
          <img alt="" src={whiteboard} />
        </Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>{t("whiteboard")}</Attachment.Title>
          <Attachment.Description>{t("whiteboardDetail")}</Attachment.Description>
        </Attachment.Content>
      </Attachment.Root>
      <Attachment.Root state="uploading">
        <Attachment.Media>
          <Spinner aria-hidden size="sm" />
        </Attachment.Media>
        <Attachment.Content>
          <Attachment.Title>{t("contract")}</Attachment.Title>
          <Attachment.Description>{t("progress", { percent: 42 })}</Attachment.Description>
        </Attachment.Content>
        <Attachment.Actions>
          <IconButton aria-label={t("cancel", { name: t("contract") })} size="xs" variant="ghost">
            <XIcon size="1em" />
          </IconButton>
        </Attachment.Actions>
      </Attachment.Root>
    </Attachment.Group>
  );
}
