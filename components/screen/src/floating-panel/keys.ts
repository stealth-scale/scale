/**
 * Moves and resizes the floating panel from the arrow keys pressed on the panel itself.
 *
 * @remarks
 *   The machine's own keys flip ArrowLeft and ArrowRight under a right-to-left direction, so
 *   ArrowLeft moves the panel right. They move a panel that cannot be dragged, and no key resizes
 *   the panel. These keys move the panel in the arrow's direction under both directions, 1px at a
 *   time and 10px with Shift, times the grid, while the panel can be dragged. With Alt they resize
 *   it from the east and south edges while it can be resized, as the image cropper's keys do. A
 *   resize keeps the aspect ratio while `lockAspectRatio` is true. The machine keeps the panel
 *   inside the window and between its minimum and maximum size. A key handled here is cancelled, so
 *   the machine's handler skips it.
 */

import { type KeyboardEvent } from "react";

import type * as floatingPanel from "@zag-js/floating-panel";

/**
 * Describes a direction the machine's move event takes.
 */
type Direction = "down" | "left" | "right" | "up";

/**
 * Maps each arrow key to the direction it moves the panel on the screen.
 */
const DIRECTIONS: Readonly<Record<string, Direction>> = {
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
};

/**
 * Maps each direction to the change of size one step makes: the east edge moves along the inline
 * axis and the south edge along the block axis.
 */
const GROWTH: Readonly<Record<Direction, floatingPanel.Size>> = {
  down: { height: 1, width: 0 },
  left: { height: 0, width: -1 },
  right: { height: 0, width: 1 },
  up: { height: -1, width: 0 },
};

/**
 * Returns the size after one step, in the width to height ratio of `size` while `locked` is true.
 *
 * @param size - The panel's size before the step.
 * @param growth - The change of size one step makes, per pixel of the step.
 * @param step - The distance in pixels.
 * @param locked - Whether the panel keeps its aspect ratio.
 */
function grown(
  size: floatingPanel.Size,
  growth: floatingPanel.Size,
  step: number,
  locked: boolean,
): floatingPanel.Size {
  const height = size.height + growth.height * step;
  const width = size.width + growth.width * step;

  if (!locked) return { height, width };

  const ratio = size.width / size.height;

  return growth.width === 0 ? { height, width: height * ratio } : { height: width / ratio, width };
}

/**
 * Resizes the panel by one step in a direction while the panel can be resized.
 *
 * @remarks
 *   The machine keeps the aspect ratio on a drag alone, so a step here keeps it too while
 *   `lockAspectRatio` is true.
 * @param service - The running machine.
 * @param direction - The direction of the arrow pressed.
 * @param step - The distance in pixels.
 */
function resize(service: floatingPanel.Service, direction: Direction, step: number): void {
  if (!service.computed("canResize")) return;

  const locked = service.prop("lockAspectRatio") === true;
  const size = grown(service.context.get("size"), GROWTH[direction], step, locked);

  service.send({ size, type: "SET_SIZE" });
}

/**
 * Moves or resizes the panel for an arrow key pressed on the panel itself, and cancels the key.
 *
 * @param event - The key event on the panel.
 * @param service - The running machine.
 */
export function keyed(event: KeyboardEvent<HTMLElement>, service: floatingPanel.Service): void {
  const direction = DIRECTIONS[event.key];

  if (event.defaultPrevented || direction === undefined || event.target !== event.currentTarget)
    return;

  event.preventDefault();

  const step = (event.shiftKey ? 10 : 1) * service.prop("gridSize");

  if (event.altKey) resize(service, direction, step);
  else if (service.computed("canDrag")) service.send({ direction, step, type: "MOVE" });
}
