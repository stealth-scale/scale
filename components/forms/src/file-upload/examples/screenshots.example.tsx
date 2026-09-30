import { type ReactElement } from "react";

import { ClipboardPasteIcon, XIcon } from "lucide-react";

import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as FileUpload from "#file-upload/index.ts";

export function Screenshots(): ReactElement {
  const { t } = useWords("file-upload");

  return (
    <FileUpload.Root
      accept="image/*"
      maxFiles={4}
      transformFiles={(files) =>
        Promise.all(
          files.map(async (file) =>
            file.name === "image.png"
              ? new File(
                  [await file.arrayBuffer()],
                  t("screenshots.named", {
                    formatParams: { time: { timeStyle: "medium" } },
                    time: new Date(file.lastModified),
                  }),
                  { type: file.type },
                )
              : file,
          ),
        )
      }
    >
      <FileUpload.Label>{t("screenshots.label")}</FileUpload.Label>
      <FileUpload.Dropzone>
        <ClipboardPasteIcon />
        {t("screenshots.paste")}
        <Text as="span" size="sm" tone="muted">
          {t("screenshots.hint")}
        </Text>
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
