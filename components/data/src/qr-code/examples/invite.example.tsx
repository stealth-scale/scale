import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as QrCode from "#qr-code/index.ts";

export function Invite(props: QrCode.RootProps): ReactElement {
  const { t } = useWords("qr-code");

  return (
    <QrCode.Root value="https://stealthscale.io/join/7fK2mQ" {...props}>
      <QrCode.Frame label={t("invite.label")}>
        <QrCode.Pattern />
      </QrCode.Frame>
    </QrCode.Root>
  );
}
