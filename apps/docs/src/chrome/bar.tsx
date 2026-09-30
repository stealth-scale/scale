/**
 * Renders the bar at the top of the catalogue: the navigation control, the brand, the link to the
 * catalogue and the switches.
 */

import { type ReactElement } from "react";

import { EllipsisIcon } from "lucide-react";

import { Toolbar } from "@stealthscale/component-screen";
import { useTranslation } from "@stealthscale/provider-i18n";

import { Brand } from "#chrome/brand.tsx";
import { Opener } from "#chrome/opener.tsx";
import { SectionLink } from "#chrome/section-link.tsx";
import { Switches } from "#chrome/switches.tsx";

/**
 * Renders the bar as the library's toolbar: the brand and the sections at the start, the switches
 * at the end.
 *
 * @remarks
 *   Every control is an item of the row, so the row is one tab stop and the arrow keys move between
 *   the controls. The row is small, so its buttons and the menu's trigger are 36px tall. The
 *   navigation control is a square with one glyph and an accessible name. The catalogue is the one
 *   section, and its link is marked current on every catalogue page. A bar under 640px lists the
 *   link in a menu behind an ellipsis at the end of the row. The switches run from the language to
 *   the mode.
 * @returns The `div` element with `role="toolbar"`.
 */
export function Bar(): ReactElement {
  const { t } = useTranslation("docs");

  return (
    <Toolbar.Root
      aria-label={t("frame.bar")}
      more={t("frame.sections")}
      moreIcon={<EllipsisIcon aria-hidden />}
      size="sm"
    >
      <Toolbar.Start>
        <Toolbar.Item aria-label={t("frame.navigation")} as={Opener} />
        <Toolbar.Item as={Brand} />
        <SectionLink />
      </Toolbar.Start>
      <Toolbar.End>
        <Switches />
      </Toolbar.End>
    </Toolbar.Root>
  );
}
