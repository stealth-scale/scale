import { type ReactElement } from "react";

import { CheckIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { useListCollection } from "#collection/index.ts";
import * as Listbox from "#listbox/index.ts";

interface Client {
  readonly closed: boolean;
  readonly id: string;
  readonly name: string;
}

const CLIENTS = [
  { closed: false, id: "fathom" },
  { closed: false, id: "lantern" },
  { closed: false, id: "pebble" },
  { closed: true, id: "quartz" },
] as const;

export function Locked(): ReactElement {
  const { t } = useWords("listbox");
  const { collection } = useListCollection<Client>({
    isItemDisabled: (client) => client.closed,
    itemToString: (client) => client.name,
    itemToValue: (client) => client.id,
    rows: CLIENTS.map(({ closed, id }) => ({ closed, id, name: t(id) })),
  });

  return (
    <Listbox.Simple<Client>
      collection={collection}
      defaultValue={["fathom"]}
      label={t("clients")}
      mark={<CheckIcon size="100%" />}
      variant="surface"
    />
  );
}
