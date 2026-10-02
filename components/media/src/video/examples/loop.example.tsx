import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { Video } from "#video/index.ts";

import clip from "./clip.webm";
import poster from "./poster.webp";

export function Loop(): ReactElement {
  const { t } = useWords("video");

  return (
    <Stack as="figure" gap="sm">
      <Video autoPlay loop poster={poster} src={clip} />
      <Text as="figcaption" size="sm" tone="muted">
        {t("loopCaption")}
      </Text>
    </Stack>
  );
}
