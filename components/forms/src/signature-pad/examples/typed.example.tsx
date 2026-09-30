import { type ReactElement, useState } from "react";

import { EraserIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as SegmentGroup from "#segment-group/index.ts";
import * as SignaturePad from "#signature-pad/index.ts";

const WAYS = ["draw", "type"] as const;

export function Typed(): ReactElement {
  const { t } = useWords("signature-pad");
  const [way, setWay] = useState<string>("draw");

  return (
    <Stack align="stretch" gap="md">
      <SegmentGroup.Root
        aria-label={t("way")}
        onValueChange={({ value }) => {
          if (value !== null) setWay(value);
        }}
        value={way}
      >
        {WAYS.map((choice) => (
          <SegmentGroup.Item key={choice} value={choice}>
            <SegmentGroup.ItemText>{t(`ways.${choice}`)}</SegmentGroup.ItemText>
          </SegmentGroup.Item>
        ))}
      </SegmentGroup.Root>
      {way === "draw" ? (
        <SignaturePad.Root>
          <SignaturePad.Label>{t("signature")}</SignaturePad.Label>
          <SignaturePad.Control>
            <SignaturePad.Segment />
            <SignaturePad.Guide />
            <SignaturePad.ClearTrigger label={t("clear")}>
              <EraserIcon />
            </SignaturePad.ClearTrigger>
          </SignaturePad.Control>
        </SignaturePad.Root>
      ) : (
        <Field.Root>
          <Field.Label>{t("fullName")}</Field.Label>
          <Field.Control autoComplete="name" />
          <Field.HelperText>{t("typedHelp")}</Field.HelperText>
        </Field.Root>
      )}
    </Stack>
  );
}
