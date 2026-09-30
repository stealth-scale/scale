import { type ReactElement, useState } from "react";

import { CircleAlertIcon, FileTextIcon, UploadIcon, XIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Group, Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as FileUpload from "#file-upload/index.ts";

export function Evidence(): ReactElement {
  const { t } = useWords("file-upload");
  const [files, setFiles] = useState<File[]>([]);
  const [tried, setTried] = useState(false);

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setTried(true);
      }}
    >
      <Stack gap="lg">
        <Field.Root invalid={tried && files.length === 0} required>
          <Field.Label>{t("evidence.label")}</Field.Label>
          <FileUpload.Root
            accept={["image/*", "application/pdf"]}
            maxFiles={3}
            name="evidence"
            onFileAccept={({ files: accepted }) => {
              setFiles(accepted);
            }}
          >
            <FileUpload.Dropzone>
              <UploadIcon />
              {t("evidence.drop")}
            </FileUpload.Dropzone>
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
          <Field.HelperText>{t("evidence.hint")}</Field.HelperText>
          <Field.ErrorText>
            <CircleAlertIcon />
            {t("evidence.needed")}
          </Field.ErrorText>
        </Field.Root>
        <Group>
          <Button type="submit">{t("evidence.submit")}</Button>
        </Group>
      </Stack>
    </form>
  );
}
