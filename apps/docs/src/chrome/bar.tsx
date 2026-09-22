/**
 * Draws what the bar across the top holds: the control that opens the navigation, the brand, the
 * link to the catalogue, and the switches.
 */

import { type ReactElement } from "react";

import { Toolbar } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";
import { css } from "@stealthscale/theme";

import { Brand } from "#chrome/brand.tsx";
import { Opener } from "#chrome/opener.tsx";
import { SectionLink } from "#chrome/section-link.tsx";
import { Switches } from "#chrome/switches.tsx";

/**
 * The room that sets the brand apart from the sections beside it.
 *
 * @remarks
 *   The bar's own gap is the one between the controls of a bar, and at that gap the brand read as
 *   the first of the sections. The room is written on the brand rather than drawn by a row of its
 *   own. A row inside a band is a second flex container laying out what the band lays out already,
 *   and it put a div in the document that a reader is told nothing by. Beside the band's own gap
 *   it comes to the extra large gap the brand stood at before.
 */
const named = css({ marginInlineEnd: "gap.lg" });

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
        <Toolbar.Item as={Brand} className={named} />
        <Toolbar.Item as={SectionLink} />
      </Toolbar.Start>
      <Toolbar.End>
        <Switches />
      </Toolbar.End>
    </Toolbar.Root>
  );
}
