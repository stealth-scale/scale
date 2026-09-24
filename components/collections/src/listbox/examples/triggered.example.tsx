import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import { CheckIcon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Popover } from "@stealthscale/component-disclosure";
import { useWords } from "@stealthscale/specimen";

import { useListCollection } from "#collection/index.ts";
import * as Listbox from "#listbox/index.ts";

interface Client {
  readonly id: string;
  readonly name: string;
}

const CLIENTS = ["fathom", "lantern", "pebble", "quartz"] as const;

const OUTLINED = { variant: "outline" } as const;

export function Triggered(): ReactElement {
  const { t } = useWords("listbox");
  const { collection } = useListCollection<Client>({
    itemToString: (client) => client.name,
    itemToValue: (client) => client.id,
    rows: CLIENTS.map((id) => ({ id, name: t(id) })),
  });

  return (
    <Popover.Root size="xs">
      <ButtonPropsProvider value={OUTLINED}>
        <Popover.Trigger as={Button}>{t("pick")}</Popover.Trigger>
      </ButtonPropsProvider>
      {createPortal(
        <Popover.Positioner>
          <Popover.Content>
            <Listbox.Simple<Client>
              aria-label={t("clients")}
              collection={collection}
              defaultValue={["fathom"]}
              mark={<CheckIcon size="100%" />}
            />
          </Popover.Content>
        </Popover.Positioner>,
        document.body,
      )}
    </Popover.Root>
  );
}
