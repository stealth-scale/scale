import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";

import * as Kbd from "#kbd/index.ts";

const KEYS = ["⌘", "⌥", "⇧", "⌃", "↵", "⌫", "↑", "↓", "Tab", "Esc"];

export function Keys(): ReactElement {
  return (
    <Stack direction="row" gap="xs" wrap>
      {KEYS.map((key) => (
        <Kbd.Root key={key}>{key}</Kbd.Root>
      ))}
    </Stack>
  );
}
