/**
 * Draws what the bar across the top holds: the control that opens the navigation, the brand, and
 * the switchers.
 */

import { type ReactElement } from "react";

import { Toolbar } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";

import { Brand } from "#chrome/brand.tsx";
import { ColorModeSwitcher } from "#chrome/color-mode-switcher.tsx";
import { Opener } from "#chrome/opener.tsx";
import { Panel } from "#chrome/panel.tsx";
import { ThemeSwitcher } from "#chrome/theme-switcher.tsx";

/**
 * Draws the bar's contents as the library's toolbar, the brand at the start and the switchers at
 * the end.
 *
 * @remarks
 *   Every control is an item of the row, so the row is one tab stop and the arrows move between
 *   them. The control that opens the navigation is a quiet square holding one glyph, named in
 *   words for a screen reader, and leaves the document where the navigation has dropped under the
 *   page.
 */
export function Bar(): ReactElement {
  const { t } = useTranslation("docs");

  return (
    <Toolbar.Root aria-label={t("frame.bar")} size="md">
      <Toolbar.Start>
        <Toolbar.Item aria-label={t("frame.navigation")} as={Opener}>
          <Panel />
        </Toolbar.Item>
        <Toolbar.Item as={Brand} />
      </Toolbar.Start>
      <Toolbar.End>
        <ThemeSwitcher />
        <ColorModeSwitcher />
      </Toolbar.End>
    </Toolbar.Root>
  );
}
