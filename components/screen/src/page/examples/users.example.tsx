import { type ReactElement, useState } from "react";

import {
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  EllipsisIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react";

import { Badge } from "@stealthscale/component-data";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Page from "#page/index.ts";

const VIEWS: ReadonlyArray<{ readonly count?: number; readonly value: string }> = [
  { count: 412, value: "all" },
  { count: 9, value: "invited" },
  { value: "suspended" },
];

export function Users(props: Page.RootProps): ReactElement {
  const { t } = useWords("page");
  const [view, setView] = useState("all");

  return (
    <Page.Root {...props}>
      <Page.Header>
        <Page.Breadcrumbs
          backIcon={<ArrowLeftIcon size="1em" />}
          items={[
            { href: "#ledger", label: t("ledger") },
            { href: "#collections", label: t("users.parent") },
          ]}
          separator={<ChevronRightIcon size="1em" />}
        />
        <Page.Title as="h3">{t("users.title")}</Page.Title>
        <Page.Meta when="wide">
          <Badge palette="neutral" size="sm">
            412
          </Badge>
        </Page.Meta>
        <Page.Description>{t("users.about")}</Page.Description>
        <Page.Actions more={t("users.more")} moreIcon={<EllipsisIcon size="1em" />}>
          <Page.Action icon={<SettingsIcon size="1em" />}>{t("users.settings")}</Page.Action>
          <Page.Action>{t("users.preview")}</Page.Action>
          <Page.Action icon={<PlusIcon size="1em" />} primary>
            {t("users.add")}
          </Page.Action>
        </Page.Actions>
      </Page.Header>
      <Page.Nav aria-label={t("users.lists")}>
        <Page.TabList
          aria-label={t("views")}
          emptyLabel={t("noView")}
          filterLabel={t("filterViews")}
          onValueChange={setView}
          pickerIcon={<ChevronsUpDownIcon size="1em" />}
          value={view}
        >
          {VIEWS.map(({ count, value }) => (
            <Page.Tab count={count} key={value} value={value}>
              {t(`users.${value}`)}
            </Page.Tab>
          ))}
        </Page.TabList>
      </Page.Nav>
      <Page.Body>
        <Text size="sm" tone="muted">
          {t(`users.bodies.${view}`)}
        </Text>
      </Page.Body>
    </Page.Root>
  );
}
