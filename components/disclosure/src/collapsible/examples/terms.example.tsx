import { type ReactElement } from "react";

import { ChevronDownIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Collapsible from "#collapsible/index.ts";

export function Terms(): ReactElement {
  const { t } = useWords("collapsible");

  return (
    <Collapsible.Root collapsedHeight="2lh" variant="subtle">
      <Collapsible.Trigger>
        {t("delivery")}
        <Collapsible.Indicator>
          <ChevronDownIcon size="100%" />
        </Collapsible.Indicator>
      </Collapsible.Trigger>
      <Collapsible.Content>{t("terms")}</Collapsible.Content>
    </Collapsible.Root>
  );
}
