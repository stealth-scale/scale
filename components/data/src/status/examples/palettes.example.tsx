import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Status from "#status/index.ts";

const PALETTES = [
  "primary",
  "secondary",
  "accent",
  "neutral",
  "info",
  "success",
  "warning",
  "error",
] as const;

export function Palettes(): ReactElement {
  const { t } = useWords("status");

  return (
    <Stack direction="row" gap="md" wrap>
      {PALETTES.map((palette) => (
        <Status.Root key={palette} palette={palette}>
          <Status.Indicator />
          {t(`states.${palette}`)}
        </Status.Root>
      ))}
    </Stack>
  );
}
