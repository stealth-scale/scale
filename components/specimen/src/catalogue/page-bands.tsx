/**
 * Renders a catalogue page as two bands under a tab list: its examples, and the props its parts
 * accept.
 */

import { type ReactElement, useState } from "react";

import { Tabs } from "@stealthscale/component-disclosure";
import { Page } from "@stealthscale/component-screen";

import { type Band, BANDS } from "#catalogue/bands.ts";
import { Body, type Listed } from "#catalogue/page-body.tsx";
import { PropsBody } from "#catalogue/page-props.tsx";
import { Sections } from "#catalogue/page-sections.tsx";
import { PageTabs } from "#catalogue/page-tabs.tsx";
import { type Indexed } from "#catalogue/types.ts";
import { useAnatomy } from "#catalogue/use-anatomy.ts";

/**
 * Aliases the tabs root, which renders as the page element so every band stays a child of the page
 * grid.
 */
const Banded = Tabs.Root;

/**
 * Describes the props {@link Bands} accepts.
 */
export interface BandsProps {
  /**
   * Gives the page header, rendered above the tab list.
   */
  readonly children: ReactElement;

  /**
   * Gives the index entry for the page.
   */
  readonly entry: Indexed;

  /**
   * Gives the path the application serves the framed page at, and stays undefined where it serves
   * none.
   */
  readonly framed?: string | undefined;

  /**
   * Gives the import statement the page declares, and stays undefined where it declares none.
   */
  readonly imports?: string | undefined;

  /**
   * Lists the scenes in the order they appear on the page.
   */
  readonly scenes: readonly Listed[];
}

/**
 * Renders the page, its tab list, and whichever band the tab list has open.
 *
 * @remarks
 *   A page is a grid of named areas, so the tabs root renders as the page itself through `as`: a
 *   wrapper element around the bands leaves each band without an area, and the rail listing the
 *   scenes drops to the foot of the page. Each panel renders as the page body for the same reason,
 *   taking the tabpanel role and the body grid area together. The props load only while the props
 *   band is open, because one page's props run to tens of kilobytes.
 */
export function Bands({ children, entry, framed, imports, scenes }: BandsProps): ReactElement {
  const [band, setBand] = useState<Band>(BANDS.examples);
  const { failure, parts } = useAnatomy(entry, band === BANDS.props);

  return (
    <Banded
      as={Page.Root}
      onValueChange={(next) => {
        setBand(next.value === BANDS.props ? BANDS.props : BANDS.examples);
      }}
      value={band}
    >
      {children}
      <PageTabs {...(parts === undefined ? {} : { parts: parts.length })} scenes={scenes.length} />
      <Tabs.Content as={Page.Body} value={BANDS.examples}>
        <Body entry={entry} framed={framed} imports={imports} scenes={scenes} />
      </Tabs.Content>
      <Tabs.Content as={Page.Body} value={BANDS.props}>
        {band === BANDS.props ? <PropsBody failure={failure} parts={parts} /> : null}
      </Tabs.Content>
      <Sections band={band} parts={parts} scenes={scenes} />
    </Banded>
  );
}
