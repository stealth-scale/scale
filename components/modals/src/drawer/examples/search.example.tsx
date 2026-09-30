import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import { HistoryIcon, SearchIcon, XIcon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { SearchInput } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Drawer from "#drawer/index.ts";

const GHOST = { variant: "ghost" } as const;

const RECENT = ["invoices", "clients", "payouts"] as const;

export function Search(): ReactElement {
  const { t } = useWords("drawer");

  return (
    <Drawer.Root placement="top">
      <Drawer.Trigger as={Button}>
        <SearchIcon />
        {t("search.trigger")}
      </Drawer.Trigger>
      {createPortal(
        <>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>{t("search.title")}</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Stack gap="md">
                  <SearchInput
                    aria-label={t("search.label")}
                    clearIndicator={<XIcon />}
                    clearLabel={t("search.clear")}
                    placeholder={t("search.placeholder")}
                    searchIndicator={<SearchIcon />}
                  />
                  <Text size="sm" tone="muted">
                    {t("search.recent")}
                  </Text>
                  <Stack align="flex-start" gap="xs">
                    <ButtonPropsProvider value={GHOST}>
                      {RECENT.map((term) => (
                        <Drawer.ActionTrigger as={Button} key={term}>
                          <HistoryIcon />
                          {t(`search.terms.${term}`)}
                        </Drawer.ActionTrigger>
                      ))}
                    </ButtonPropsProvider>
                  </Stack>
                </Stack>
              </Drawer.Body>
              <Drawer.CloseTrigger aria-label={t("close")}>
                <XIcon />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </>,
        document.body,
      )}
    </Drawer.Root>
  );
}
