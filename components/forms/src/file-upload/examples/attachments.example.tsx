import { type ReactElement, useState } from "react";

import { CircleAlertIcon, FileTextIcon, PaperclipIcon, XIcon } from "lucide-react";

import { Group } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as FileUpload from "#file-upload/index.ts";

const LIMIT = 25_000_000;

function total(files: readonly File[]): number {
  return files.reduce((sum, file) => sum + file.size, 0);
}

export function Attachments(): ReactElement {
  const { t } = useWords("file-upload");
  const [files, setFiles] = useState<File[]>([]);
  const [refused, setRefused] = useState(0);

  return (
    <Field.Root invalid={refused > 0}>
      <Field.Label>{t("attachments.label")}</Field.Label>
      <FileUpload.Root
        acceptedFiles={files}
        maxFiles={10}
        onFileAccept={({ files: accepted }) => {
          setFiles(accepted);
        }}
        onFileReject={({ files: rejections }) => {
          setRefused(rejections.length);
        }}
        validate={(file, { acceptedFiles }) =>
          total(acceptedFiles) + file.size > LIMIT ? ["TOTAL_TOO_LARGE"] : null
        }
      >
        <Group>
          <FileUpload.Trigger variant="outline">
            <PaperclipIcon />
            {t("attachments.attach")}
          </FileUpload.Trigger>
          <FileUpload.ClearTrigger variant="ghost">
            {t("attachments.clear")}
          </FileUpload.ClearTrigger>
        </Group>
        <FileUpload.ItemGroup>
          <FileUpload.Items>
            {(file) => (
              <FileUpload.Item file={file}>
                <FileUpload.ItemPreview>
                  <FileTextIcon />
                </FileUpload.ItemPreview>
                <FileUpload.ItemContent>
                  <FileUpload.ItemName />
                  <FileUpload.ItemSizeText />
                </FileUpload.ItemContent>
                <FileUpload.ItemDeleteTrigger label={t("remove", { name: file.name })}>
                  <XIcon />
                </FileUpload.ItemDeleteTrigger>
              </FileUpload.Item>
            )}
          </FileUpload.Items>
        </FileUpload.ItemGroup>
      </FileUpload.Root>
      <Field.HelperText>
        {t("attachments.used", { count: files.length, size: total(files) / 1_000_000 })}
      </Field.HelperText>
      <Field.ErrorText>
        <CircleAlertIcon />
        {t("attachments.over", { count: refused })}
      </Field.ErrorText>
    </Field.Root>
  );
}
