import { type ReactElement } from "react";

import { ColorSwatch } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Meter from "#meter/index.ts";

const SIZE = 256;

const PARTS = [
  { key: "photos", value: 88.2 },
  { key: "apps", value: 41.5 },
  { key: "system", value: 18.3 },
  { key: "other", value: 9.6 },
] as const;

const USED = PARTS.reduce((sum, part) => sum + part.value, 0);

export function Capacity(): ReactElement {
  const { t } = useWords("meter");
  const words = t("capacity.value", { size: SIZE, used: USED });

  return (
    <Stack gap="sm">
      <Meter.Root max={SIZE} value={USED}>
        <Meter.Label>{t("capacity.label")}</Meter.Label>
        <Meter.ValueText>{words}</Meter.ValueText>
        <Meter.Track aria-valuetext={words}>
          {PARTS.map(({ key, value }) => (
            <Meter.Segment key={key} value={value} />
          ))}
        </Meter.Track>
      </Meter.Root>
      <Stack direction="row" gap="md" wrap>
        {PARTS.map(({ key, value }, at) => (
          <Text as="span" key={key} size="xs">
            <ColorSwatch
              aria-hidden
              shape="circle"
              size="inherit"
              value={`var(--colors-series-${String(at + 1)})`}
            />{" "}
            {t(`capacity.${key}`, { value })}
          </Text>
        ))}
      </Stack>
    </Stack>
  );
}
