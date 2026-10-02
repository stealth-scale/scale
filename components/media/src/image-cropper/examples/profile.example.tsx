import { type ReactElement, useState } from "react";

import { ZoomInIcon, ZoomOutIcon } from "lucide-react";

import { Button, IconButton } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Avatar from "#avatar/index.ts";
import * as ImageCropper from "#image-cropper/index.ts";

import landscape from "./landscape.webp";

export function Profile(): ReactElement {
  const { t } = useWords("image-cropper");
  const cropper = ImageCropper.useImageCropper({ aspectRatio: 1, cropShape: "circle" });
  const [picture, setPicture] = useState<string>();

  const save = async (): Promise<void> => {
    const url = await cropper.getCroppedImage({
      maxSize: { height: 256, width: 256 },
      output: "dataUrl",
    });

    if (typeof url === "string") setPicture(url);
  };

  return (
    <Stack gap="md">
      <ImageCropper.Root aria-label={t("profileLabel")} cropper={cropper}>
        <ImageCropper.Viewport>
          <ImageCropper.Image src={landscape} />
          <ImageCropper.Selection>
            {ImageCropper.handles.map((position) => (
              <ImageCropper.Handle key={position} position={position} />
            ))}
          </ImageCropper.Selection>
        </ImageCropper.Viewport>
      </ImageCropper.Root>
      <Stack direction="row" gap="sm">
        <IconButton
          aria-label={t("zoomOut")}
          onClick={() => {
            cropper.zoomBy(-0.25);
          }}
          variant="outline"
        >
          <ZoomOutIcon />
        </IconButton>
        <IconButton
          aria-label={t("zoomIn")}
          onClick={() => {
            cropper.zoomBy(0.25);
          }}
          variant="outline"
        >
          <ZoomInIcon />
        </IconButton>
        <Button
          onClick={() => {
            void save();
          }}
        >
          {t("save")}
        </Button>
        <Avatar.Root name={t("name")} size="lg">
          <Avatar.Fallback />
          {picture === undefined ? null : <Avatar.Image src={picture} />}
        </Avatar.Root>
      </Stack>
    </Stack>
  );
}
