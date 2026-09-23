/**
 * Runs the machine the control and the panel share, hands the recipe's variants to both, and joins
 * a submenu to the menu it opens from.
 *
 * @remarks
 *   The machine names no root, because a menu is a control and a panel that floats beside it rather
 *   than a thing that frames the two. An element is drawn here all the same, because the two are
 *   siblings and a slot recipe hands its variants down from above them both. It is drawn with
 *   `display: contents`, so it takes part in no layout and a menu attached to a control inside a
 *   row leaves that row as it was. The machine writes nothing onto it, there being no root among
 *   its parts. A root written inside the content of another is a submenu. It finds the menu above
 *   it, joins the two machines so a pointer and the arrow keys travel between them, and draws
 *   itself in the variants that menu was given unless it picks its own.
 *   It takes that menu's direction the same way. The engine picks the side a submenu opens on from
 *   the direction of the submenu's own machine, and a caller states the direction once, on the
 *   outermost menu. A submenu left to work it out for itself read left to right inside a menu that
 *   read right to left, and opened to the right, out over the menu that had opened it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withProvider } from "#menu/context.ts";
import {
  ApiProvider,
  type MenuOptions,
  splitMenuProps,
  useEnclosingMenu,
  useMenuMachine,
  useNestedMenu,
} from "#menu/machine.ts";
import { splitMenuVariants } from "#menu/variants.ts";

/**
 * Draws the element that sets the variants every part below it reads, and no box.
 */
const Framed = withProvider("div", "root");

/**
 * Describes what the root takes: the machine's settings, the recipe's variants, and the element's.
 *
 * @remarks
 *   The element's own `id` and `dir` are left out, because the machine states both. It names every
 *   part from the id, and it reads the direction to decide which side a submenu opens on. The
 *   element's `onSelect` is left out too: a div reports a text selection under that name, and the
 *   machine reports the row the reader chose.
 */
export interface RootProps
  extends MenuOptions, Omit<ComponentProps<typeof Framed>, "dir" | "id" | "onSelect"> {}

/**
 * Opens a list of things a reader chooses from, beside the control that opens it.
 *
 * @param props - The machine's settings, the recipe's variants and the element's props together.
 * @returns The parts, under the running machine.
 */
export function Root(props: RootProps): ReactElement {
  const parent = useEnclosingMenu();
  const [options, rest] = splitMenuProps(props);
  const [picked, others] = splitMenuVariants(rest);
  const dir = options.dir ?? parent?.dir;
  const [api, service] = useMenuMachine(dir === undefined ? options : { ...options, dir });
  const variants = { ...parent?.variants, ...picked };
  const depth = parent === undefined ? 0 : parent.depth + 1;

  useNestedMenu(service, parent?.service);

  return (
    <ApiProvider value={{ api, depth, dir, parent, service, variants }}>
      <Framed {...variants} {...others} />
    </ApiProvider>
  );
}
