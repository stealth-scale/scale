import { type ReactElement } from "react";

import { DownloadIcon, ZapIcon } from "lucide-react";

import { Group } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as QrCode from "#qr-code/index.ts";

export function Download(): ReactElement {
  const { t } = useWords("qr-code");

  return (
    <QrCode.Root palette="primary" size="lg" value="https://stealthscale.io/pricing">
      <QrCode.Frame label={t("download.label")}>
        <QrCode.Pattern />
      </QrCode.Frame>
      <QrCode.Overlay>
        <ZapIcon />
      </QrCode.Overlay>
      <Group>
        <QrCode.DownloadTrigger fileName="pricing.png" size="sm" variant="outline">
          <DownloadIcon />
          {t("download.png")}
        </QrCode.DownloadTrigger>
        <QrCode.DownloadTrigger
          fileName="pricing.svg"
          mimeType="image/svg+xml"
          size="sm"
          variant="outline"
        >
          <DownloadIcon />
          {t("download.svg")}
        </QrCode.DownloadTrigger>
      </Group>
    </QrCode.Root>
  );
}
