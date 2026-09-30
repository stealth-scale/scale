import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as ImageCropper from "#image-cropper/index.ts";

import landscape from "./landscape.webp";

export function Banner(): ReactElement {
  const { t } = useWords("image-cropper");
  const cropper = ImageCropper.useImageCropper({
    aspectRatio: 3,
    defaultZoom: 1.5,
    fixedCropArea: true,
  });

  return (
    <ImageCropper.Root aria-label={t("bannerLabel")} cropper={cropper}>
      <ImageCropper.Viewport>
        <ImageCropper.Image src={landscape} />
        <ImageCropper.Selection aria-description={t("bannerInstructions")}>
          <ImageCropper.Grid axis="horizontal" />
          <ImageCropper.Grid axis="vertical" />
        </ImageCropper.Selection>
      </ImageCropper.Viewport>
    </ImageCropper.Root>
  );
}
