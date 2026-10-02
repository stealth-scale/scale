/**
 * Catalogue page for the transfer.
 *
 * @remarks
 *   `scenesOf` generates the size and palette scenes from the clients example. The palette scene
 *   checks the first row after it mounts, so the palette shows in a still image. The described and
 *   held scenes are hand-written. Every transfer renders in an `lg` room, and every scene shows its
 *   example file as its source. The words are keys under `transfer` in
 *   `locales/en/specimen/transfer.json`.
 */

import { type ReactElement, type ReactNode, useEffect, useState } from "react";

import { Room, type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#transfer/examples/index.ts";
import { type TransferProps } from "#transfer/index.ts";
import { recipe } from "#transfer/recipe.ts";

/**
 * Props a generated scene passes to the clients example: the recipe's variants.
 */
type Drawn = Pick<TransferProps<unknown>, "palette" | "size">;

/**
 * Describes the transfer a picked scene stages.
 */
interface PickedProps {
  /**
   * The transfer to stage.
   */
  readonly children: ReactNode;
}

/**
 * Renders a transfer and checks its first row after it mounts.
 *
 * @remarks
 *   The staging clicks the row only while it is unchecked, so a second run of the effect leaves it
 *   checked. The staging never appears in an example.
 */
function Picked({ children }: PickedProps): ReactElement {
  const [box, setBox] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const first = box?.querySelector<HTMLElement>("[role=option]");

    if (first !== undefined && first !== null && first.getAttribute("aria-selected") !== "true") {
      first.click();
    }
  }, [box]);

  return <div ref={setBox}>{children}</div>;
}

/**
 * Hand-written scene for rows with a second line.
 */
export const described: Scene = {
  about: "transfer.described.about",
  draw: () => (
    <Room size="lg">
      <examples.described.Described />
    </Room>
  ),
  example: examples.described,
  title: "transfer.described.title",
};

/**
 * Hand-written scene for a set the page controls.
 */
export const held: Scene = {
  about: "transfer.held.about",
  draw: () => (
    <Room size="lg">
      <examples.held.Held />
    </Room>
  ),
  example: examples.held,
  title: "transfer.held.title",
};

export default specimen({
  about: "transfer.about",
  id: "components/collections/transfer",
  imports: 'import { Transfer } from "@stealthscale/component-collections";',
  scenes: [
    ...scenesOf<Drawn>(recipe, {
      axes: {
        palette: {
          draw: (props) => (
            <Room size="lg">
              <Picked>
                <examples.clients.Clients {...props} />
              </Picked>
            </Room>
          ),
          example: examples.clients,
        },
        size: { direction: "column" },
      },
      draw: (props) => (
        <Room size="lg">
          <examples.clients.Clients {...props} />
        </Room>
      ),
      example: examples.clients,
      namespace: "transfer",
      order: ["size", "palette"],
    }),
    described,
    held,
  ],
  title: "transfer.title",
});
