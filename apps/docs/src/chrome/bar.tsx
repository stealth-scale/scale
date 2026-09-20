/**
 * Draws what the bar across the top holds: the control that opens the navigation, the brand, the
 * link to the catalogue, and the switches.
 */

import { type ReactElement } from "react";

import { Toolbar } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";

import { Opener } from "#chrome/opener.tsx";
import { Sections } from "#chrome/sections.tsx";
import { Switches } from "#chrome/switches.tsx";

/**
 * Draws the bar's contents as the library's toolbar, the brand and the sections at the start and
 * the switches at the end.
 *
 * @remarks
 *   Every control is an item of the row, so the row is one tab stop and the arrows move between
 *   them. The control that opens the navigation is a quiet square holding one glyph, named in
 *   words for a screen reader, and leaves the document where the navigation has dropped under the
 *   page. The catalogue is the one section this application has, and its link is filled while the
 *   reader is in it. The switches run from what changes the words to what changes the paint: the
 *   language, the width the page is held to, the theme and the mode.
 */
export function Bar(): ReactElement {
  const { t } = useTranslation("docs");

  return (
    <Toolbar.Root aria-label={t("frame.bar")} size="md">
      <Toolbar.Start>
        <Toolbar.Item aria-label={t("frame.navigation")} as={Opener} />
        <Sections />
      </Toolbar.Start>
      <Toolbar.End>
        <Switches />
      </Toolbar.End>
    </Toolbar.Root>
  );
}
