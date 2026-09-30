import { type ReactElement, useState } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as ImageCropper from "#image-cropper/index.ts";

import landscape from "./landscape.webp";

export function Free(): ReactElement {
  const { t } = useWords("image-cropper");
  const [size, setSize] = useState({ height: 0, width: 0 });
  const cropper = ImageCropper.useImageCropper({
    maxHeight: 200,
    minHeight: 80,
    minWidth: 80,
    onCropChange: ({ crop }) => {
      setSize({ height: Math.round(crop.height), width: Math.round(crop.width) });
    },
  });

  return (
    <Stack gap="sm">
      <ImageCropper.Root aria-label={t("label")} cropper={cropper}>
        <ImageCropper.Viewport>
          <ImageCropper.Image src={landscape} />
          <ImageCropper.Selection
            valueText={(crop) => t("valueText", { height: crop.height, width: crop.width })}
          >
            {ImageCropper.handles.map((position) => (
              <ImageCropper.Handle key={position} position={position} />
            ))}
          </ImageCropper.Selection>
        </ImageCropper.Viewport>
      </ImageCropper.Root>
      <Text as="output" size="sm" tone="muted">
        {t("size", size)}
      </Text>
    </Stack>
  );
}
