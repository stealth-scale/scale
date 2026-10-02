import { type ReactElement, useState } from "react";

import { CheckIcon, CircleDashedIcon, TriangleAlertIcon, XIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { type MatrixCell, type MatrixState, StatusMatrix } from "#status-matrix/index.ts";

const QUEUES = ["notifications", "webhooks"] as const;

const SITES = ["Dublin", "Reston", "Osaka"] as const;

const CELLS: readonly MatrixCell[] = [
  { column: "Dublin", row: "notifications", state: "fine" },
  { column: "Reston", row: "notifications", state: "slow" },
  { column: "Osaka", row: "notifications", state: "fine" },
  { column: "Dublin", row: "webhooks", state: "down" },
  { column: "Reston", row: "webhooks", state: "fine" },
];

export function Queues(): ReactElement {
  const { t } = useWords("status-matrix");
  const [picked, setPicked] = useState<string | undefined>();
  const states: Readonly<Record<string, MatrixState>> = {
    down: { label: t("down"), mark: <XIcon />, tone: "error" },
    fine: { label: t("fine"), mark: <CheckIcon />, tone: "success" },
    slow: { label: t("slow"), mark: <TriangleAlertIcon />, tone: "warning" },
  };
  const unmeasured: MatrixState = {
    label: t("unmeasured"),
    mark: <CircleDashedIcon />,
    tone: "neutral",
  };

  return (
    <Stack gap="md">
      <StatusMatrix
        caption={t("queues")}
        cellLabel={(state, row, column) =>
          t("crossing", { column: column.id, row: row.id, state: state.label })
        }
        cells={CELLS}
        columns={SITES.map((site) => ({ id: site, label: site }))}
        corner={t("queue")}
        onSelectCell={(row, column, cell) => {
          const state = (cell === undefined ? undefined : states[cell.state]) ?? unmeasured;
          const said = t("picked", { column, row, state: state.label });

          setPicked((was) => (was === said ? undefined : said));
        }}
        rows={QUEUES.map((id) => ({ id, label: id }))}
        rules="all"
        states={states}
        unmeasured={unmeasured}
        variant="surface"
      />
      <Text aria-live="polite">{picked ?? t("nothingYet")}</Text>
    </Stack>
  );
}
