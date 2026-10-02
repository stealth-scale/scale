import { type ReactElement, useState } from "react";

import { DownloadIcon, LoaderCircleIcon } from "lucide-react";

import { Icon } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { DownloadTrigger } from "#download-trigger/index.ts";

const ROWS = 20_000;

export function Compressed(): ReactElement {
  const { t } = useWords("download-trigger");
  const [pending, setPending] = useState(false);

  async function compress(): Promise<Blob> {
    setPending(true);

    try {
      const lines = Array.from({ length: ROWS }, (_, row) => `payout-${row},settled,${row * 7}`);
      const text = new Blob([["payout,state,amount", ...lines].join("\n")]);
      const gzip = text.stream().pipeThrough(new CompressionStream("gzip"));

      return await new Response(gzip, { headers: { "Content-Type": "application/gzip" } }).blob();
    } finally {
      setPending(false);
    }
  }

  return (
    <DownloadTrigger
      aria-disabled={pending}
      data={compress}
      fileName="payouts.csv.gz"
      onClick={(event) => {
        if (pending) event.preventDefault();
      }}
      variant="outline"
    >
      {pending ? (
        <Icon
          aria-hidden={false}
          aria-label={t("compressing")}
          as={LoaderCircleIcon}
          motion="spin"
        />
      ) : (
        <DownloadIcon size="1em" />
      )}
      {t("payouts")}
    </DownloadTrigger>
  );
}
