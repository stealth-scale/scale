import { type ReactElement } from "react";

import { FlipHorizontal2Icon, RotateCcwIcon, RotateCwIcon, Undo2Icon } from "lucide-react";

import { IconButton } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as ImageCropper from "#image-cropper/index.ts";

import landscape from "./landscape.webp";

export function Cover(): ReactElement {
  const { t } = useWords("image-cropper");
  const cropper = ImageCropper.useImageCropper({ aspectRatio: 16 / 9 });

  return (
    <Stack gap="md">
      <ImageCropper.Root aria-label={t("coverLabel")} cropper={cropper}>
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
      <Stack direction="row" gap="sm">
        <IconButton
          aria-label={t("rotateLeft")}
          onClick={() => {
            cropper.rotateBy(-90);
          }}
          variant="outline"
        >
          <RotateCcwIcon />
        </IconButton>
        <IconButton
          aria-label={t("rotateRight")}
          onClick={() => {
            cropper.rotateBy(90);
          }}
          variant="outline"
        >
          <RotateCwIcon />
        </IconButton>
        <IconButton
          aria-label={t("flip")}
          aria-pressed={cropper.flip.horizontal}
          onClick={() => {
            cropper.flipHorizontally();
          }}
          variant="outline"
        >
          <FlipHorizontal2Icon />
        </IconButton>
        <IconButton
          aria-label={t("reset")}
          onClick={() => {
            cropper.reset();
          }}
          variant="outline"
        >
          <Undo2Icon />
        </IconButton>
      </Stack>
    </Stack>
  );
}
