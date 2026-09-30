import { type ReactElement } from "react";

import { ColorSwatch } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as ScrollArea from "#scroll-area/index.ts";

const PALETTES = [
  "primary",
  "secondary",
  "accent",
  "neutral",
  "info",
  "success",
  "warning",
  "error",
];

const ROLES = [
  "subtle",
  "muted",
  "emphasized",
  "border",
  "border-hover",
  "solid",
  "solid-hover",
  "fg",
  "contrast",
  "focus-ring",
];

export function Palette(props: ScrollArea.RootProps): ReactElement {
  const { t } = useWords("scroll-area");

  return (
    <ScrollArea.Root inset="xs" maxHeight="xs" scrolls="both" {...props}>
      <ScrollArea.Viewport aria-label={t("palette.label")}>
        <ScrollArea.Content>
          <Stack gap="md">
            {PALETTES.map((palette) => (
              <Stack gap="xs" key={palette}>
                <Text size="sm">{t(`palette.names.${palette}`)}</Text>
                <Stack direction="row" gap="xs">
                  {ROLES.map((role) => (
                    <ColorSwatch key={role} size="2xl" value={`var(--colors-${palette}-${role})`} />
                  ))}
                </Stack>
              </Stack>
            ))}
          </Stack>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
      <ScrollArea.Scrollbar orientation="horizontal" />
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
}
