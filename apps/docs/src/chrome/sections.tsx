/**
 * Draws the brand and the links to the sections at the start of the bar.
 */

import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Toolbar } from "@stealthscale/component-screen";

import { Brand } from "#chrome/brand.tsx";
import { SectionLink } from "#chrome/section-link.tsx";

/**
 * Draws the brand and the sections in a row of their own, an extra large gap apart.
 *
 * @remarks
 *   The bar's own gap is the one between the controls of a bar, and at that gap the brand read as
 *   the first of the sections. Each is an item of the bar's row, so draw this inside
 *   `Toolbar.Root`.
 */
export function Sections(): ReactElement {
  return (
    <Stack direction="row" gap="xl">
      <Toolbar.Item as={Brand} />
      <Toolbar.Item as={SectionLink} />
    </Stack>
  );
}
