import { type ReactElement } from "react";

import { CheckIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { useListCollection } from "#collection/index.ts";
import * as Listbox from "#listbox/index.ts";

interface Client {
  readonly id: string;
  readonly name: string;
}

const CLIENTS = ["fathom", "lantern", "pebble", "quartz"] as const;

export function Clients(props: Omit<Listbox.SimpleProps<Client>, "collection">): ReactElement {
  const { t } = useWords("listbox");
  const { collection } = useListCollection<Client>({
    itemToString: (client) => client.name,
    itemToValue: (client) => client.id,
    rows: CLIENTS.map((id) => ({ id, name: t(id) })),
  });

  return (
    <Listbox.Simple<Client>
      collection={collection}
      defaultValue={["fathom"]}
      label={t("clients")}
      mark={<CheckIcon size="100%" />}
      {...props}
    />
  );
}
