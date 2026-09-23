/**
 * Lays out the catalogue page for the portal.
 *
 * @remarks
 *   The portal ships no recipe at all: it moves nodes and draws nothing. There is no axis to
 *   generate a scene from and no recipe specification to ask what this page covers, so the one
 *   scene is written by hand and stays that way.
 *   The scene is driven by the reader rather than drawn twice, because what a portal does is
 *   invisible in a still picture: a tile inside a panel looks the same whether the tree put it
 *   there or a portal did. Pressing a control moves the tile between the two panels and back to
 *   where it is written, while the line that writes it never moves.
 *   Each destination is a panel kept in state, because a portal needs a real element and an
 *   element only exists once it has mounted. The text comes from keys under `portal` in the
 *   catalogue namespace, held beside this file in `locales/en/specimen/portal.json`.
 */

import { type ReactElement, useState } from "react";

import { Button } from "@stealthscale/component-actions";
import { Group, Stack } from "@stealthscale/component-layout";
import { type Scene, specimen, Tile, useWords } from "@stealthscale/specimen";

import { Portal } from "#portal/portal.ts";

/**
 * The places the reader can send the tile, in the order the controls offer them.
 */
const PLACES = ["here", "first", "second"] as const;

/**
 * Names one of the places the tile can be drawn.
 */
type Place = (typeof PLACES)[number];

/**
 * Describes what one destination panel takes: its name, and where to hand back its drop target.
 */
interface PanelProps {
  /**
   * Called with the element the portal draws into, which is empty until a tile lands in it.
   */
  readonly hold: (node: HTMLDivElement | null) => void;

  /**
   * The words naming the panel.
   */
  readonly label: string;
}

/**
 * Renders one destination: a named panel holding an empty element for a portal to draw into.
 *
 * @remarks
 *   The drop target is written as a child of the panel rather than being the panel itself. React
 *   refuses to portal into an element it already draws text into, because the two sets of children
 *   would then be ambiguous.
 */
function Panel({ hold, label }: PanelProps): ReactElement {
  return (
    <Tile>
      <Stack gap="sm">
        <span>{label}</span>
        <div ref={hold} />
      </Stack>
    </Tile>
  );
}

/**
 * Renders two panels, a control per destination, and one tile the controls move between them.
 */
function Placing(): ReactElement {
  const { t } = useWords("portal");
  const [first, setFirst] = useState<HTMLDivElement | null>(null);
  const [second, setSecond] = useState<HTMLDivElement | null>(null);
  const [place, setPlace] = useState<Place>("first");

  return (
    <Stack gap="md">
      <Group attached>
        {PLACES.map((choice) => (
          <Button
            aria-pressed={choice === place}
            key={choice}
            onClick={() => {
              setPlace(choice);
            }}
            variant={choice === place ? "solid" : "outline"}
          >
            {t(`places.${choice}`)}
          </Button>
        ))}
      </Group>
      <Stack direction="row" gap="md">
        <Panel hold={setFirst} label={t("panels.first")} />
        <Panel hold={setSecond} label={t("panels.second")} />
      </Stack>
      <Portal container={place === "second" ? second : first} disabled={place === "here"}>
        <Tile>{t("tile")}</Tile>
      </Portal>
    </Stack>
  );
}

/**
 * The scene moving one tile between two panels and the place it is written.
 */
export const placing: Scene = {
  about: "portal.placing.about",
  draw: Placing,
  title: "portal.placing.title",
};

export default specimen({
  about: "portal.about",
  id: "components/primitives/portal",
  imports: 'import { Portal } from "@stealthscale/component-primitives";',
  scenes: [placing],
  title: "portal.title",
});
