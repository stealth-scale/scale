/**
 * Serves the lazy example's shared drive: the folders and the file at its top, and the items of a
 * folder, which the "server" returns after the delay a network adds the first time the folder
 * opens.
 */

import { useRef, useState } from "react";

import { type DataTableOptions, type ExpandedState } from "#data-table/index.ts";

import { DELAY } from "./server.ts";

/**
 * Describes the key of an item's name, the word its name is written under.
 */
export type Name =
  | "archive"
  | "contracts"
  | "hotels"
  | "invoices"
  | "meals"
  | "october"
  | "q1"
  | "q2"
  | "q3"
  | "readme"
  | "receipts"
  | "september"
  | "template"
  | "trains"
  | "travel";

/**
 * Describes one item of the drive: a folder or a file.
 */
export interface Item {
  /**
   * Items a folder contains, once the server has returned them.
   */
  readonly items?: readonly Item[];

  /**
   * Whether the item is a folder, which opens, or a file.
   */
  readonly kind: "file" | "folder";

  /**
   * Key of the item's name.
   */
  readonly name: Name;

  /**
   * Path of the item on the drive, unique across the drive.
   */
  readonly path: string;

  /**
   * Size in bytes. A folder's size is the size of everything under it.
   */
  readonly size: number;
}

/**
 * Describes the drive the example renders: its items, the open folders and the handler that opens
 * and closes them.
 */
export interface Drive {
  /**
   * Open folders, by path.
   */
  readonly expanded: ExpandedState;

  /**
   * Items at the drive's top, with the items of every folder the server has returned.
   */
  readonly items: readonly Item[];

  /**
   * Opens and closes folders, and asks the server for the items of a folder the first time it
   * opens.
   */
  readonly onExpandedChange: NonNullable<DataTableOptions<Item>["onExpandedChange"]>;
}

/**
 * Returns a folder under the path of its parent.
 */
function folder(parent: string, name: Name, size: number): Item {
  return { kind: "folder", name, path: `${parent}/${name}`, size };
}

/**
 * Returns a file under the path of its parent.
 */
function file(parent: string, name: Name, size: number): Item {
  return { kind: "file", name, path: `${parent}/${name}`, size };
}

/**
 * Lists the items at the drive's top.
 */
export const ROOT: readonly Item[] = [
  folder("", "contracts", 4_812_000),
  folder("", "invoices", 2_310_400),
  folder("", "receipts", 1_204_800),
  file("", "readme", 2048),
];

/**
 * Lists the items of each folder, by the folder's path.
 */
const CONTENTS: ReadonlyMap<string, readonly Item[]> = new Map([
  [
    "/contracts",
    [
      folder("/contracts", "archive", 3_120_000),
      file("/contracts", "template", 184_000),
      file("/contracts", "q3", 1_508_000),
    ],
  ],
  [
    "/contracts/archive",
    [file("/contracts/archive", "q1", 1_480_000), file("/contracts/archive", "q2", 1_640_000)],
  ],
  [
    "/invoices",
    [file("/invoices", "september", 1_120_300), file("/invoices", "october", 1_190_100)],
  ],
  ["/receipts", [folder("/receipts", "travel", 804_600), file("/receipts", "meals", 400_200)]],
  [
    "/receipts/travel",
    [file("/receipts/travel", "trains", 312_400), file("/receipts/travel", "hotels", 492_200)],
  ],
]);

/**
 * Returns the items of the folder at a path.
 *
 * @param path - The folder's path.
 * @returns The folder's items, or none for a path without a folder.
 */
export function contentsOf(path: string): readonly Item[] {
  return CONTENTS.get(path) ?? [];
}

/**
 * Returns the drive with the items of the folder at a path in place, wherever the folder is.
 *
 * @param items - The items at the drive's top.
 * @param path - The folder's path.
 * @param contents - The folder's items.
 * @returns The items, each folder on the way to the path a new object.
 */
export function withItems(
  items: readonly Item[],
  path: string,
  contents: readonly Item[],
): readonly Item[] {
  return items.map((item) => {
    if (item.path === path) return { ...item, items: contents };

    return item.items === undefined
      ? item
      : { ...item, items: withItems(item.items, path, contents) };
  });
}

/**
 * Returns the drive, and asks the server for a folder's items the first time the folder opens.
 *
 * @returns The items, the open folders and the handler that opens and closes them.
 */
export function useDrive(): Drive {
  const [items, setItems] = useState(ROOT);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const requested = useRef(new Set<string>());

  return {
    expanded,
    items,
    onExpandedChange: (updater) => {
      const next = typeof updater === "function" ? updater(expanded) : updater;

      setExpanded(next);

      for (const path of Object.keys(next)) {
        if (requested.current.has(path)) continue;

        requested.current.add(path);
        setTimeout(() => {
          setItems((current) => withItems(current, path, contentsOf(path)));
        }, DELAY);
      }
    },
  };
}
