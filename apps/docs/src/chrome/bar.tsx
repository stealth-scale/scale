/**
 * Draws what the bar across the top holds: the control that opens the navigation, the brand, and
 * the switchers.
 */

import { type ReactElement } from "react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Container, Grid, Stack } from "@stealthscale/component-layout";
import { Link } from "@stealthscale/component-navigation";
import { AppShell } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";
import { createLink, useRouteHref } from "@stealthscale/provider-router";

import { INDEX } from "#catalogue.ts";
import { ColorModeSwitcher } from "#chrome/color-mode-switcher.tsx";
import { ThemeSwitcher } from "#chrome/theme-switcher.tsx";

/**
 * Draws the brand over the router's link, so it leads to the index without a reload.
 */
const Brand = createLink(Link);

/**
 * Draws the bar's contents as one row inside the reading gutter, the brand at the start and the
 * switchers at the end.
 *
 * @remarks
 *   The control that opens the navigation is drawn as a quiet button, and leaves the document where
 *   the navigation has dropped under the page. The switchers sit in a grid of two equal columns,
 *   because each is drawn to fill the head of a sidebar and two of them in a row would otherwise
 *   squeeze each other's words.
 */
export function Bar(): ReactElement {
  const { t } = useTranslation("docs");
  const home = useRouteHref(INDEX);

  return (
    <Container size="full">
      <Stack direction="row" gap="md" justify="between">
        <Stack direction="row" gap="md">
          <ButtonPropsProvider value={{ size: "sm", variant: "ghost" }}>
            <AppShell.Trigger as={Button}>{t("frame.navigation")}</AppShell.Trigger>
          </ButtonPropsProvider>
          <Brand to={home} variant="plain">
            {t("frame.brand")}
          </Brand>
        </Stack>
        <Grid.Root columns="2" gap="sm">
          <ThemeSwitcher />
          <ColorModeSwitcher />
        </Grid.Root>
      </Stack>
    </Container>
  );
}
