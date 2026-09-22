/**
 * Shows the listbox: every look at every size, how a picked row is marked, the three ways a set is
 * picked, a whole list turned on at once, a set held from outside, groups, a row nobody can pick, a
 * mark before a name, a line under one, what is picked written outside, rows running across, tiles
 * in columns, the list behind a trigger, ten thousand rows, and a list narrowed by a field.
 *
 * @remarks
 *   The axis scenes are generated from the recipe, so a value added to it reaches the page without
 *   this file changing. Every scene draws `Listbox.Simple`, which is what a caller reaches for.
 *   Ten scenes are written by hand, because each turns something the recipe declares no axis for:
 *   how a set is picked, a whole list turned on at once, a set held from outside, what a row holds
 *   beside its name, groups, a locked row, a summary, the list behind a trigger, ten thousand rows,
 *   and a narrowing field.
 *   Every list holds the same four clients and starts with one row already picked, because a mark
 *   nobody can see says nothing about how the mark is drawn.
 *   A list of one takes a check at the end of the picked row. A list of several takes a box at the
 *   start of every row, which says the list is one a reader may take several from before they
 *   touch it.
 *   The marks are Lucide's, which this package takes for its specimens alone. The words are keys
 *   under `listbox` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/listbox.json`.
 */

import { type ReactElement, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { CheckIcon, LandmarkIcon, MinusIcon, XIcon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Popover } from "@stealthscale/component-disclosure";
import { Group, Stack } from "@stealthscale/component-layout";
import {
  Board,
  Matrix,
  Room,
  Sample,
  type Scene,
  scenesOf,
  specimen,
  useWords,
} from "@stealthscale/specimen";

import { useFilter, useGridCollection, useListCollection } from "#collection/index.ts";
import * as Listbox from "#listbox/index.ts";
import { recipe } from "#listbox/recipe.ts";

/**
 * Describes what a generated scene hands its drawing, which is every axis the recipe offers.
 */
type Drawn = Omit<Listbox.SimpleProps<Client>, "collection">;

/**
 * The call site every generated scene's source snippet is built from.
 */
const SAMPLE = {
  imports: 'import { Listbox } from "@stealthscale/component-collections";',
  name: "Listbox.Simple",
};

/**
 * The three ways a list is picked from.
 */
const MODES = ["single", "multiple", "extended"] as const;

/**
 * The keys of the four clients every list holds.
 */
const CLIENTS = ["fathom", "lantern", "pebble", "quartz"] as const;

/**
 * The row every list starts with already picked.
 */
const PICKED = ["fathom"];

/**
 * The client no list lets a reader pick, for the scene that shows one.
 */
const LOCKED = "quartz";

/**
 * The look the controls beside a list take, set once above them.
 */
const OUTLINED = { variant: "outline" } as const;

/**
 * Which heading each client is gathered under, for the scene that draws groups.
 */
const GROUPS: Readonly<Record<string, string>> = {
  fathom: "held",
  lantern: "held",
  pebble: "closed",
  quartz: "closed",
};

/**
 * Describes one client of the list.
 */
interface Client {
  /**
   * The key the client's name is read under. A port names itself, so the grid of tiles uses the
   * same shape with the name as the key.
   */
  readonly id: string;

  /**
   * The client's name, in the reader's language.
   */
  readonly name: string;
}

/**
 * Describes what a scene asks the shared list to draw beyond its variants.
 */
interface ListProps {
  /**
   * Whether the list goes without a label of its own, for a panel that is named by what opened it.
   */
  readonly bare?: boolean | undefined;

  /**
   * Whether a line of explanation sits under each name.
   */
  readonly explained?: boolean | undefined;

  /**
   * Whether the rows are gathered under headings.
   */
  readonly grouped?: boolean | undefined;

  /**
   * Whether a mark sits before each name saying what kind of thing it is.
   */
  readonly iconic?: boolean | undefined;

  /**
   * Whether one row is drawn as a row a reader cannot pick.
   */
  readonly locked?: boolean | undefined;

  /**
   * Whether the list is narrowed from a field above it.
   */
  readonly narrowed?: boolean | undefined;

  /**
   * Whether what the list holds is written under it.
   */
  readonly summarised?: boolean | undefined;

  /**
   * Whether a row above the rest turns the whole list on.
   */
  readonly whole?: boolean | undefined;
}

/**
 * Draws the mark that says what kind of thing a row is.
 */
function kindOf(): ReactElement {
  return <LandmarkIcon aria-hidden size="1em" />;
}

/**
 * Builds the collection of clients in the reader's language.
 */
function useClients(locked = false): ReturnType<typeof useListCollection<Client>> {
  const { t } = useWords("listbox");
  const filter = useFilter();

  return useListCollection<Client>({
    filter: filter.contains,
    isItemDisabled: (client) => locked && client.id === LOCKED,
    itemToString: (client) => client.name,
    itemToValue: (client) => client.id,
    rows: CLIENTS.map((id) => ({ id, name: t(id) })),
  });
}

/**
 * Draws the list of clients, with whatever the scene asked for above and below its rows.
 *
 * @param props - What the list shows beyond its rows, and everything the list itself takes.
 * @returns The list.
 */
function Clients({
  bare,
  explained,
  grouped,
  iconic,
  locked,
  narrowed,
  summarised,
  whole,
  ...rest
}: ListProps & Omit<Listbox.SimpleProps<Client>, "collection">): ReactElement {
  const { t } = useWords("listbox");
  const { collection, narrow } = useClients(locked === true);

  return (
    <Listbox.Simple<Client>
      aria-label={t("clients")}
      collection={collection}
      defaultValue={PICKED}
      empty={t("nothing")}
      mark={<CheckIcon size="100%" />}
      mixedMark={<MinusIcon size="100%" />}
      {...(bare === true ? {} : { label: t("clients") })}
      {...(explained === true ? { description: (client) => t(`${client.id}Of`) } : {})}
      {...(iconic === true ? { icon: kindOf } : {})}
      {...(grouped === true ? { groupBy: (client) => GROUPS[client.id] ?? "", groupLabel: t } : {})}
      {...(summarised === true ? { summary: t("nothing") } : {})}
      {...(whole === true ? { selectAll: t("all") } : {})}
      {...(narrowed === true
        ? {
            narrowing: {
              clearIndicator: <XIcon size="100%" />,
              clearLabel: t("clear"),
              onNarrow: narrow,
              placeholder: t("filter"),
            },
          }
        : {})}
      {...rest}
    />
  );
}

/**
 * Draws the list as the page's own drawing: rows, a label, and two of them already picked.
 */
function Listed(props: Drawn): ReactElement {
  return <Clients {...props} />;
}

/**
 * Draws the list on a surface, which is what an axis needs to have something to draw on.
 *
 * @remarks
 *   The plain look draws no box, so a corner, a highlight or the mark on a picked row has no ground
 *   to show against. The look scene is the one that turns the look itself.
 */
function Raised(props: Drawn): ReactElement {
  return <Clients variant="surface" {...props} />;
}

/**
 * Draws the three ways a set is picked, boxed where the set may hold several.
 */
function Modes(): ReactElement {
  return (
    <Matrix knob="selectionMode" of={MODES}>
      {(selectionMode) => (
        <Clients
          boxed={selectionMode === "extended"}
          selectionMode={selectionMode}
          variant="surface"
        />
      )}
    </Matrix>
  );
}

/**
 * Draws the rows running along a line or down one, each with a line of explanation.
 *
 * @remarks
 *   The room is stated because a row of rows takes whatever width it is given, and the line under
 *   each name is what shows a row keeping its own measure as the list turns.
 */
function Turned(props: Drawn): ReactElement {
  return (
    <Room size="sm">
      <Clients explained variant="surface" {...props} />
    </Room>
  );
}

/**
 * Draws a row with a mark before its name beside one with a line under it.
 */
function Rows(): ReactElement {
  return (
    <Board>
      <Sample of="an icon">
        <Clients iconic variant="surface" />
      </Sample>
      <Sample of="a line of explanation">
        <Clients explained variant="surface" />
      </Sample>
    </Board>
  );
}

/**
 * Draws a list whose whole set is turned on from a row above it.
 */
function Whole(): ReactElement {
  return (
    <Room size="xs">
      <Clients boxed selectionMode="multiple" summarised variant="surface" whole />
    </Room>
  );
}

/**
 * Draws a list whose picked set is held outside it, with two controls writing to that set.
 */
function Held(): ReactElement {
  const { t } = useWords("listbox");
  const [picked, setPicked] = useState<string[]>(PICKED);

  return (
    <Room size="xs">
      <Stack align="flex-start" gap="md">
        <Clients
          boxed
          onValueChange={(next) => {
            setPicked(next.value);
          }}
          selectionMode="multiple"
          value={picked}
          variant="surface"
        />
        <Group attached>
          <Button
            onClick={() => {
              setPicked([...CLIENTS]);
            }}
            size="sm"
            variant="outline"
          >
            {t("takeAll")}
          </Button>
          <Button
            onClick={() => {
              setPicked([]);
            }}
            size="sm"
            variant="outline"
          >
            {t("takeNone")}
          </Button>
        </Group>
      </Stack>
    </Room>
  );
}

/**
 * Draws rows gathered under headings.
 */
function Grouped(): ReactElement {
  return (
    <Room size="xs">
      <Clients grouped variant="surface" />
    </Room>
  );
}

/**
 * Draws a list holding one row nobody can pick.
 */
function Locked(): ReactElement {
  return (
    <Room size="xs">
      <Clients locked variant="surface" />
    </Room>
  );
}

/**
 * Draws what the list holds, written under it.
 */
function Summarised(): ReactElement {
  return (
    <Room size="xs">
      <Clients boxed selectionMode="multiple" summarised variant="surface" />
    </Room>
  );
}

/**
 * The ports the grid of tiles draws.
 */
const PORTS = [
  "NLRTM",
  "DEHAM",
  "BEANR",
  "FRLEH",
  "GBFXT",
  "ESVLC",
  "ITGOA",
  "PLGDN",
  "SEGOT",
  "DKAAR",
  "NOOSL",
  "FIHEL",
];

/**
 * How many columns a grid of tiles runs in where the scene states no count.
 */
const COLUMNS = "4";

/**
 * Draws tiles in columns, which all four arrows cross.
 *
 * @remarks
 *   The collection and the recipe are told the same count, because the arrows reach a tile's
 *   neighbours through the collection and a reader sees them through the recipe. A count told to
 *   one and not the other is a grid whose arrows walk somewhere the eye does not.
 */
function Tiles({ columns = COLUMNS, ...rest }: Drawn): ReactElement {
  const { t } = useWords("listbox");
  const { collection } = useGridCollection<Client>({
    columnCount: Number(columns),
    itemToString: (port) => port.name,
    itemToValue: (port) => port.id,
    rows: PORTS.map((id) => ({ id, name: id })),
  });

  return (
    <Room size="md">
      <Listbox.Simple<Client>
        boxed
        collection={collection}
        columns={columns}
        defaultValue={PORTS.slice(0, 2)}
        label={t("ports")}
        mark={<CheckIcon size="100%" />}
        selectionMode="multiple"
        variant="surface"
        {...rest}
      />
    </Room>
  );
}

/**
 * Draws the same list inside a popover, for a page with no room to hold it open.
 *
 * @remarks
 *   The panel goes through a portal, because the card a scene stands on clips what it holds and a
 *   panel that opened inside it would be cut at the card's edge. The popover's positioner is the
 *   part to wrap, which is what its own documentation asks for.
 *   The list inside carries no label and no surface of its own. The panel is already a raised box
 *   named by the trigger that opened it, and a list that raised itself again would draw a second
 *   border a step inside the first.
 *   The panel takes the smallest inset it offers, because the list inside already leaves room round
 *   its rows and the two insets together pushed a row's words a third of the way across the panel.
 */
function Triggered(): ReactElement {
  const { t } = useWords("listbox");

  return (
    <Popover.Root size="xs">
      <Room size="xs">
        <ButtonPropsProvider value={OUTLINED}>
          <Popover.Trigger as={Button}>{t("pick")}</Popover.Trigger>
        </ButtonPropsProvider>
      </Room>
      {createPortal(
        <Popover.Positioner>
          <Popover.Content>
            <Clients bare />
          </Popover.Content>
        </Popover.Positioner>,
        document.body,
      )}
    </Popover.Root>
  );
}

/**
 * How many consignments the long list holds.
 */
const MANY = 10_000;

/**
 * Draws a list of ten thousand rows, of which about twenty are in the document.
 */
function Many(): ReactElement {
  const { t } = useWords("listbox");
  const rows = useMemo(
    () =>
      Array.from({ length: MANY }, (_, at) => ({
        id: String(at),
        name: t("consignment", { at: String(at + 1).padStart(5, "0") }),
      })),
    [t],
  );
  const { collection } = useListCollection<Client>({
    itemToString: (held) => held.name,
    itemToValue: (held) => held.id,
    rows,
  });

  return (
    <Room size="xs">
      <Listbox.Simple<Client>
        collection={collection}
        label={t("consignments", { count: MANY.toLocaleString("en") })}
        mark={<CheckIcon size="100%" />}
        tall={8}
        variant="surface"
      />
    </Room>
  );
}

/**
 * Draws the list narrowed from a field.
 */
function Narrowing(): ReactElement {
  return (
    <Room size="xs">
      <Clients narrowed variant="surface" />
    </Room>
  );
}

/**
 * One row, several, or several the way a file manager does it.
 */
export const modes: Scene = {
  about: "listbox.modes.about",
  draw: Modes,
  title: "listbox.modes.title",
};

/**
 * What a row holds beside its name.
 */
export const rows: Scene = {
  about: "listbox.rows.about",
  draw: Rows,
  title: "listbox.rows.title",
};

/**
 * A whole list turned on from a row above it.
 */
export const whole: Scene = {
  about: "listbox.whole.about",
  draw: Whole,
  title: "listbox.whole.title",
};

/**
 * A picked set held outside the list.
 */
export const outside: Scene = {
  about: "listbox.outside.about",
  draw: Held,
  title: "listbox.outside.title",
};

/**
 * Rows gathered under headings.
 */
export const grouped: Scene = {
  about: "listbox.grouped.about",
  draw: Grouped,
  title: "listbox.grouped.title",
};

/**
 * A row nobody can pick.
 */
export const locked: Scene = {
  about: "listbox.locked.about",
  draw: Locked,
  title: "listbox.locked.title",
};

/**
 * What is picked, written outside the list.
 */
export const summarised: Scene = {
  about: "listbox.summarised.about",
  draw: Summarised,
  title: "listbox.summarised.title",
};

/**
 * The list inside a popover.
 */
export const triggered: Scene = {
  about: "listbox.triggered.about",
  draw: Triggered,
  title: "listbox.triggered.title",
};

/**
 * Ten thousand rows, of which about twenty are drawn.
 */
export const many: Scene = {
  about: "listbox.many.about",
  draw: Many,
  title: "listbox.many.title",
};

/**
 * The list narrowed by a field.
 */
export const narrowing: Scene = {
  about: "listbox.narrowing.about",
  draw: Narrowing,
  title: "listbox.narrowing.title",
};

export default specimen({
  about: "listbox.about",
  id: "components/collections/listbox",
  imports: 'import { Listbox } from "@stealthscale/component-collections";',
  scenes: [
    ...scenesOf<Drawn>(recipe, {
      axes: {
        columns: { direction: "column", draw: (props) => <Tiles {...props} /> },
        highlight: { draw: (props) => <Raised {...props} /> },
        orientation: { direction: "column", draw: (props) => <Turned {...props} /> },
        radius: { draw: (props) => <Raised {...props} /> },
        selected: { draw: (props) => <Raised {...props} /> },
        variant: { across: "size" },
      },
      draw: (props) => <Listed {...props} />,
      namespace: "listbox",
      order: ["variant", "selected", "highlight", "radius", "orientation", "columns"],
      sample: SAMPLE,
    }),
    modes,
    whole,
    outside,
    rows,
    grouped,
    locked,
    summarised,
    triggered,
    many,
    narrowing,
  ],
  title: "listbox.title",
});
