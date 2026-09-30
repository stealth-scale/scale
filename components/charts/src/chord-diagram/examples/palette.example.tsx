import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { ChordDiagram } from "#chord-diagram/index.ts";

import { CALLS, named, SERVICES } from "./calls.ts";

export function Palette(): ReactElement {
  const { t } = useWords("chord-diagram");

  return (
    <ChordDiagram
      caption={t("palette.caption")}
      flows={CALLS}
      inflowLabel={t("in")}
      label={t("services.label")}
      nodes={named(SERVICES, (key) => t(`names.${key}`), {
        api: "teal",
        auth: "purple",
        billing: "orange",
        search: "pink",
      })}
      outflowLabel={t("out")}
    />
  );
}
