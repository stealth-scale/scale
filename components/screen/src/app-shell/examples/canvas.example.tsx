import { type ReactElement } from "react";

import {
  FrameIcon,
  ImageIcon,
  MenuIcon,
  MousePointerClickIcon,
  PanelBottomIcon,
  PanelRightIcon,
  PanelTopIcon,
} from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { InputGroup } from "@stealthscale/component-forms";
import { NavList } from "@stealthscale/component-navigation";
import { Card } from "@stealthscale/component-surfaces";
import { Heading, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as AppShell from "#app-shell/index.ts";
import * as Toolbar from "#toolbar/index.ts";

const LAYERS = [
  ["canvasLayer", FrameIcon, undefined],
  ["headerLayer", PanelTopIcon, undefined],
  ["hero", ImageIcon, "page"],
  ["cta", MousePointerClickIcon, undefined],
  ["footerLayer", PanelBottomIcon, undefined],
] as const;

const SIZES = [
  ["W", "width", "1200"],
  ["H", "height", "640"],
] as const;

export function Canvas(props: AppShell.RootProps): ReactElement {
  const { t } = useWords("app-shell");

  return (
    <AppShell.Root divided={false} variant="floating" {...props}>
      <AppShell.Header>
        <Toolbar.Root aria-label={t("draft")} size="sm">
          <Toolbar.Start>
            <Toolbar.Item
              aria-label={t("layers")}
              as={AppShell.Trigger}
              panel="layers"
              shape="square"
            >
              <MenuIcon />
            </Toolbar.Item>
            <Text as="span" size="sm" weight="semibold">
              {t("draft")}
            </Text>
          </Toolbar.Start>
          <Toolbar.End>
            <Toolbar.Action primary>{t("share")}</Toolbar.Action>
            <Toolbar.Item
              aria-label={t("properties")}
              as={AppShell.Trigger}
              panel="properties"
              shape="square"
            >
              <PanelRightIcon />
            </Toolbar.Item>
          </Toolbar.End>
        </Toolbar.Root>
      </AppShell.Header>
      <AppShell.Body>
        <AppShell.Navbar foldsBelow="sm" name="layers" width="12rem">
          <AppShell.Section grows scrolls>
            <Heading as="h2" size="xs">
              {t("layers")}
            </Heading>
            <NavList.Root aria-label={t("layers")} size="sm">
              {LAYERS.map(([layer, Glyph, current]) => (
                <NavList.Item key={layer}>
                  <NavList.Link aria-current={current} href={`#${layer}`}>
                    <Glyph />
                    <span>{t(layer)}</span>
                  </NavList.Link>
                </NavList.Item>
              ))}
            </NavList.Root>
          </AppShell.Section>
        </AppShell.Navbar>
        <AppShell.Main>
          <AppShell.Section>
            <Card.Root size="sm" variant="outline">
              <Card.Header>
                <Card.Title>{t("heroTitle")}</Card.Title>
                <Card.Description>{t("heroBody")}</Card.Description>
              </Card.Header>
              <Card.Footer>
                <Button size="sm">{t("heroAction")}</Button>
              </Card.Footer>
            </Card.Root>
          </AppShell.Section>
        </AppShell.Main>
        <AppShell.Aside name="properties" width="14rem">
          <AppShell.Section>
            <Heading as="h2" size="xs">
              {t("hero")}
            </Heading>
            <InputGroup.Root size="sm">
              {SIZES.map(([mark, name, value]) => (
                <InputGroup.Row key={name}>
                  <InputGroup.Mark aria-hidden>{mark}</InputGroup.Mark>
                  <InputGroup.Field aria-label={t(name)} defaultValue={value} inputMode="numeric" />
                </InputGroup.Row>
              ))}
            </InputGroup.Root>
            <InputGroup.Root size="sm">
              <InputGroup.Mark aria-hidden>#</InputGroup.Mark>
              <InputGroup.Field aria-label={t("fill")} defaultValue="1F6FEB" />
            </InputGroup.Root>
            <Button size="sm" variant="outline">
              {t("replace")}
            </Button>
          </AppShell.Section>
        </AppShell.Aside>
      </AppShell.Body>
    </AppShell.Root>
  );
}
