import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { ChordDiagram } from "#chord-diagram/index.ts";

import { named, SERVICES } from "./calls.ts";

export function Quiet(): ReactElement {
  const { t } = useWords("chord-diagram");

  return (
    <ChordDiagram
      caption={t("quiet.caption")}
      empty={t("quiet.empty")}
      flows={[]}
      label={t("services.label")}
      nodes={named(SERVICES, (key) => t(`names.${key}`))}
    />
  );
}
