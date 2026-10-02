import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { Video } from "#video/index.ts";

import clip from "./clip.webm";
import poster from "./poster.webp";

export function Tour(): ReactElement {
  const { t } = useWords("video");

  return (
    <Stack as="figure" gap="sm">
      <Video controls poster={poster} preload="metadata" src={clip} />
      <Text as="figcaption" size="sm" tone="muted">
        {t("tourCaption")}
      </Text>
    </Stack>
  );
}
