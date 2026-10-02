import { type ReactElement } from "react";

import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { Transfer, type TransferProps } from "#transfer/index.ts";

interface Client {
  readonly id: string;
  readonly name: string;
}

const CLIENTS = ["fathom", "lantern", "pebble", "quartz"] as const;

export function Clients(props: Pick<TransferProps<Client>, "palette" | "size">): ReactElement {
  const { t } = useWords("transfer");

  return (
    <Transfer<Client>
      giveBackLabel={t("giveBack")}
      giveBackMark={<ChevronLeftIcon size="100%" />}
      itemToString={(client) => client.name}
      itemToValue={(client) => client.id}
      mark={<CheckIcon size="100%" />}
      nothing={t("nothingHere")}
      offeredTitle={t("available")}
      rows={CLIENTS.map((id) => ({ id, name: t(id) }))}
      takeLabel={t("take")}
      takeMark={<ChevronRightIcon size="100%" />}
      takenTitle={t("chosen")}
      {...props}
    />
  );
}
