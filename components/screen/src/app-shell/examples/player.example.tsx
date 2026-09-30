import { type ReactElement, useId } from "react";

import {
  LibraryIcon,
  ListMusicIcon,
  MenuIcon,
  PauseIcon,
  RadioIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from "lucide-react";

import { IconButton } from "@stealthscale/component-actions";
import { Table } from "@stealthscale/component-collections";
import { Progress } from "@stealthscale/component-feedback";
import { Stack } from "@stealthscale/component-layout";
import { NavList } from "@stealthscale/component-navigation";
import { Heading, Span, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as AppShell from "#app-shell/index.ts";
import * as Sidebar from "#sidebar/index.ts";
import * as Toolbar from "#toolbar/index.ts";

const PLACES = [
  ["library", LibraryIcon, "page"],
  ["playlists", ListMusicIcon, undefined],
  ["radio", RadioIcon, undefined],
] as const;

const TRACKS = [
  ["Northern Lights", "Halden Quartet", "4:05"],
  ["Tidewater", "Mara Okafor", "3:41"],
  ["Slow Harbour", "The Ledger Band", "5:12"],
  ["Paper Kites", "Jonas Berg", "2:58"],
  ["Ember and Ash", "Halden Quartet", "4:27"],
  ["Glasswork", "Lantern", "3:33"],
  ["Low Tide", "Mara Okafor", "4:49"],
  ["Coastline", "Pebble", "3:15"],
  ["Night Shift", "The Ledger Band", "6:02"],
  ["Quiet Hours", "Lantern", "4:11"],
  ["First Light", "Jonas Berg", "3:07"],
  ["Driftwood", "Pebble", "5:36"],
] as const;

const CONTROLS = [
  ["previous", SkipBackIcon],
  ["pause", PauseIcon],
  ["next", SkipForwardIcon],
] as const;

export function Player(props: AppShell.RootProps): ReactElement {
  const { t } = useWords("app-shell");
  const library = useId();

  return (
    <AppShell.Root scroll="window" {...props}>
      <AppShell.Header sticky>
        <Toolbar.Root aria-label={t("tracks")} size="sm">
          <Toolbar.Start>
            <Toolbar.Item aria-label={t("navigation")} as={AppShell.Trigger} shape="square">
              <MenuIcon />
            </Toolbar.Item>
            <Text as="span" size="sm" weight="semibold">
              {t("tracks")}
            </Text>
          </Toolbar.Start>
        </Toolbar.Root>
      </AppShell.Header>
      <AppShell.Body>
        <AppShell.Navbar foldsBelow="sm" width="11rem">
          <Sidebar.Root variant="subtle">
            <Sidebar.Content>
              <Sidebar.Nav aria-label={t("tracks")}>
                <NavList.Root>
                  {PLACES.map(([place, Glyph, current]) => (
                    <NavList.Item key={place}>
                      <NavList.Link aria-current={current} href={`#${place}`}>
                        <Glyph />
                        <span>{t(place)}</span>
                      </NavList.Link>
                    </NavList.Item>
                  ))}
                </NavList.Root>
              </Sidebar.Nav>
            </Sidebar.Content>
          </Sidebar.Root>
        </AppShell.Navbar>
        <AppShell.Main>
          <AppShell.Section>
            <Heading as="h2" id={library} size="sm">
              {t("library")}
            </Heading>
            <Table.Scroller aria-labelledby={library} size="sm">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    {["trackTitle", "artist", "length"].map((column) => (
                      <Table.ColumnHeader key={column}>{t(column)}</Table.ColumnHeader>
                    ))}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {TRACKS.map(([title, artist, length]) => (
                    <Table.Row key={title}>
                      <Table.RowHeader>{title}</Table.RowHeader>
                      <Table.Cell>{artist}</Table.Cell>
                      <Table.Cell>{length}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.Scroller>
          </AppShell.Section>
        </AppShell.Main>
      </AppShell.Body>
      <AppShell.Footer sticky>
        <Stack gap="xs">
          <Progress.Root max={245} size="xs" value={161}>
            <Progress.Track aria-label={t("position")} aria-valuetext={t("played")}>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
          <Toolbar.Root aria-label={t("playback")} size="sm">
            <Toolbar.Start>
              {CONTROLS.map(([control, Glyph]) => (
                <Toolbar.Item aria-label={t(control)} as={IconButton} key={control} variant="ghost">
                  <Glyph />
                </Toolbar.Item>
              ))}
            </Toolbar.Start>
            <Toolbar.Center>
              <Text as="span" size="sm">
                <Span weight="semibold">{TRACKS[0][0]}</Span>{" "}
                <Span tone="muted">{TRACKS[0][1]}</Span>
              </Text>
            </Toolbar.Center>
            <Toolbar.End>
              <Text as="span" size="sm" tone="muted">
                {t("time")}
              </Text>
            </Toolbar.End>
          </Toolbar.Root>
        </Stack>
      </AppShell.Footer>
    </AppShell.Root>
  );
}
