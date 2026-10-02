import { type ReactElement } from "react";

import { CheckIcon, CircleDashedIcon, LoaderIcon, TriangleAlertIcon, XIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { type MatrixCell, StatusMatrix } from "#status-matrix/index.ts";

const SERVICES = [
  { group: "platform", id: "auth" },
  { group: "platform", id: "billing" },
  { group: "streaming", id: "media" },
] as const;

const REGIONS = ["EU", "US", "APAC"] as const;

const CELLS: readonly MatrixCell[] = [
  { column: "EU", row: "auth", state: "fine" },
  { column: "US", row: "auth", state: "fine" },
  { column: "EU", row: "billing", state: "slow" },
  { column: "US", row: "billing", state: "down" },
  { column: "EU", row: "media", state: "rolling" },
  { column: "US", row: "media", state: "fine" },
];

export function Gapped(): ReactElement {
  const { t } = useWords("status-matrix");

  return (
    <StatusMatrix
      caption={t("rollout")}
      cells={CELLS}
      columns={REGIONS.map((region) => ({ id: region, label: region }))}
      corner={t("corner")}
      legend={t("legend")}
      rollup={t("worst")}
      rows={SERVICES.map(({ group, id }) => ({ group: t(group), id, label: id }))}
      rules="all"
      states={{
        down: { label: t("down"), mark: <XIcon />, tone: "error" },
        fine: { label: t("fine"), mark: <CheckIcon />, tone: "success" },
        rolling: { label: t("rolling"), mark: <LoaderIcon />, tone: "info" },
        slow: { label: t("slow"), mark: <TriangleAlertIcon />, tone: "warning" },
      }}
      unmeasured={{ label: t("unmeasured"), mark: <CircleDashedIcon />, tone: "neutral" }}
      variant="surface"
    />
  );
}
