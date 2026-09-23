import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Kbd from "#kbd/index.ts";
import { Text } from "#text/index.ts";

const SHORTCUTS = [
  { command: "palette", keys: ["⌘", "K"] },
  { command: "save", keys: ["⌘", "S"] },
  { command: "undo", keys: ["⌘", "Z"] },
  { command: "redo", keys: ["⇧", "⌘", "Z"] },
] as const;

export function Shortcuts(): ReactElement {
  const { t } = useWords("kbd");

  return (
    <Stack gap="sm">
      {SHORTCUTS.map(({ command, keys }) => (
        <Stack direction="row" justify="between" key={command}>
          <Text size="sm">{t(`commands.${command}`)}</Text>
          <Kbd.Group size="sm">
            {keys.map((key) => (
              <Kbd.Root key={key}>{key}</Kbd.Root>
            ))}
          </Kbd.Group>
        </Stack>
      ))}
    </Stack>
  );
}
