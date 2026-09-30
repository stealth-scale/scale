import { type ReactElement } from "react";

import { FileSpreadsheetIcon, FolderUpIcon, XIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as FileUpload from "#file-upload/index.ts";

export function Folder(): ReactElement {
  const { t } = useWords("file-upload");

  return (
    <FileUpload.Root accept=".csv" directory maxFiles={50}>
      <FileUpload.Label>{t("folder.label")}</FileUpload.Label>
      <FileUpload.Trigger variant="outline">
        <FolderUpIcon />
        {t("folder.choose")}
      </FileUpload.Trigger>
      <FileUpload.ItemGroup>
        <FileUpload.Items>
          {(file) => (
            <FileUpload.Item file={file}>
              <FileUpload.ItemPreview>
                <FileSpreadsheetIcon />
              </FileUpload.ItemPreview>
              <FileUpload.ItemContent>
                <FileUpload.ItemName>
                  {file.webkitRelativePath === "" ? file.name : file.webkitRelativePath}
                </FileUpload.ItemName>
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
