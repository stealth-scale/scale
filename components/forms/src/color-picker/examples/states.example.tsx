import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as ColorPicker from "#color-picker/index.ts";

const STATES = ["disabled", "readOnly", "invalid"] as const;

export function States(): ReactElement {
  const { t } = useWords("color-picker");

  return (
    <Stack gap="md">
      {STATES.map((state) => (
        <ColorPicker.Root
          defaultValue="#DB2777"
          disabled={state === "disabled"}
          invalid={state === "invalid"}
          key={state}
          readOnly={state === "readOnly"}
        >
          <ColorPicker.Label>{t(`states.${state}`)}</ColorPicker.Label>
          <ColorPicker.Control>
            <ColorPicker.ChannelInput channel="hex" />
            <ColorPicker.Trigger>
              <ColorPicker.ValueSwatch />
            </ColorPicker.Trigger>
          </ColorPicker.Control>
          {createPortal(
            <ColorPicker.Positioner>
              <ColorPicker.Content>
                <ColorPicker.Area>
                  <ColorPicker.AreaBackground />
                  <ColorPicker.AreaThumb />
                </ColorPicker.Area>
              </ColorPicker.Content>
            </ColorPicker.Positioner>,
            document.body,
          )}
        </ColorPicker.Root>
      ))}
    </Stack>
  );
}
