import { type ReactElement } from "react";

import { Frame, Grid } from "#heat/grid.ts";
import { type Places, useWalk, type WalkOptions } from "#heat/walk.ts";

/**
 * Places of the fixture's grid: a row of three cells over a row whose middle place has no cell.
 */
export const PLACES: Places = [
  ["a1", "a2", "a3"],
  ["b1", undefined, "b3"],
];

/**
 * Renders a grid whose cells take the walk's props, a header with a button outside the cells, the
 * key of the cell the readout shows, and a button after the grid.
 */
// eslint-disable-next-line react/only-export-components -- the hook runs in a component, and fast refresh never loads a fixture
function Walked(props: { readonly options: WalkOptions; readonly places: Places }): ReactElement {
  const walk = useWalk(props.places, props.options);

  return (
    <Frame>
      <Grid aria-label="Cells" {...walk.handlers}>
        <thead>
          <tr>
            <th>
              Header <button type="button">Sort</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {props.places.map((line) => (
            <tr key={line.join()}>
              {line.map((key) =>
                key === undefined ? (
                  <td aria-label="gap" key="gap" />
                ) : (
                  <td key={key} {...walk.cellOf(key)}>
                    {key}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </Grid>
      <output>{walk.shown ?? "none"}</output>
      <button type="button">outside</button>
    </Frame>
  );
}

/**
 * Renders the walked grid.
 *
 * @param options - The cell to start at and the selection's handler.
 * @param places - The grid's cells.
 */
export function walkedGrid(options: WalkOptions = {}, places: Places = PLACES): ReactElement {
  return <Walked options={options} places={places} />;
}
