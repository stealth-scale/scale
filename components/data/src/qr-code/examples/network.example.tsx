import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Strong, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as QrCode from "#qr-code/index.ts";

const NETWORK = "WIFI:T:WPA;S:Guest;P:quiet-harbour-47;;";

export function Network(): ReactElement {
  const { t } = useWords("qr-code");

  return (
    <Stack direction="row" gap="lg">
      <QrCode.Root size="sm" value={NETWORK}>
        <QrCode.Frame label={t("network.label")}>
          <QrCode.Pattern />
        </QrCode.Frame>
      </QrCode.Root>
      <Stack gap="xs">
        <Strong>{t("network.scan")}</Strong>
        <Text>{t("network.name")}</Text>
      </Stack>
    </Stack>
  );
}
