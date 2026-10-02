import { type ReactElement } from "react";

import { DownloadIcon } from "lucide-react";

import { Table } from "@stealthscale/component-collections";
import { useWords } from "@stealthscale/specimen";

import { DownloadTrigger } from "#download-trigger/index.ts";

interface Export {
  readonly data: string;
  readonly fileName: string;
  readonly label: string;
  readonly mimeType: string;
}

const EXPORTS = [
  {
    data: "account,amount\nBridge Ledger,4120.00\nHalden & Co,880.40",
    fileName: "ledger.csv",
    mimeType: "text/csv",
  },
  {
    data: JSON.stringify({ held: 12, raised: 240, settled: 3 }, undefined, 2),
    fileName: "totals.json",
    mimeType: "application/json",
  },
  {
    data: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" rx="10"/></svg>',
    fileName: "mark.svg",
    mimeType: "image/svg+xml",
  },
];

function triggerOf(row: Export): ReactElement {
  return (
    <DownloadTrigger
      aria-label={row.label}
      data={row.data}
      fileName={row.fileName}
      mimeType={row.mimeType}
      shape="square"
      size="sm"
      variant="ghost"
    >
      <DownloadIcon size="1em" />
    </DownloadTrigger>
  );
}

export function Exports(): ReactElement {
  const { i18n, t } = useWords("download-trigger");
  const size = new Intl.NumberFormat(i18n.language, {
    style: "unit",
    unit: "byte",
    unitDisplay: "long",
  });

  return (
    <Table.Simple<Export>
      caption={t("exports")}
      columns={[
        { key: "fileName", label: t("file"), rowHeader: true },
        {
          cell: (row) => size.format(new Blob([row.data]).size),
          key: "size",
          label: t("size"),
          numeric: true,
        },
        { cell: triggerOf, key: "download", label: t("download") },
      ]}
      rows={EXPORTS.map(({ data, fileName, mimeType }) => ({
        data,
        fileName,
        label: t("save", { file: fileName }),
        mimeType,
      }))}
      rowToKey={(row) => row.fileName}
    />
  );
}
