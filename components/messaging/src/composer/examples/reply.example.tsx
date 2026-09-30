import { type ReactElement, useId, useState } from "react";

import { ArrowUpIcon, FileIcon, PaperclipIcon, ReplyIcon, XIcon } from "lucide-react";

import { IconButton } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { Span, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Attachment from "#attachment/index.ts";
import * as Composer from "#composer/index.ts";

function filed(
  files: readonly File[],
  label: string,
  named: (file: string) => string,
  removed: (file: File) => void,
): ReactElement {
  return (
    <Composer.Attachments>
      <Attachment.Group aria-label={label} orientation="vertical" size="xs">
        {files.map((file) => (
          <Attachment.Root key={`${file.name}-${String(file.lastModified)}`}>
            <Attachment.Media>
              <FileIcon aria-hidden />
            </Attachment.Media>
            <Attachment.Content>
              <Attachment.Title>{file.name}</Attachment.Title>
            </Attachment.Content>
            <Attachment.Actions>
              <IconButton
                aria-label={named(file.name)}
                onClick={() => {
                  removed(file);
                }}
                size="xs"
                variant="ghost"
              >
                <XIcon size="1em" />
              </IconButton>
            </Attachment.Actions>
          </Attachment.Root>
        ))}
      </Attachment.Group>
    </Composer.Attachments>
  );
}

function strip(replying: string, cancel: string, cancelled: () => void): ReactElement {
  return (
    <Composer.Context>
      <ReplyIcon aria-hidden />
      <Span>{replying}</Span>
      <IconButton aria-label={cancel} onClick={cancelled} size="xs" variant="ghost">
        <XIcon size="1em" />
      </IconButton>
    </Composer.Context>
  );
}

export function Reply(): ReactElement {
  const { t } = useWords("composer");
  const text = useId();
  const [replying, setReplying] = useState(true);
  const [files, setFiles] = useState<readonly File[]>([]);
  const [sent, setSent] = useState("");
  const focused = (): void => {
    document.querySelector<HTMLElement>(`[id="${text}"]`)?.focus();
  };

  return (
    <Stack gap="sm">
      <Composer.Root
        attached={files.length > 0}
        onAttach={(picked) => {
          setFiles((was) => [...was, ...picked]);
        }}
        onCancelContext={() => {
          setReplying(false);
        }}
        onSubmit={(typed) => {
          setSent(t("sent", { count: files.length, text: typed }));
          setFiles([]);
          setReplying(false);
        }}
      >
        {replying
          ? strip(t("replying"), t("cancelReply"), () => {
              setReplying(false);
              focused();
            })
          : null}
        {files.length === 0
          ? null
          : filed(
              files,
              t("files"),
              (name) => t("remove", { name }),
              (file) => {
                setFiles((was) => was.filter((one) => one !== file));
                focused();
              },
            )}
        <Composer.Input id={text} label={t("label")} placeholder={t("replyPlaceholder")} />
        <Composer.Toolbar>
          <Composer.AttachTrigger label={t("attach")}>
            <PaperclipIcon size="1em" />
          </Composer.AttachTrigger>
          <Composer.Submit label={t("send")}>
            <ArrowUpIcon size="1em" />
          </Composer.Submit>
        </Composer.Toolbar>
      </Composer.Root>
      <Text as="output" size="sm">
        {sent}
      </Text>
    </Stack>
  );
}
