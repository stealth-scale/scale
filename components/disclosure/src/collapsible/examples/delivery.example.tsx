import { type ReactElement } from "react";

import { ChevronDownIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Collapsible from "#collapsible/index.ts";

export function Delivery(props: Collapsible.RootProps): ReactElement {
  const { t } = useWords("collapsible");

  return (
    <Collapsible.Root {...props}>
      <Collapsible.Trigger>
        {t("delivery")}
        <Collapsible.Indicator>
          <ChevronDownIcon size="100%" />
        </Collapsible.Indicator>
      </Collapsible.Trigger>
      <Collapsible.Content>{t("arrives")}</Collapsible.Content>
    </Collapsible.Root>
  );
}
