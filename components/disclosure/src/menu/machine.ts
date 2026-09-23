/**
 * Connects the menu machine, provides its api to the parts, and registers a submenu with its parent
 * menu.
 *
 * @remarks
 *   The root starts one machine and every part reads its api from context. The context also holds
 *   the running service and the parent level, because registering a submenu needs both services
 *   and a submenu's trigger needs its parent's api. The machine derives the ids of the content,
 *   every item and every group from `id`.
 */

import { useEffect, useId } from "react";

import * as menu from "@zag-js/menu";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, omitUndefined, splitEnumerable } from "@stealthscale/hooks";

import { type MenuVariants } from "#menu/variants.ts";

/**
 * Describes the api `menu.connect` returns: a prop getter per part plus the machine's state and
 * methods.
 *
 * @remarks
 *   The type is inferred from `connect`, so it follows the installed machine version. The inferred
 *   type references `@zag-js/types`, so the package declares that package as a dependency.
 */
export type MenuApi = ReturnType<typeof menu.connect>;

/**
 * Describes the machine settings a caller can pass to the root, all optional.
 */
export type MenuOptions = Partial<menu.Props>;

/**
 * Describes one menu in a nest: the api its parts read, its running service, and its parent.
 */
export interface MenuLevel {
  /**
   * The connected api the parts of this menu read.
   */
  readonly api: MenuApi;

  /**
   * The number of menus above this one: 0 for the outermost menu, 1 for its submenu.
   *
   * @remarks
   *   The content raises its stacking level by this depth. Every panel of a nest uses the same
   *   z-index token and is portalled to the document, so no panel is an ancestor of another.
   *   Without the offset, portal mount order decides which panel is on top, and a submenu can
   *   render under the items of its parent.
   */
  readonly depth: number;

  /**
   * The writing direction of this menu, or `undefined` when no menu in the nest sets one.
   *
   * @remarks
   *   A submenu inherits it from its parent. Zag chooses the side a submenu opens on from the
   *   submenu machine's own `dir`, and a caller sets the direction once, on the outermost menu.
   *   Without inheritance, a submenu inside a right-to-left menu uses left-to-right and opens over
   *   its parent.
   */
  readonly dir: "ltr" | "rtl" | undefined;

  /**
   * The parent menu, or `undefined` for the outermost menu.
   */
  readonly parent: MenuLevel | undefined;

  /**
   * The running machine, registered as the child of the parent's machine.
   */
  readonly service: menu.Service;

  /**
   * The recipe variants of this menu, which a submenu uses as its defaults.
   */
  readonly variants: MenuVariants;
}

/**
 * Creates the context through which a root provides its menu level to its parts.
 *
 * @remarks
 *   `useMenu` throws when no `Menu.Root` is mounted above the calling part. `useEnclosingMenu`
 *   returns `undefined` instead, which a root uses to find its parent menu.
 */
export const [ApiProvider, useMenu, useEnclosingMenu] = createRequiredContext<MenuLevel>("Menu");

/**
 * Describes the item that contains an item's text and indicator parts.
 *
 * @remarks
 *   The machine identifies an item by `value` and reads `checked` for its indicator and text parts.
 *   The item provides both through context, so a caller sets `value` once, on the item.
 */
export interface MenuItemState {
  /**
   * Whether a checkbox or radio item is checked.
   */
  readonly checked?: boolean | undefined;

  /**
   * Whether the item rejects selection.
   */
  readonly disabled?: boolean | undefined;

  /**
   * The value the machine identifies the item by.
   */
  readonly value: string;

  /**
   * The text typeahead matches, when it differs from the rendered label.
   */
  readonly valueText?: string | undefined;
}

/**
 * Creates the context through which an item provides its state to its text and indicator parts.
 */
export const [ItemProvider, useMenuItem] = createRequiredContext<MenuItemState>("Menu.Item");

/**
 * Splits the root's props into machine settings and element props.
 *
 * @remarks
 *   The key list comes from the machine's own `splitProps`, so it follows the installed version.
 */
export const splitMenuProps = splitEnumerable(menu.splitProps);

/**
 * Starts the menu machine and returns its connected api and its running service.
 *
 * @param options - Machine settings split from the root's props. A generated id is used when `id`
 *   is absent.
 * @returns The api the parts read, and the service a submenu registers with.
 */
export function useMenuMachine(options: MenuOptions): readonly [MenuApi, menu.Service] {
  const generated = useId();
  const service = useMachine(menu.machine, {
    ...omitUndefined(options),
    id: options.id ?? generated,
  });

  return [menu.connect(service, normalizeProps), service];
}

/**
 * Registers a menu's machine with its parent's machine, and the parent's with the menu's.
 *
 * @remarks
 *   Zag needs each machine to reference the other. The parent keeps a submenu open while the
 *   pointer moves into it, and the submenu returns focus to the parent when the arrow key closes
 *   it. The effect depends on the two services, which keep their identity for the lifetime of their
 *   roots, so the pair registers once. A connected api is a new object on every render, so the
 *   effect connects the services itself rather than taking apis as arguments.
 * @param service - The machine of the menu being registered.
 * @param parent - The parent menu's machine, or `undefined` for the outermost menu.
 */
export function useNestedMenu(service: menu.Service, parent: menu.Service | undefined): void {
  useEffect(() => {
    if (parent === undefined) return;

    menu.connect(parent, normalizeProps).setChild(service);
    menu.connect(service, normalizeProps).setParent(parent);
  }, [parent, service]);
}
