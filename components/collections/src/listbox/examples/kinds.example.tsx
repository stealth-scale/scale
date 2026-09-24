import { type ReactElement } from "react";

import { CheckIcon, LandmarkIcon, StoreIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { useListCollection } from "#collection/index.ts";
import * as Listbox from "#listbox/index.ts";

interface Client {
  readonly id: string;
  readonly kind: "bank" | "shop";
  readonly name: string;
}

const CLIENTS = [
  { id: "fathom", kind: "bank" },
  { id: "lantern", kind: "shop" },
  { id: "pebble", kind: "bank" },
  { id: "quartz", kind: "shop" },
] as const;

function kindOf(client: Client): ReactElement {
  return client.kind === "bank" ? (
    <LandmarkIcon aria-hidden size="1em" />
  ) : (
    <StoreIcon aria-hidden size="1em" />
  );
}

export function Kinds(): ReactElement {
  const { t } = useWords("listbox");
  const { collection } = useListCollection<Client>({
    itemToString: (client) => client.name,
    itemToValue: (client) => client.id,
    rows: CLIENTS.map(({ id, kind }) => ({ id, kind, name: t(id) })),
  });

  return (
    <Listbox.Simple<Client>
      collection={collection}
      defaultValue={["fathom"]}
      icon={kindOf}
      label={t("clients")}
      mark={<CheckIcon size="100%" />}
      variant="surface"
    />
  );
}
