import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as ImageCropper from "#image-cropper/index.ts";

import landscape from "./landscape.webp";

export function Photo(props: Omit<ImageCropper.RootProps, "cropper">): ReactElement {
  const { t } = useWords("image-cropper");
  const cropper = ImageCropper.useImageCropper();

  return (
    <ImageCropper.Root aria-label={t("label")} cropper={cropper} {...props}>
      <ImageCropper.Viewport>
        <ImageCropper.Image src={landscape} />
        <ImageCropper.Selection>
          {ImageCropper.handles.map((position) => (
            <ImageCropper.Handle key={position} position={position} />
          ))}
          <ImageCropper.Grid axis="horizontal" />
          <ImageCropper.Grid axis="vertical" />
        </ImageCropper.Selection>
      </ImageCropper.Viewport>
    </ImageCropper.Root>
  );
}
