/**
 * Catalogue page for the status matrix.
 *
 * @remarks
 *   `scenesOf` generates the size scene from the health example. The gap, picking, flat and empty
 *   scenes are hand-written, because each needs its own rows and cells. The picking scene moves a
 *   pointer onto one crossing after it mounts, so the crosshair shows in a still image. Every scene
 *   renders a component from `examples/` and shows that file as its source. The words are keys
 *   under `status-matrix` in `locales/en/specimen/status-matrix.json`.
 */

import { type ReactElement, type ReactNode, useEffect, useState } from "react";

import { type Scene, scenesOf, specimen } from "@stealthscale/specimen";

import * as examples from "#status-matrix/examples/index.ts";
import { type StatusMatrixProps } from "#status-matrix/index.ts";
import { recipe } from "#status-matrix/recipe.ts";

/**
 * Props a generated scene passes to the health example: the recipe's variants.
 */
type Drawn = Pick<StatusMatrixProps, "size">;

/**
 * Describes the crossing a lit scene points at.
 */
interface LitProps {
  /**
   * The matrix to stage.
   */
  readonly children: ReactNode;

  /**
   * `data-column` of the crossing.
   */
  readonly column: string;

  /**
   * `data-row` of the crossing.
   */
  readonly row: string;
}

/**
 * Renders a matrix and dispatches a pointer move onto one crossing after it mounts.
 *
 * @remarks
 *   The event bubbles to the matrix's own handler, so the crosshair lights the crossing's row and
 *   column the way a pointer would. The staging never appears in an example.
 */
function Lit({ children, column, row }: LitProps): ReactElement {
  const [box, setBox] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    box
      ?.querySelector(`td[data-row="${row}"][data-column="${column}"]`)
      ?.dispatchEvent(new PointerEvent("pointermove", { bubbles: true }));
  }, [box, column, row]);

  return <div ref={setBox}>{children}</div>;
}

/**
 * Hand-written scene for a region nobody ran.
 */
export const gapped: Scene = {
  about: "status-matrix.gap.about",
  draw: examples.gapped.Gapped,
  example: examples.gapped,
  title: "status-matrix.gap.title",
};

/**
 * Hand-written scene for a matrix a reader picks crossings from, with the pointer on one.
 */
export const picking: Scene = {
  about: "status-matrix.picking.about",
  draw: () => (
    <Lit column="Reston" row="notifications">
      <examples.queues.Queues />
    </Lit>
  ),
  example: examples.queues,
  title: "status-matrix.picking.title",
};

/**
 * Hand-written scene for rows without sections.
 */
export const flat: Scene = {
  about: "status-matrix.flat.about",
  draw: examples.plumbing.Plumbing,
  example: examples.plumbing,
  title: "status-matrix.flat.title",
};

/**
 * Hand-written scene for a matrix with no rows.
 */
export const empty: Scene = {
  about: "status-matrix.empty.about",
  draw: examples.empty.Empty,
  example: examples.empty,
  title: "status-matrix.empty.title",
};

export default specimen({
  about: "status-matrix.about",
  id: "components/collections/status-matrix",
  imports: 'import { StatusMatrix } from "@stealthscale/component-collections";',
  scenes: [
    ...scenesOf<Drawn>(recipe, {
      axes: { size: { direction: "column" } },
      draw: (props) => <examples.health.Health {...props} />,
      example: examples.health,
      namespace: "status-matrix",
    }),
    gapped,
    picking,
    flat,
    empty,
  ],
  title: "status-matrix.title",
});
