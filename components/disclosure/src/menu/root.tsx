/**
 * Renders a menu's root, starts its machine and joins a submenu to the menu it opens from.
 *
 * @remarks
 *   The machine has no root part. The root renders a `div` with `display: contents`, which passes
 *   the recipe's variants to the trigger and the positioner and leaves the layout around the
 *   trigger unchanged. A root inside another menu's content is a submenu: it registers its machine
 *   with the parent's, takes the parent's variants unless it sets its own, and takes the parent's
 *   `dir`, because the machine chooses a submenu's side from the submenu's own direction.
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
 * Renders the `div` that provides the recipe's variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the props of the root: the machine's options, the recipe's variants and the props of a
 * `div`.
 *
 * @remarks
 *   The element's `id` and `dir` are left out, because the machine takes both. The element's
 *   `onSelect` is left out too, because a `div` reports a text selection under that name and the
 *   machine reports the chosen row.
 */
export interface RootProps
  extends MenuOptions, Omit<ComponentProps<typeof Framed>, "dir" | "id" | "onSelect"> {}

/**
 * Renders the root, provides its menu level to the parts and registers a submenu with its parent.
 *
 * @param props - The machine's options, the recipe's variants and the props of a `div`.
 * @returns The `div` element inside the api provider.
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
