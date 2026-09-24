import { type ReactElement } from "react";

import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { Transfer } from "#transfer/index.ts";

interface Client {
  readonly id: string;
  readonly name: string;
  readonly terms: string;
}

const CLIENTS = ["fathom", "lantern", "pebble", "quartz"] as const;

export function Described(): ReactElement {
  const { t } = useWords("transfer");

  return (
    <Transfer<Client>
      defaultValue={["lantern"]}
      description={(client) => client.terms}
      giveBackLabel={t("giveBack")}
      giveBackMark={<ChevronLeftIcon size="100%" />}
      itemToString={(client) => client.name}
      itemToValue={(client) => client.id}
      mark={<CheckIcon size="100%" />}
      nothing={t("nothingHere")}
      offeredTitle={t("available")}
      rows={CLIENTS.map((id) => ({ id, name: t(id), terms: t(`${id}Of`) }))}
      takeLabel={t("take")}
      takeMark={<ChevronRightIcon size="100%" />}
      takenTitle={t("chosen")}
    />
  );
}
