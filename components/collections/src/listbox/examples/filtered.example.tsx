import { type ReactElement } from "react";

import { CheckIcon, XIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { useFilter, useListCollection } from "#collection/index.ts";
import * as Listbox from "#listbox/index.ts";

interface Client {
  readonly id: string;
  readonly name: string;
}

const CLIENTS = ["fathom", "lantern", "pebble", "quartz"] as const;

export function Filtered(): ReactElement {
  const { t } = useWords("listbox");
  const filter = useFilter();
  const { collection, narrow } = useListCollection<Client>({
    filter: filter.contains,
    itemToString: (client) => client.name,
    itemToValue: (client) => client.id,
    rows: CLIENTS.map((id) => ({ id, name: t(id) })),
  });

  return (
    <Listbox.Simple<Client>
      collection={collection}
      defaultValue={["fathom"]}
      empty={t("none")}
      label={t("clients")}
      mark={<CheckIcon size="100%" />}
      narrowing={{
        clearIndicator: <XIcon size="100%" />,
        clearLabel: t("clear"),
        onNarrow: narrow,
        placeholder: t("filter"),
      }}
      variant="surface"
    />
  );
}
