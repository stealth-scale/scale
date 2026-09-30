import { type ReactElement, useState } from "react";

import { ChevronsUpDownIcon, LayoutGridIcon, ListIcon, PaletteIcon, PlusIcon } from "lucide-react";

import { IconButton } from "@stealthscale/component-actions";
import { Icon, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Page from "#page/index.ts";
import * as Toolbar from "#toolbar/index.ts";

const VIEWS = [
  { count: 4, value: "tokens" },
  { count: 1, value: "automations" },
] as const;

const LAYOUTS = [
  { Mark: ListIcon, name: "list" },
  { Mark: LayoutGridIcon, name: "tiles" },
] as const;

export function Tokens(): ReactElement {
  const { t } = useWords("page");
  const [view, setView] = useState("tokens");
  const [layout, setLayout] = useState("list");

  return (
    <Page.Root>
      <Page.Header>
        <Page.Leading when="wide">
          <Icon as={PaletteIcon} size="lg" tone="muted" />
        </Page.Leading>
        <Page.Title as="h3">{t("tokens.title")}</Page.Title>
        <Page.Actions>
          <Page.Action icon={<PlusIcon size="1em" />} primary>
            {t("tokens.add")}
          </Page.Action>
        </Page.Actions>
      </Page.Header>
      <Page.Nav aria-label={t("tokens.lists")}>
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
              {t(`tokens.${value}`)}
            </Page.Tab>
          ))}
        </Page.TabList>
        <Toolbar.Root aria-label={t("tokens.layout")} size="xs">
          <Toolbar.Group>
            {LAYOUTS.map(({ Mark, name }) => (
              <Toolbar.Item
                aria-label={t(`tokens.${name}`)}
                aria-pressed={layout === name}
                as={IconButton}
                key={name}
                onClick={() => {
                  setLayout(name);
                }}
                variant="outline"
              >
                <Mark size="1em" />
              </Toolbar.Item>
            ))}
          </Toolbar.Group>
        </Toolbar.Root>
      </Page.Nav>
      <Page.Body>
        <Text size="sm" tone="muted">
          {t(`tokens.bodies.${view}`)}
        </Text>
      </Page.Body>
    </Page.Root>
  );
}
