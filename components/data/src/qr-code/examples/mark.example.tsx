import { type ReactElement } from "react";

import { ZapIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as QrCode from "#qr-code/index.ts";

export function Mark(): ReactElement {
  const { t } = useWords("qr-code");

  return (
    <QrCode.Root size="lg" value="https://stealthscale.io">
      <QrCode.Frame label={t("mark.label")}>
        <QrCode.Pattern />
      </QrCode.Frame>
      <QrCode.Overlay>
        <ZapIcon />
      </QrCode.Overlay>
    </QrCode.Root>
  );
}
