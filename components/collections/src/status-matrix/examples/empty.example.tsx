import { type ReactElement } from "react";

import { CheckIcon, CircleDashedIcon, XIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { StatusMatrix } from "#status-matrix/index.ts";

const SITES = ["Dublin", "Reston", "Osaka"] as const;

export function Empty(): ReactElement {
  const { t } = useWords("status-matrix");

  return (
    <StatusMatrix
      caption={t("checks")}
      cells={[]}
      columns={SITES.map((site) => ({ id: site, label: site }))}
      corner={t("corner")}
      empty={t("nothing")}
      rollup={t("worst")}
      rows={[]}
      rules="all"
      states={{
        down: { label: t("down"), mark: <XIcon />, tone: "error" },
        fine: { label: t("fine"), mark: <CheckIcon />, tone: "success" },
      }}
      unmeasured={{ label: t("unmeasured"), mark: <CircleDashedIcon />, tone: "neutral" }}
      variant="surface"
    />
  );
}
