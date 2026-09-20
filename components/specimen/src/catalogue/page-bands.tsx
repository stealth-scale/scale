/**
 * Draws a page as two bands under the strip that switches between them: the examples, and what the
 * page's parts accept.
 */

import { type ReactElement, useState } from "react";

import { Tabs } from "@stealthscale/component-disclosure";
import { Page } from "@stealthscale/component-screen";

import { type Band, BANDS } from "#catalogue/bands.ts";
import { Body, type Listed } from "#catalogue/page-body.tsx";
import { PropsBody } from "#catalogue/page-props.tsx";
import { Sections } from "#catalogue/page-sections.tsx";
import { PageTabs } from "#catalogue/page-tabs.tsx";
import { type Fragments, type Indexed } from "#catalogue/types.ts";
import { useAnatomy } from "#catalogue/use-anatomy.ts";

/**
 * Runs the strip's machine over the page itself, so every band stays a child of the page's grid.
 */
const Banded = Tabs.Root;

/**
 * Describes what the bands take.
 */
export interface BandsProps {
  /**
   * The head of the page, drawn above the strip.
   */
  readonly children: ReactElement;

  /**
   * The entry the index holds for the page.
   */
  readonly entry: Indexed;

  /**
   * Each scene's source and the components the page imports, or nothing until they are loaded.
   */
  readonly fragments: Fragments | undefined;

  /**
   * The path the application serves the framed page at, or nothing where it serves none.
   */
  readonly framed?: string | undefined;

  /**
   * The scenes, in the order they are on the page.
   */
  readonly scenes: readonly Listed[];
}

/**
 * Draws the page, its strip, and whichever band the strip has open.
 *
 * @remarks
 *   The strip's frame is the page itself, through `as`. A page is a grid of named areas and every
 *   band takes one, so a frame drawn round them as an element of its own leaves each band with no
 *   area to sit in: the rail that lists the scenes fell to the foot of the page under the body it
 *   belongs beside.
 *   Each panel is drawn as the page's body for the same reason, so it carries the tabpanel role
 *   and the body's grid area together.
 *   The band draws the line under the strip and the strip draws none, so the head and the body are
 *   parted once across the whole page rather than twice under two different widths.
 *   The rail lists whichever band is open: the scenes of one, the parts of the other. It is the one
 *   way through a band that runs to a dozen sections either way, and a band without it is a band a
 *   reader scrolls.
 *   The props are loaded while their band is open and not before. The index keeps them behind a
 *   loader because one page's run to tens of kilobytes, and a rail listing a hundred pages would
 *   otherwise carry all of it. Their panel is drawn empty until then, rather than drawn saying it
 *   is still reading: a hidden panel that says so is a line every reading of the page carries and
 *   nobody ever sees.
 * @param props - The head of the page, the entry, the sources, and the scenes.
 * @returns The page, its strip, and the open band.
 */
export function Bands({ children, entry, fragments, framed, scenes }: BandsProps): ReactElement {
  const [band, setBand] = useState<Band>(BANDS.examples);
  const { parts } = useAnatomy(entry, band === BANDS.props);

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
        <Body entry={entry} fragments={fragments} framed={framed} scenes={scenes} />
      </Tabs.Content>
      <Tabs.Content as={Page.Body} value={BANDS.props}>
        {band === BANDS.props ? <PropsBody parts={parts} /> : null}
      </Tabs.Content>
      <Sections band={band} parts={parts} scenes={scenes} />
    </Banded>
  );
}
