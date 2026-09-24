import { type ReactElement, type ReactNode, useState } from "react";

import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Table from "#table/index.ts";

interface Account {
  readonly amount: string;
  readonly key: string;
  readonly name: string;
  readonly value: number;
}

type Direction = "ascending" | "descending";

interface Sort {
  readonly direction: Direction;
  readonly key: string;
}

const ACCOUNTS = [
  { amount: "4,120.00", key: "bridge", value: 4120 },
  { amount: "880.40", key: "halden", value: 880.4 },
  { amount: "12,500.00", key: "perrin", value: 12_500 },
] as const;

const MARKS = { ascending: ArrowUpIcon, descending: ArrowDownIcon };

function headed(text: string, direction: Direction | undefined): ReactNode {
  const Mark = direction === undefined ? ArrowUpDownIcon : MARKS[direction];

  return (
    <>
      {text}
      <Mark aria-hidden size="1em" />
    </>
  );
}

function compared(sort: Sort): (left: Account, right: Account) => number {
  const sign = sort.direction === "ascending" ? 1 : -1;

  return (left, right) =>
    sign * (sort.key === "amount" ? left.value - right.value : left.name.localeCompare(right.name));
}

export function Sortable(): ReactElement {
  const { t } = useWords("table");
  const [sort, setSort] = useState<Sort>({ direction: "descending", key: "amount" });
  const directionOf = (key: string): Direction | undefined =>
    sort.key === key ? sort.direction : undefined;

  return (
    <Table.Simple<Account>
      caption={t("caption")}
      columns={[
        {
          key: "name",
          label: headed(t("account"), directionOf("name")),
          rowHeader: true,
          sorted: directionOf("name"),
          sortLabel: t("sortByAccount"),
        },
        {
          key: "amount",
          label: headed(t("amount"), directionOf("amount")),
          numeric: true,
          sorted: directionOf("amount"),
          sortLabel: t("sortByAmount"),
        },
      ]}
      onSort={(key) => {
        setSort((was) => ({
          direction: was.key === key && was.direction === "ascending" ? "descending" : "ascending",
          key,
        }));
      }}
      rows={ACCOUNTS.map(({ amount, key, value }) => ({
        amount,
        key,
        name: t(key),
        value,
      })).toSorted(compared(sort))}
      rowToKey={(row) => row.key}
      variant="surface"
    />
  );
}
