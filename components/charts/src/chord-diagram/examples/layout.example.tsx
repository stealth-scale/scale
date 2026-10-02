import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { ChordDiagram, chordLayout } from "#chord-diagram/index.ts";

import { CALLS, named, SERVICES } from "./calls.ts";

export function Layout(): ReactElement {
  const { i18n, t } = useWords("chord-diagram");
  const nodes = named(SERVICES, (key) => t(`names.${key}`));
  const { groups } = chordLayout(nodes, CALLS);
  const arcs = groups.reduce((sum, group) => sum + group.endAngle - group.startAngle, 0);
  const [first] = groups;
  const share = new Intl.NumberFormat(i18n.language, { style: "percent" });

  return (
    <ChordDiagram
      caption={t("layout.caption", {
        name: t(`names.${first?.key ?? ""}`),
        share: share.format(((first?.endAngle ?? 0) - (first?.startAngle ?? 0)) / arcs),
      })}
      flows={CALLS}
      inflowLabel={t("in")}
      label={t("services.label")}
      nodes={nodes}
      outflowLabel={t("out")}
    />
  );
}
