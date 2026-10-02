import { type ReactElement, useState } from "react";
import { createPortal } from "react-dom";

import { CircleAlertIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as ColorPicker from "#color-picker/index.ts";
import * as Field from "#field/index.ts";

const LINEAR = ["red", "green", "blue"] as const;

function contrast(color: ColorPicker.Color): number {
  const rgb = color.toFormat("rgba");
  const [red = 0, green = 0, blue = 0] = LINEAR.map((channel) => {
    const value = rgb.getChannelValue(channel) / 255;

    return value <= 0.039_28 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 1.05 / (0.2126 * red + 0.7152 * green + 0.0722 * blue + 0.05);
}

export function Primary(): ReactElement {
  const { t } = useWords("color-picker");
  const [color, setColor] = useState(() => ColorPicker.parseColor("#FACC15"));
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState("");
  const ratio = contrast(color);

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setTried(true);

        const submitted = new FormData(event.currentTarget).get("primary");

        setSent(typeof submitted === "string" && ratio >= 4.5 ? submitted : "");
      }}
    >
      <Stack align="flex-start" gap="lg">
        <Field.Root invalid={tried && ratio < 4.5}>
          <Field.Label>{t("primary.label")}</Field.Label>
          <ColorPicker.Root
            name="primary"
            onValueChange={({ value }) => {
              setColor(value);
            }}
            value={color}
          >
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
          <Field.HelperText>{t("primary.help", { ratio: ratio.toFixed(1) })}</Field.HelperText>
          <Field.ErrorText>
            <CircleAlertIcon />
            {t("primary.low")}
          </Field.ErrorText>
        </Field.Root>
        <Button type="submit">{t("primary.submit")}</Button>
        <Text as="output">{sent === "" ? null : t("primary.sent", { color: sent })}</Text>
      </Stack>
    </form>
  );
}
