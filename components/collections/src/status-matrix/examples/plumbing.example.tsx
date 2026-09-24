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

import { type MatrixCell, StatusMatrix } from "#status-matrix/index.ts";

const SERVICES = ["cdn", "dns", "mail", "object-store"] as const;

const SITES = ["Dublin", "Reston", "Osaka"] as const;

const CELLS: readonly MatrixCell[] = [
  { column: "Dublin", row: "cdn", state: "fine" },
  { column: "Reston", row: "cdn", state: "fine" },
  { column: "Osaka", row: "cdn", state: "slow" },
  { column: "Dublin", row: "dns", state: "fine" },
  { column: "Reston", row: "dns", state: "fine" },
  { column: "Osaka", row: "dns", state: "fine" },
  { column: "Dublin", row: "mail", state: "skipped" },
  { column: "Reston", row: "mail", state: "rolling" },
  { column: "Osaka", row: "mail", state: "skipped" },
  { column: "Dublin", row: "object-store", state: "down" },
  { column: "Reston", row: "object-store", state: "fine" },
  { column: "Osaka", row: "object-store", state: "fine" },
];

export function Plumbing(): ReactElement {
  const { t } = useWords("status-matrix");

  return (
    <StatusMatrix
      caption={t("shared")}
      cells={CELLS}
      columns={SITES.map((site) => ({ id: site, label: site }))}
      corner={t("corner")}
      rollup={t("worst")}
      rows={SERVICES.map((id) => ({ id, label: id }))}
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
    />
  );
}
