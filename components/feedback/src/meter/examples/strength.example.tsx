import { type ReactElement, useState } from "react";

import { Field } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Meter from "#meter/index.ts";

const WORDS = ["none", "weak", "fair", "good", "strong"] as const;

const PALETTES = ["neutral", "error", "warning", "info", "success"] as const;

function scoreOf(password: string): number {
  const classes = [/[a-z]/u, /[A-Z]/u, /\d/u, /[^\dA-Za-z]/u].filter((kind) =>
    kind.test(password),
  ).length;

  return Math.min(
    4,
    Number(password.length >= 8) + Number(password.length >= 12) + (classes > 2 ? 2 : 0),
  );
}

export function Strength(): ReactElement {
  const { t } = useWords("meter");
  const [password, setPassword] = useState("");
  const score = scoreOf(password);
  const words = t(`strength.${WORDS[score] ?? "none"}`);

  return (
    <Stack gap="md">
      <Field.Root>
        <Field.Label>{t("strength.password")}</Field.Label>
        <Field.Control
          autoComplete="new-password"
          onChange={(event) => {
            setPassword(event.currentTarget.value);
          }}
          type="password"
          value={password}
        />
      </Field.Root>
      <Meter.Root max={4} palette={PALETTES[score] ?? "neutral"} value={score}>
        <Meter.Label>{t("strength.label")}</Meter.Label>
        <Meter.ValueText>{words}</Meter.ValueText>
        <Meter.Track aria-valuetext={words}>
          <Meter.Range />
        </Meter.Track>
      </Meter.Root>
    </Stack>
  );
}
