import { type ReactElement } from "react";

import { RotateCwIcon, ServerCrashIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { EmptyState } from "@stealthscale/component-feedback";
import { useWords } from "@stealthscale/specimen";

import * as Page from "#page/index.ts";

export function Failed(): ReactElement {
  const { t } = useWords("page");

  return (
    <Page.Root size="sm">
      <Page.Header>
        <Page.Title as="h3">{t("approvals.title")}</Page.Title>
      </Page.Header>
      <Page.Body>
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <ServerCrashIcon />
            </EmptyState.Indicator>
            <EmptyState.Title as="h4">{t("approvals.heading")}</EmptyState.Title>
            <EmptyState.Description>{t("approvals.about")}</EmptyState.Description>
            <Button size="sm" variant="outline">
              <RotateCwIcon size="1em" />
              {t("approvals.retry")}
            </Button>
          </EmptyState.Content>
        </EmptyState.Root>
      </Page.Body>
    </Page.Root>
  );
}
