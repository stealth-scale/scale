import { type ReactElement } from "react";

import { CheckIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as ColorPicker from "#color-picker/index.ts";

const LABELS = [
  { name: "slate", value: "#475569" },
  { name: "red", value: "#DC2626" },
  { name: "orange", value: "#EA580C" },
  { name: "amber", value: "#D97706" },
  { name: "green", value: "#16A34A" },
  { name: "teal", value: "#0D9488" },
  { name: "blue", value: "#2563EB" },
  { name: "violet", value: "#7C3AED" },
  { name: "pink", value: "#DB2777" },
] as const;

export function Labels(): ReactElement {
  const { t } = useWords("color-picker");

  return (
    <ColorPicker.Root defaultValue="#16A34A">
      <ColorPicker.Label>{t("labels.label")}</ColorPicker.Label>
      <ColorPicker.SwatchGroup>
        {LABELS.map(({ name, value }) => (
          <ColorPicker.SwatchTrigger key={name} label={t(`colors.${name}`)} value={value}>
            <ColorPicker.Swatch />
            <ColorPicker.SwatchIndicator>
              <CheckIcon />
            </ColorPicker.SwatchIndicator>
          </ColorPicker.SwatchTrigger>
        ))}
      </ColorPicker.SwatchGroup>
    </ColorPicker.Root>
  );
}
