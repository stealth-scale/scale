import { type ReactElement } from "react";

import { ArrowLeftIcon, GitBranchIcon, RocketIcon, RotateCcwIcon } from "lucide-react";

import { Badge, Status } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Page from "#page/index.ts";

export function Deployment(): ReactElement {
  const { t } = useWords("page");

  return (
    <Page.Root>
      <Page.Header>
        <Page.Trail href="#deployments">
          <ArrowLeftIcon size="1em" />
          {t("deployment.parent")}
        </Page.Trail>
        <Page.Title as="h3">{t("deployment.title")}</Page.Title>
        <Page.Meta>
          <Badge palette="neutral" size="sm">
            {t("deployment.public")}
          </Badge>
          <Badge palette="neutral" size="sm" variant="outline">
            {t("deployment.template")}
          </Badge>
        </Page.Meta>
        <Page.Description>
          <Stack as="span" direction="row" gap="md" wrap>
            <Stack as="span" direction="row" gap="xs">
              <GitBranchIcon size="1em" />
              {t("deployment.branch")}
            </Stack>
            <span aria-hidden>•</span>
            <Status.Root palette="success" size="inherit">
              <Status.Indicator />
              {t("deployment.ready")}
            </Status.Root>
            <span aria-hidden>•</span>
            <span>{t("deployment.deployed")}</span>
          </Stack>
        </Page.Description>
        <Page.Actions>
          <Page.Action icon={<RotateCcwIcon size="1em" />}>{t("deployment.rollBack")}</Page.Action>
          <Page.Action icon={<RocketIcon size="1em" />} primary>
            {t("deployment.deploy")}
          </Page.Action>
        </Page.Actions>
      </Page.Header>
      <Page.Body>
        <Text size="sm" tone="muted">
          {t("deployment.body")}
        </Text>
      </Page.Body>
    </Page.Root>
  );
}
