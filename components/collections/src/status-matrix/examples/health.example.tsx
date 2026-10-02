import { type ReactElement } from "react";

import {
  CheckIcon,
  CircleDashedIcon,
  LoaderIcon,
  MinusIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { type MatrixCell, StatusMatrix, type StatusMatrixProps } from "#status-matrix/index.ts";

const SERVICES = [
  { group: "payments", id: "checkout-api" },
  { group: "payments", id: "ledger" },
  { group: "discovery", id: "search-api" },
  { group: "discovery", id: "ranking" },
] as const;

const REGIONS = ["EU", "US", "APAC"] as const;

const CELLS: readonly MatrixCell[] = [
  { column: "EU", row: "checkout-api", state: "fine" },
  { column: "US", row: "checkout-api", state: "down" },
  { column: "APAC", row: "checkout-api", state: "slow" },
  { column: "EU", row: "ledger", state: "fine" },
  { column: "US", row: "ledger", state: "fine" },
  { column: "APAC", row: "ledger", state: "fine" },
  { column: "EU", row: "search-api", state: "fine" },
  { column: "US", row: "search-api", state: "rolling" },
  { column: "APAC", row: "search-api", state: "fine" },
  { column: "EU", row: "ranking", state: "slow" },
  { column: "US", row: "ranking", state: "fine" },
  { column: "APAC", row: "ranking", state: "skipped" },
];

export function Health(
  props: Omit<StatusMatrixProps, "cells" | "columns" | "rows" | "states" | "unmeasured">,
): ReactElement {
  const { t } = useWords("status-matrix");

  return (
    <StatusMatrix
      caption={t("caption")}
      cellLabel={(state, row, column) =>
        t("crossing", { column: column.id, row: row.id, state: state.label })
      }
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
        skipped: { label: t("skipped"), mark: <MinusIcon />, tone: "neutral" },
        slow: { label: t("slow"), mark: <TriangleAlertIcon />, tone: "warning" },
      }}
      unmeasured={{ label: t("unmeasured"), mark: <CircleDashedIcon />, tone: "neutral" }}
      variant="surface"
      {...props}
    />
  );
}
