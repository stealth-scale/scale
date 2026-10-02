/**
 * Renders a palette item: a button that adds one kind of node to the graph, by a drag onto the
 * canvas or by a press.
 *
 * @remarks
 *   The item is the actions `Button`. A drag writes the item's id to the drag's data, and the
 *   canvas's `onDropItem` places the node where the pointer releases it. A press, Enter or Space
 *   calls `onAdd` with the middle of what the canvas shows, so a person without a pointer adds a
 *   node too. The item renders inside `Graph.Root`, whose provider turns the middle of the view
 *   into the graph's coordinates.
 */

import { type ReactElement } from "react";

import { type XYPosition } from "@xyflow/react";

import { Button, type ButtonProps } from "@stealthscale/component-actions";

import { ITEM, useViewCentre } from "#graph/drop.ts";

/**
 * Describes the props of a palette item: the kind of node it adds, what a press does, and the
 * button's props.
 */
export interface PaletteItemProps extends Omit<
  ButtonProps,
  "draggable" | "onClick" | "onDragStart"
> {
  /**
   * Id of the kind of node the item adds, which a drop and a press report.
   */
  readonly item: string;

  /**
   * Called with the item's id and the middle of the view when a person presses the item.
   */
  readonly onAdd: (item: string, position: XYPosition) => void;
}

/**
 * Renders the item as a button a person drags onto the canvas or presses.
 *
 * @param props - The kind of node, what a press does, and the button's props.
 */
export function PaletteItem({ item, onAdd, ...props }: PaletteItemProps): ReactElement {
  const centre = useViewCentre();

  return (
    <Button
      draggable
      onClick={() => {
        onAdd(item, centre());
      }}
      onDragStart={(event) => {
        event.dataTransfer.setData(ITEM, item);
        event.dataTransfer.effectAllowed = "copy";
      }}
      variant="outline"
      {...props}
    />
  );
}
