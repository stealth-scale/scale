import { type ReactElement } from "react";

import { CheckIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { useListCollection } from "#collection/index.ts";
import * as Listbox from "#listbox/index.ts";

interface Client {
  readonly id: string;
  readonly name: string;
  readonly status: "closed" | "held";
}

const CLIENTS = [
  { id: "fathom", status: "held" },
  { id: "lantern", status: "held" },
  { id: "pebble", status: "closed" },
  { id: "quartz", status: "closed" },
] as const;

export function Grouped(): ReactElement {
  const { t } = useWords("listbox");
  const { collection } = useListCollection<Client>({
    itemToString: (client) => client.name,
    itemToValue: (client) => client.id,
    rows: CLIENTS.map(({ id, status }) => ({ id, name: t(id), status })),
  });

  return (
    <Listbox.Simple<Client>
      collection={collection}
      defaultValue={["fathom"]}
      groupBy={(client) => client.status}
      groupLabel={(status) => t(status)}
      label={t("clients")}
      mark={<CheckIcon size="100%" />}
      variant="surface"
    />
  );
}
