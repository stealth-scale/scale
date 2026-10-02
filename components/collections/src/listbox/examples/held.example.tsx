import { type ReactElement, useState } from "react";

import { CheckIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Group, Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { useListCollection } from "#collection/index.ts";
import * as Listbox from "#listbox/index.ts";

interface Client {
  readonly id: string;
  readonly name: string;
}

const CLIENTS = ["fathom", "lantern", "pebble", "quartz"] as const;

export function Held(): ReactElement {
  const { t } = useWords("listbox");
  const [picked, setPicked] = useState<string[]>(["fathom"]);
  const { collection } = useListCollection<Client>({
    itemToString: (client) => client.name,
    itemToValue: (client) => client.id,
    rows: CLIENTS.map((id) => ({ id, name: t(id) })),
  });

  return (
    <Stack gap="md">
      <Listbox.Simple<Client>
        boxed
        collection={collection}
        label={t("clients")}
        mark={<CheckIcon size="100%" />}
        onValueChange={(next) => {
          setPicked(next.value);
        }}
        selectionMode="multiple"
        value={picked}
        variant="surface"
      />
      <Group attached>
        <Button
          onClick={() => {
            setPicked([...CLIENTS]);
          }}
          size="sm"
          variant="outline"
        >
          {t("takeAll")}
        </Button>
        <Button
          onClick={() => {
            setPicked([]);
          }}
          size="sm"
          variant="outline"
        >
          {t("takeNone")}
        </Button>
      </Group>
    </Stack>
  );
}
