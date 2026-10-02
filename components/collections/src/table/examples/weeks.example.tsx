import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Table from "#table/index.ts";

interface Week {
  readonly week: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"] as const;

const WEEKS = Array.from({ length: 12 }, (_, at) => at + 1);

export function Weeks(
  props: Omit<Table.SimpleProps<Week>, "columns" | "rows" | "rowToKey">,
): ReactElement {
  const { t } = useWords("table");

  return (
    <Table.Simple<Week>
      aria-label={t("caption")}
      columns={[
        { key: "week", label: t("week"), rowHeader: true, width: "7rem" },
        ...MONTHS.map((month) => ({
          cell: () => "17,500.40",
          key: month,
          label: month,
          numeric: true,
          width: "7rem",
        })),
      ]}
      layout="fixed"
      rows={WEEKS.map((week) => ({ week: t("weekAt", { at: String(week) }) }))}
      rowToKey={(row) => row.week}
      style={{ maxBlockSize: "13rem" }}
      variant="surface"
      {...props}
    />
  );
}
