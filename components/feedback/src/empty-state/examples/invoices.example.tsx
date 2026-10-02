import { type ReactElement } from "react";

import { InboxIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as EmptyState from "#empty-state/index.ts";

export function Invoices(props: EmptyState.RootProps): ReactElement {
  const { t } = useWords("empty-state");

  return (
    <EmptyState.Root {...props}>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <InboxIcon />
        </EmptyState.Indicator>
        <EmptyState.Title as="h3">{t("none")}</EmptyState.Title>
        <EmptyState.Description>{t("description")}</EmptyState.Description>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
