import { type ReactElement, useState } from "react";

import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { Transfer } from "#transfer/index.ts";

interface Client {
  readonly id: string;
  readonly name: string;
}

const CLIENTS = ["fathom", "lantern", "pebble", "quartz"] as const;

export function Held(): ReactElement {
  const { t } = useWords("transfer");
  const [taken, setTaken] = useState<readonly string[]>(["fathom"]);

  return (
    <Stack gap="md">
      <Transfer<Client>
        giveBackLabel={t("giveBack")}
        giveBackMark={<ChevronLeftIcon size="100%" />}
        itemToString={(client) => client.name}
        itemToValue={(client) => client.id}
        mark={<CheckIcon size="100%" />}
        nothing={t("nothingHere")}
        offeredTitle={t("available")}
        onValueChange={setTaken}
        rows={CLIENTS.map((id) => ({ id, name: t(id) }))}
        takeLabel={t("take")}
        takeMark={<ChevronRightIcon size="100%" />}
        takenTitle={t("chosen")}
        value={taken}
      />
      <Text aria-live="polite">
        {taken.length === 0 ? t("nothing") : taken.map((id) => t(id)).join(", ")}
      </Text>
    </Stack>
  );
}
