import { type ReactElement } from "react";

import {
  BookOpenIcon,
  BriefcaseIcon,
  CalendarIcon,
  CompassIcon,
  MenuIcon,
  WrenchIcon,
} from "lucide-react";

import { NavList } from "@stealthscale/component-navigation";
import { Heading, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as AppShell from "#app-shell/index.ts";
import * as Sidebar from "#sidebar/index.ts";
import * as Toolbar from "#toolbar/index.ts";

const CHAPTERS = [
  ["gettingStarted", CompassIcon, undefined],
  ["workingHere", BriefcaseIcon, "page"],
  ["tools", WrenchIcon, undefined],
  ["onCall", BookOpenIcon, undefined],
  ["leave", CalendarIcon, undefined],
] as const;

const SECTIONS = ["hours", "meetings", "writing"] as const;

export function Handbook(props: AppShell.RootProps): ReactElement {
  const { t } = useWords("app-shell");

  return (
    <AppShell.Root variant="inset" {...props}>
      <AppShell.Body>
        <AppShell.Navbar collapse="icons" foldsBelow="sm" width="13rem">
          <Sidebar.Root>
            <Sidebar.Content>
              <Sidebar.Nav>
                <Sidebar.NavLabel>{t("handbookName")}</Sidebar.NavLabel>
                <NavList.Root>
                  {CHAPTERS.map(([chapter, Glyph, current]) => (
                    <NavList.Item key={chapter}>
                      <NavList.Link
                        aria-current={current}
                        href={`#${chapter}`}
                        tooltip={t(chapter)}
                      >
                        <Glyph />
                        <span>{t(chapter)}</span>
                      </NavList.Link>
                    </NavList.Item>
                  ))}
                </NavList.Root>
              </Sidebar.Nav>
            </Sidebar.Content>
          </Sidebar.Root>
        </AppShell.Navbar>
        <AppShell.Rail />
        <AppShell.Main>
          <AppShell.Header sticky>
            <Toolbar.Root aria-label={t("handbookBrand")} size="sm">
              <Toolbar.Start>
                <Toolbar.Item aria-label={t("navigation")} as={AppShell.Trigger} shape="square">
                  <MenuIcon />
                </Toolbar.Item>
                <Text as="span" size="sm" weight="semibold">
                  {t("handbookBrand")}
                </Text>
              </Toolbar.Start>
            </Toolbar.Root>
          </AppShell.Header>
          <AppShell.Section>
            <Heading as="h2" size="md">
              {t("workingHere")}
            </Heading>
            <Text size="sm" tone="muted">
              {t("workingHereAbout")}
            </Text>
          </AppShell.Section>
          {SECTIONS.map((section) => (
            <AppShell.Section key={section}>
              <Heading as="h3" size="xs">
                {t(section)}
              </Heading>
              <Text size="sm">{t(`${section}One`)}</Text>
              <Text size="sm">{t(`${section}Two`)}</Text>
            </AppShell.Section>
          ))}
          <AppShell.Footer sticky>
            <Text size="sm" tone="muted">
              {t("update")}
            </Text>
          </AppShell.Footer>
        </AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  );
}
