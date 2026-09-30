import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { ChordDiagram } from "#chord-diagram/index.ts";

import { CALLS, named, SERVICES } from "./calls.ts";

export function Pair(): ReactElement {
  const { t } = useWords("chord-diagram");
  const there = CALLS.find((flow) => flow.from === "api" && flow.to === "auth")?.value;
  const back = CALLS.find((flow) => flow.from === "auth" && flow.to === "api")?.value;

  return (
    <ChordDiagram
      caption={t("pair.caption", { back, there })}
      defaultIndex={1}
      flows={CALLS}
      inflowLabel={t("in")}
      label={t("services.label")}
      nodes={named(SERVICES, (key) => t(`names.${key}`))}
      outflowLabel={t("out")}
    />
  );
}
