import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import { ChevronDownIcon } from "lucide-react";

import { Menu } from "@stealthscale/component-disclosure";
import { useWords } from "@stealthscale/specimen";

import { Button } from "#button/index.ts";
import { download } from "#download-trigger/index.ts";

const ACCOUNTS = [
  { account: "Bridge Ledger", amount: 4120 },
  { account: "Halden & Co", amount: 880.4 },
];

const FORMATS = [
  {
    data: ["account,amount", ...ACCOUNTS.map((row) => `${row.account},${row.amount}`)].join("\n"),
    fileName: "ledger.csv",
    key: "csv",
    mimeType: "text/csv",
  },
  {
    data: JSON.stringify(ACCOUNTS, undefined, 2),
    fileName: "ledger.json",
    key: "json",
    mimeType: "application/json",
  },
  {
    data: ["| Account | Amount |", "| --- | --- |"]
      .concat(ACCOUNTS.map((row) => `| ${row.account} | ${row.amount} |`))
      .join("\n"),
    fileName: "ledger.md",
    key: "markdown",
    mimeType: "text/markdown",
  },
] as const;

export function Formats(): ReactElement {
  const { t } = useWords("download-trigger");

  return (
    <Menu.Root
      onSelect={({ value }) => {
        const format = FORMATS.find((each) => each.key === value);

        if (format !== undefined) void download(format);
      }}
    >
      <Menu.Trigger as={Button}>
        {t("export")}
        <Menu.Indicator>
          <ChevronDownIcon size="1em" />
        </Menu.Indicator>
      </Menu.Trigger>
      {createPortal(
        <Menu.Positioner>
          <Menu.Content>
            {FORMATS.map((format) => (
              <Menu.Item key={format.key} value={format.key}>
                {t(`formats.${format.key}`)}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>,
        document.body,
      )}
    </Menu.Root>
  );
}
