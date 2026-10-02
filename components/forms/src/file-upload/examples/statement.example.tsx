import { type ReactElement } from "react";

import { FileTextIcon, UploadIcon, XIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as FileUpload from "#file-upload/index.ts";

export function Statement(props: FileUpload.RootProps): ReactElement {
  const { t } = useWords("file-upload");

  return (
    <FileUpload.Root accept="application/pdf" name="statement" {...props}>
      <FileUpload.Label>{t("statement.label")}</FileUpload.Label>
      <FileUpload.Trigger variant="outline">
        <UploadIcon />
        {t("statement.choose")}
      </FileUpload.Trigger>
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
  );
}
