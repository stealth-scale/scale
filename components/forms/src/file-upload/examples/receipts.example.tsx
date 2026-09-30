import { type ReactElement } from "react";

import { FileTextIcon, UploadIcon, XIcon } from "lucide-react";

import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as FileUpload from "#file-upload/index.ts";

const MEGABYTE = 1_000_000;

export function Receipts(props: FileUpload.RootProps): ReactElement {
  const { t } = useWords("file-upload");

  return (
    <FileUpload.Root
      accept={["image/png", "image/jpeg", "image/webp", "application/pdf"]}
      maxFiles={5}
      maxFileSize={5 * MEGABYTE}
      {...props}
    >
      <FileUpload.Label>{t("receipts.label")}</FileUpload.Label>
      <FileUpload.Dropzone>
        <UploadIcon />
        {t("receipts.drop")}
        <Text as="span" size="sm" tone="muted">
          {t("receipts.hint")}
        </Text>
      </FileUpload.Dropzone>
      <FileUpload.ItemGroup>
        <FileUpload.Items>
          {(file) => (
            <FileUpload.Item file={file}>
              <FileUpload.ItemPreview>
                {file.type.startsWith("image/") ? (
                  <FileUpload.ItemPreviewImage />
                ) : (
                  <FileTextIcon />
                )}
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
  );
}
