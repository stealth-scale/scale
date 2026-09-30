import { type ReactElement } from "react";

import { FileTextIcon, FileXIcon, UploadIcon, XIcon } from "lucide-react";

import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as FileUpload from "#file-upload/index.ts";

const MEGABYTE = 1_000_000;

export function Refused(): ReactElement {
  const { t } = useWords("file-upload");
  const reasons: Partial<Record<FileUpload.FileError, string>> = {
    FILE_EXISTS: t("reasons.exists"),
    FILE_INVALID_TYPE: t("reasons.type"),
    FILE_TOO_LARGE: t("reasons.large"),
    TOO_MANY_FILES: t("reasons.many"),
  };

  return (
    <FileUpload.Root accept="application/pdf" maxFiles={3} maxFileSize={2 * MEGABYTE}>
      <FileUpload.Label>{t("refused.label")}</FileUpload.Label>
      <FileUpload.Dropzone>
        <UploadIcon />
        {t("refused.drop")}
        <Text as="span" size="sm" tone="muted">
          {t("refused.hint")}
        </Text>
      </FileUpload.Dropzone>
      {(["accepted", "rejected"] as const).map((type) => (
        <FileUpload.ItemGroup key={type} type={type}>
          <FileUpload.Items>
            {(file, errors) => (
              <FileUpload.Item file={file}>
                <FileUpload.ItemPreview>
                  {type === "accepted" ? <FileTextIcon /> : <FileXIcon />}
                </FileUpload.ItemPreview>
                <FileUpload.ItemContent>
                  <FileUpload.ItemName />
                  <FileUpload.ItemSizeText>
                    {type === "accepted"
                      ? undefined
                      : errors.map((error) => reasons[error]).join(" ")}
                  </FileUpload.ItemSizeText>
                </FileUpload.ItemContent>
                <FileUpload.ItemDeleteTrigger label={t("remove", { name: file.name })}>
                  <XIcon />
                </FileUpload.ItemDeleteTrigger>
              </FileUpload.Item>
            )}
          </FileUpload.Items>
        </FileUpload.ItemGroup>
      ))}
    </FileUpload.Root>
  );
}
