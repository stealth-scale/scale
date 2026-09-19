/**
 * Shows the listbox: every look at every size, every highlight, every corner, and a list narrowed
 * from a field picking one row or many.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every list holds the same four clients, built into a collection the way a
 *   page builds one. The words are keys under `listbox` in the catalogue's namespace, kept beside
 *   this file in `locales/en/specimen/listbox.json`.
 */

import { type ReactElement } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import { useFilter, useListCollection } from "#collection/index.ts";
import * as Listbox from "#listbox/index.ts";
import { recipe } from "#listbox/recipe.ts";

/**
 * The two ways a list is picked from.
 */
const MODES = ["single", "multiple"] as const;

/**
 * The keys of the four clients every list holds.
 */
const CLIENTS = ["fathom", "lantern", "pebble", "quartz"] as const;

/**
 * Describes one client of the list.
 */
interface Client {
  /**
   * The key the client's name is read under.
   */
  readonly id: (typeof CLIENTS)[number];

  /**
   * The client's name, in the reader's language.
   */
  readonly name: string;
}

/**
 * Describes what a list takes beyond its variants.
 */
interface ListProps {
  /**
   * Whether the list is narrowed from a field above it.
   */
  readonly narrowed?: boolean;

  /**
   * Whether one row is picked or many.
   */
  readonly selectionMode?: (typeof MODES)[number];
}

/**
 * Builds the collection of clients in the reader's language.
 */
function useClients(): ReturnType<typeof useListCollection<Client>> {
  const { t } = useWords("listbox");
  const filter = useFilter();

  return useListCollection<Client>({
    filter: filter.contains,
    itemToString: (client) => client.name,
    itemToValue: (client) => client.id,
    rows: CLIENTS.map((id) => ({ id, name: t(id) })),
  });
}

/**
 * Draws the list of clients under its label, with a field above it where asked.
 */
function Clients({
  narrowed = false,
  selectionMode = "single",
  ...rest
}: ListProps & Omit<Listbox.RootProps, "collection" | "selectionMode">): ReactElement {
  const { t } = useWords("listbox");
  const { collection, narrow } = useClients();

  return (
    <Listbox.Root collection={collection} selectionMode={selectionMode} {...rest}>
      <Listbox.Label>{t("clients")}</Listbox.Label>
      {narrowed ? (
        <Listbox.Input
          onChange={(event) => {
            narrow(event.target.value);
          }}
        />
      ) : null}
      <Listbox.Content>
        {collection.items.map((client) => (
          <Listbox.Item item={client} key={client.id}>
            <Listbox.ItemText item={client}>{client.name}</Listbox.ItemText>
            <Listbox.ItemIndicator item={client} />
          </Listbox.Item>
        ))}
      </Listbox.Content>
    </Listbox.Root>
  );
}

/**
 * Draws the list in every look at every size.
 */
function Looks(): ReactElement {
  return (
    <Matrix
      across={{ knob: "size", of: valuesOf(recipe, "size") }}
      knob="variant"
      of={valuesOf(recipe, "variant")}
    >
      {(variant, size) => <Clients size={size} variant={variant} />}
    </Matrix>
  );
}

/**
 * Draws the list with every highlight.
 */
function Highlights(): ReactElement {
  return (
    <Matrix knob="highlight" of={valuesOf(recipe, "highlight")}>
      {(highlight) => <Clients highlight={highlight} variant="surface" />}
    </Matrix>
  );
}

/**
 * Draws the list at every corner.
 */
function Corners(): ReactElement {
  return (
    <Matrix knob="radius" of={valuesOf(recipe, "radius")}>
      {(radius) => <Clients radius={radius} variant="surface" />}
    </Matrix>
  );
}

/**
 * Draws the list narrowed from a field, picking one row and many.
 */
function Narrowing(): ReactElement {
  return (
    <Matrix knob="selectionMode" of={MODES}>
      {(selectionMode) => <Clients narrowed selectionMode={selectionMode} variant="surface" />}
    </Matrix>
  );
}

/**
 * Every look at every size.
 */
export const looks: Scene = {
  about: "listbox.looks.about",
  draw: Looks,
  title: "listbox.looks.title",
};

/**
 * Every highlight.
 */
export const highlights: Scene = {
  about: "listbox.highlights.about",
  draw: Highlights,
  title: "listbox.highlights.title",
};

/**
 * Every corner.
 */
export const corners: Scene = {
  about: "listbox.corners.about",
  draw: Corners,
  title: "listbox.corners.title",
};

/**
 * Narrowed, picking one row and many.
 */
export const narrowing: Scene = {
  about: "listbox.narrowing.about",
  draw: Narrowing,
  title: "listbox.narrowing.title",
};

export default specimen({
  about: "listbox.about",
  group: "Collections",
  id: "collections/listbox",
  scenes: [looks, highlights, corners, narrowing],
  title: "listbox.title",
});
