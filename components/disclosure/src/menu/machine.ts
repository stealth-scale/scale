/**
 * Runs the menu's machine, carries what it answers down to the parts, and registers a submenu with
 * the menu it opens from.
 *
 * @remarks
 *   The machine is connected once, at the root, so every part reads one api from one running
 *   machine. A part drawn outside the root throws where it was written rather than drawing wrongly
 *   and saying nothing.
 *   A root also carries the running machine itself and the level above it. Registering a submenu
 *   takes the two machines rather than their apis, and a submenu's control takes the api of the
 *   menu above it, so neither is reachable from the api alone.
 *   The id is the machine's and never an element's. It names the panel, every row and every group,
 *   so a caller naming their own passes it here and every reference follows.
 */

import { useEffect, useId } from "react";

import * as menu from "@zag-js/menu";
import { normalizeProps, useMachine } from "@zag-js/react";

import { createRequiredContext, splitEnumerable } from "@stealthscale/hooks";

import { type MenuVariants } from "#menu/variants.ts";
import { stated } from "#stated.ts";

/**
 * Describes what the machine answers: a prop getter per part, beside its state and its methods.
 *
 * @remarks
 *   Inferred off `connect` rather than named, so the parts take exactly what the machine hands
 *   them. The inferred type reaches `@zag-js/types`, which this package declares for that reason.
 */
export type MenuApi = ReturnType<typeof menu.connect>;

/**
 * Describes what a caller sets on the machine, every setting of it optional.
 */
export type MenuOptions = Partial<menu.Props>;

/**
 * Describes one menu of a nest: the api its parts read, the machine a submenu registers with, and
 * the menu this one opens from.
 */
export interface MenuLevel {
  /**
   * The connected api every part of this menu reads.
   */
  readonly api: MenuApi;

  /**
   * The menu this one opens from, or undefined where this is the outermost.
   */
  readonly parent: MenuLevel | undefined;

  /**
   * The running machine, which the menu above registers as its child.
   */
  readonly service: menu.Service;

  /**
   * The variants this menu is drawn in, which a submenu inside it starts from.
   */
  readonly variants: MenuVariants;
}

/**
 * Hands the running menu to every part, reads it back, and reads the menu a root opens from.
 */
export const [ApiProvider, useMenu, useEnclosingMenu] = createRequiredContext<MenuLevel>("Menu");

/**
 * Describes the row a label or a mark is drawn inside.
 *
 * @remarks
 *   The machine identifies a row by its value and reads its checked state to decide what a mark
 *   and a label report. A row hands both to the parts inside it, so a caller writes the value on
 *   the row alone rather than on the row, its label and its mark alike.
 */
export interface MenuItemState {
  /**
   * Whether the row is ticked, for a row that offers a choice.
   */
  readonly checked?: boolean | undefined;

  /**
   * Whether a reader can choose the row at all.
   */
  readonly disabled?: boolean | undefined;

  /**
   * The value the machine identifies the row by.
   */
  readonly value: string;

  /**
   * The words typeahead matches the row on, where they differ from what it shows.
   */
  readonly valueText?: string | undefined;
}

/**
 * Hands the row to the label and the mark inside it, and reads it back.
 */
export const [ItemProvider, useMenuItem] = createRequiredContext<MenuItemState>("Menu.Item");

/**
 * Splits what the machine reads from what the element does.
 *
 * @remarks
 *   The machine states which props are its own, so the root never lists them and never drifts from
 *   the version it is built against.
 */
export const splitMenuProps = splitEnumerable(menu.splitProps);

/**
 * Starts the machine and connects it.
 *
 * @param options - The settings the caller handed the root, less the id where it named none.
 * @returns The api every part reads, beside the machine a submenu registers with.
 */
export function useMenuMachine(options: MenuOptions): readonly [MenuApi, menu.Service] {
  const generated = useId();
  const service = useMachine(menu.machine, {
    ...stated(options),
    id: options.id ?? generated,
  });

  return [menu.connect(service, normalizeProps), service];
}

/**
 * Registers a menu with the one it opens from, so the two move as a nest.
 *
 * @remarks
 *   Each machine holds the other, which is what lets a pointer travel from a row into the submenu
 *   it opened without the submenu closing under it, and what sends the focus back up on the arrow
 *   key that closes it. The machines are registered rather than the apis, and a machine keeps the
 *   same identity for as long as its root is drawn, so the pair is registered once however often
 *   either menu redraws. The apis are read from the machines here rather than passed in, because a
 *   connected api is a fresh object on every draw and would register the pair again each time.
 * @param service - The machine of the menu being registered.
 * @param parent - The machine of the menu it opens from, or undefined where there is none.
 */
export function useNestedMenu(service: menu.Service, parent: menu.Service | undefined): void {
  useEffect(() => {
    if (parent === undefined) return;

    menu.connect(parent, normalizeProps).setChild(service);
    menu.connect(service, normalizeProps).setParent(parent);
  }, [parent, service]);
}
