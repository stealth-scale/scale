/**
 * Draws what the bar across the top holds: the control that opens the navigation, the brand, the
 * link to the catalogue, the theme switcher and the switch between light and dark.
 */

import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Toolbar } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";

import { Brand } from "#chrome/brand.tsx";
import { ColorModeToggle } from "#chrome/color-mode-toggle.tsx";
import { Opener } from "#chrome/opener.tsx";
import { SectionLink } from "#chrome/section-link.tsx";
import { ThemeSwitcher } from "#chrome/theme-switcher.tsx";

/**
 * Draws the bar's contents as the library's toolbar, the brand and the sections at the start and
 * the switches at the end.
 *
 * @remarks
 *   Every control is an item of the row, so the row is one tab stop and the arrows move between
 *   them. The control that opens the navigation is a quiet square holding one glyph, named in
 *   words for a screen reader, and leaves the document where the navigation has dropped under the
 *   page. The catalogue is the one section this application has, and its link is filled while the
 *   reader is in it. The brand and the sections stand an extra large gap apart in a row of their
 *   own, because the row's own gap is the one between the controls of a bar, and at that gap the
 *   brand read as the first of the sections.
 */
export function Bar(): ReactElement {
  const { t } = useTranslation("docs");

  return (
    <Toolbar.Root aria-label={t("frame.bar")} size="md">
      <Toolbar.Start>
        <Toolbar.Item aria-label={t("frame.navigation")} as={Opener} />
        <Stack direction="row" gap="xl">
          <Toolbar.Item as={Brand} />
          <Toolbar.Item as={SectionLink} />
        </Stack>
      </Toolbar.Start>
      <Toolbar.End>
        <ThemeSwitcher />
        <ColorModeToggle />
      </Toolbar.End>
    </Toolbar.Root>
  );
}
