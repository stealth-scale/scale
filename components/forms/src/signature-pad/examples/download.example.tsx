import { type ReactElement, useState } from "react";

import { DownloadIcon, EraserIcon } from "lucide-react";

import { DownloadTrigger } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as SignaturePad from "#signature-pad/index.ts";

async function blobOf(url: string): Promise<Blob> {
  const response = await fetch(url);

  return response.blob();
}

export function Download(): ReactElement {
  const { t } = useWords("signature-pad");
  const [image, setImage] = useState("");

  return (
    <Stack align="flex-start" gap="md">
      <SignaturePad.Root
        onDrawEnd={(details) => {
          void details.getDataUrl("image/png").then(setImage);
        }}
      >
        <SignaturePad.Label>{t("signature")}</SignaturePad.Label>
        <SignaturePad.Control>
          <SignaturePad.Segment />
          <SignaturePad.Guide />
          <SignaturePad.ClearTrigger label={t("clear")}>
            <EraserIcon />
          </SignaturePad.ClearTrigger>
        </SignaturePad.Control>
      </SignaturePad.Root>
      <DownloadTrigger
        data={() => blobOf(image)}
        disabled={image === ""}
        fileName="signature.png"
        mimeType="image/png"
        variant="outline"
      >
        <DownloadIcon size="1em" />
        {t("save")}
      </DownloadTrigger>
    </Stack>
  );
}
