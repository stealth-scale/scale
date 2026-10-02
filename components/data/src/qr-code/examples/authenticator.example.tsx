import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Code, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as QrCode from "#qr-code/index.ts";

const KEY = "JBSWY3DPEHPK3PXP";

const ADDRESS = `otpauth://totp/Stealth%20Scale:ada%40example.com?secret=${KEY}&issuer=Stealth%20Scale`;

export function Authenticator(): ReactElement {
  const { t } = useWords("qr-code");

  return (
    <Stack align="flex-start" gap="md">
      <Text>{t("authenticator.scan")}</Text>
      <QrCode.Root size="lg" value={ADDRESS}>
        <QrCode.Frame label={t("authenticator.label")}>
          <QrCode.Pattern />
        </QrCode.Frame>
      </QrCode.Root>
      <Text>{t("authenticator.manual")}</Text>
      <Code>{KEY}</Code>
    </Stack>
  );
}
