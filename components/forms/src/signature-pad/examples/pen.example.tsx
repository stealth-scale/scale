import { type ReactElement } from "react";

import { EraserIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as SignaturePad from "#signature-pad/index.ts";

export function Pen(): ReactElement {
  const { t } = useWords("signature-pad");

  return (
    <SignaturePad.Root drawing={{ simulatePressure: true, size: 4 }} palette="info">
      <SignaturePad.Label>{t("initials")}</SignaturePad.Label>
      <SignaturePad.Control>
        <SignaturePad.Segment />
        <SignaturePad.ClearTrigger label={t("clear")}>
          <EraserIcon />
        </SignaturePad.ClearTrigger>
      </SignaturePad.Control>
    </SignaturePad.Root>
  );
}
