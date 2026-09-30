import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { ChordDiagram } from "#chord-diagram/index.ts";

import { named, REQUEUED, SERVICES } from "./calls.ts";

export function Internal(): ReactElement {
  const { t } = useWords("chord-diagram");
  const own = REQUEUED.find((flow) => flow.from === flow.to);

  return (
    <ChordDiagram
      caption={t("internal.caption", {
        calls: own?.value,
        name: t(`names.${own?.from ?? ""}`),
      })}
      flows={REQUEUED}
      inflowLabel={t("in")}
      label={t("internal.label")}
      nodes={named(SERVICES, (key) => t(`names.${key}`))}
      outflowLabel={t("out")}
    />
  );
}
