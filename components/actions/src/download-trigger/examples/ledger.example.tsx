import { type ReactElement } from "react";

import { DownloadIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { DownloadTrigger } from "#download-trigger/index.ts";

const LEDGER = [
  "account,state,amount",
  "Bridge Ledger,settled,4120.00",
  "Halden & Co,held,880.40",
  "Perrin Freight,queued,12500.00",
].join("\n");

export function Ledger(): ReactElement {
  const { t } = useWords("download-trigger");

  return (
    <DownloadTrigger data={LEDGER} fileName="ledger.csv" mimeType="text/csv" variant="outline">
      <DownloadIcon size="1em" />
      {t("ledger")}
    </DownloadTrigger>
  );
}
