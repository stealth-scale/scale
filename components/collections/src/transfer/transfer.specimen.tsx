/**
 * Shows the transfer: rows moving between two lists, a pair whose rows carry a line of explanation,
 * and a set a page holds from outside.
 *
 * @remarks
 *   The size scene is generated from the recipe, so a step added to the theme reaches the page
 *   without this file changing. The other two are written by hand, because a line under each name
 *   and a set held from outside are props a page passes rather than axes of the recipe.
 *   The sizes run down the page, because a pair of lists at two sizes side by side reads as a
 *   comparison of their widths. Every scene holds the same clients, and both sides keep room for
 *   all of them, so the pair stays still as rows cross between them.
 *   The marks are Lucide's, which this package takes for its specimens alone. The words are keys
 *   under `transfer` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/transfer.json`.
 */

import { type ReactElement, useState } from "react";

import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { Room, type Scene, scenesOf, specimen, useWords } from "@stealthscale/specimen";

import { recipe } from "#transfer/recipe.ts";
import { Transfer, type TransferProps } from "#transfer/transfer.tsx";

/**
 * The keys of the clients every scene moves between its lists.
 */
const CLIENTS = ["fathom", "lantern", "pebble", "quartz"] as const;

/**
 * The call site the generated scene's source snippet is built from.
 */
const SAMPLE = {
  imports: 'import { Transfer } from "@stealthscale/component-collections";',
  name: "Transfer",
};

/**
 * Describes one client of the lists.
 */
interface Client {
  /**
   * The key the client's name and its line of explanation are read under.
   */
  readonly id: string;

  /**
   * The client's name, in the reader's language.
   */
  readonly name: string;
}

/**
 * Describes the words every scene hands the pair.
 */
type Names = Pick<
  TransferProps<Client>,
  "giveBackLabel" | "nothing" | "offeredTitle" | "takeLabel" | "takenTitle"
>;

/**
 * Describes what the generated scene hands its drawing, which is the one axis the recipe offers.
 */
type Sized = Pick<TransferProps<Client>, "size">;

/**
 * Reads the words the two controls and the two sides are named by.
 */
function useNames(): Names {
  const { t } = useWords("transfer");

  return {
    giveBackLabel: t("giveBack"),
    nothing: t("nothingHere"),
    offeredTitle: t("available"),
    takeLabel: t("take"),
    takenTitle: t("chosen"),
  };
}

/**
 * Lists the clients in the reader's language.
 */
function useClients(): readonly Client[] {
  const { t } = useWords("transfer");

  return CLIENTS.map((id) => ({ id, name: t(id) }));
}

/**
 * Draws two lists and the pair of controls that move rows between them.
 */
function Moving(props: Sized): ReactElement {
  const rows = useClients();
  const names = useNames();

  return (
    <Room size="lg">
      <Transfer<Client>
        {...names}
        {...props}
        giveBackMark={<ChevronLeftIcon size="100%" />}
        itemToString={(client) => client.name}
        itemToValue={(client) => client.id}
        mark={<CheckIcon size="100%" />}
        rows={rows}
        takeMark={<ChevronRightIcon size="100%" />}
      />
    </Room>
  );
}

/**
 * Draws a transfer whose rows carry a line under the name.
 */
function Explained(): ReactElement {
  const { t } = useWords("transfer");
  const rows = useClients();
  const names = useNames();

  return (
    <Room size="lg">
      <Transfer<Client>
        {...names}
        description={(client) => t(`${client.id}Of`)}
        giveBackMark={<ChevronLeftIcon size="100%" />}
        itemToString={(client) => client.name}
        itemToValue={(client) => client.id}
        mark={<CheckIcon size="100%" />}
        rows={rows}
        takeMark={<ChevronRightIcon size="100%" />}
      />
    </Room>
  );
}

/**
 * Draws a transfer whose set is held outside it, with the set written under the pair.
 */
function Held(): ReactElement {
  const { t } = useWords("transfer");
  const rows = useClients();
  const names = useNames();
  const [taken, setTaken] = useState<readonly string[]>(["fathom"]);

  return (
    <Room size="lg">
      <Stack gap="md">
        <Transfer<Client>
          {...names}
          giveBackMark={<ChevronLeftIcon size="100%" />}
          itemToString={(client) => client.name}
          itemToValue={(client) => client.id}
          mark={<CheckIcon size="100%" />}
          onValueChange={setTaken}
          rows={rows}
          takeMark={<ChevronRightIcon size="100%" />}
          value={taken}
        />
        <span>{taken.length === 0 ? t("nothing") : taken.map((id) => t(id)).join(", ")}</span>
      </Stack>
    </Room>
  );
}

/**
 * Rows carrying a line under the name.
 */
export const explained: Scene = {
  about: "transfer.explained.about",
  draw: Explained,
  title: "transfer.explained.title",
};

/**
 * The set held outside the pair.
 */
export const held: Scene = {
  about: "transfer.held.about",
  draw: Held,
  title: "transfer.held.title",
};

export default specimen({
  about: "transfer.about",
  id: "components/collections/transfer",
  imports: 'import { Transfer } from "@stealthscale/component-collections";',
  scenes: [
    ...scenesOf<Sized>(recipe, {
      axes: { size: { direction: "column" } },
      draw: (props) => <Moving {...props} />,
      namespace: "transfer",
      sample: SAMPLE,
    }),
    explained,
    held,
  ],
  title: "transfer.title",
});
