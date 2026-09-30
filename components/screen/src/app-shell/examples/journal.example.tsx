import { type ReactElement } from "react";

import { MenuIcon } from "lucide-react";

import { Toc } from "@stealthscale/component-navigation";
import { Heading, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as AppShell from "#app-shell/index.ts";
import * as Toolbar from "#toolbar/index.ts";

const SECTIONS = [
  ["journal-moved", "whyMoved", "moved"],
  ["journal-broke", "whatBroke", "broke"],
  ["journal-kept", "whatKept", "kept"],
  ["journal-next", "whatNext", "next"],
] as const;

const ITEMS: Toc.TocItem[] = SECTIONS.map(([value]) => ({ depth: 2, value }));

export function Journal(props: AppShell.RootProps): ReactElement {
  const { t } = useWords("app-shell");

  return (
    <AppShell.Root scroll="window" {...props}>
      <AppShell.Header sticky>
        <Toolbar.Root aria-label={t("journalBrand")} size="sm">
          <Toolbar.Start>
            <Toolbar.Item
              aria-label={t("contents")}
              as={AppShell.Trigger}
              panel="contents"
              shape="square"
            >
              <MenuIcon />
            </Toolbar.Item>
            <Text as="span" size="sm" weight="semibold">
              {t("journalBrand")}
            </Text>
          </Toolbar.Start>
          <Toolbar.End>
            <Toolbar.Action primary>{t("subscribe")}</Toolbar.Action>
          </Toolbar.End>
        </Toolbar.Root>
      </AppShell.Header>
      <AppShell.Body>
        <AppShell.Navbar foldsBelow="sm" name="contents" width="12rem">
          <AppShell.Section grows scrolls>
            <Toc.Root items={ITEMS} size="sm">
              <Toc.Title>{t("contents")}</Toc.Title>
              <Toc.List>
                <Toc.Indicator />
                {SECTIONS.map(([value, heading]) => (
                  <Toc.Item item={{ depth: 2, value }} key={value}>
                    <Toc.Link href={`#${value}`} item={{ depth: 2, value }}>
                      {t(heading)}
                    </Toc.Link>
                  </Toc.Item>
                ))}
              </Toc.List>
            </Toc.Root>
          </AppShell.Section>
        </AppShell.Navbar>
        <AppShell.Main>
          {SECTIONS.map(([value, heading, body]) => (
            <AppShell.Section key={value}>
              <Heading as="h2" id={value} size="xs">
                {t(heading)}
              </Heading>
              <Text size="sm">{t(`${body}One`)}</Text>
              <Text size="sm">{t(`${body}Two`)}</Text>
            </AppShell.Section>
          ))}
        </AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  );
}
