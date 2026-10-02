import { type ReactElement } from "react";

import { CameraIcon, XIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as FileUpload from "#file-upload/index.ts";

export function Photo(): ReactElement {
  const { t } = useWords("file-upload");

  return (
    <FileUpload.Root accept="image/*" capture="user" size="sm">
      <FileUpload.Label>{t("photo.label")}</FileUpload.Label>
      <FileUpload.Dropzone>
        <CameraIcon />
        {t("photo.drop")}
      </FileUpload.Dropzone>
      <FileUpload.ItemGroup>
        <FileUpload.Items>
          {(file) => (
            <FileUpload.Item file={file}>
              <FileUpload.ItemPreview>
                <FileUpload.ItemPreviewImage />
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
