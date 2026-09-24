/**
 * Stores each panel's state for one shell, so a control anywhere in the shell reads the panel it
 * points at.
 *
 * @remarks
 *   A trigger in the header and the panel it opens in the body are siblings, so neither can pass
 *   state to the other through context. The shell keeps a store between them: a panel publishes its
 *   state, and every subscriber re-renders when it changes. Readers use `useSyncExternalStore`,
 *   because a panel publishes in a layout effect and React 19 reports state set from an effect.
 *   Publishing an equal state does not notify subscribers.
 */

import { useSyncExternalStore } from "react";

/**
 * Describes the state one panel publishes.
 */
export interface Panel {
  /**
   * Identifier of the panel's element, which a trigger's `aria-controls` points at.
   */
  readonly id: string;

  /**
   * Whether the panel is shown: open in the body, or open over the page.
   */
  readonly open: boolean;

  /**
   * Whether the shell is too narrow for the panel and the panel is over the page.
   */
  readonly overlaid: boolean;

  /**
   * Shows or hides the panel.
   */
  readonly setOpen: (open: boolean) => void;

  /**
   * Whether the shell is too narrow for the panel and the panel has dropped under the page.
   */
  readonly stacked: boolean;
}

/**
 * Describes the panels of one shell, keyed by name.
 */
export type Panels = Readonly<Record<string, Panel>>;

/**
 * Describes the store of one shell's panels.
 */
export interface PanelStore {
  /**
   * Stores a panel's state under its name, or removes the panel when no state is passed.
   */
  readonly publish: (name: string, panel?: Panel) => void;

  /**
   * Returns every panel.
   */
  readonly read: () => Panels;

  /**
   * Registers a listener called on every change.
   *
   * @returns A function that removes the listener.
   */
  readonly subscribe: (onChange: () => void) => () => void;
}

/**
 * Returns whether two panel states are equal in every field.
 */
function same(one: Panel | undefined, other: Panel | undefined): boolean {
  if (one === undefined || other === undefined) return one === other;

  return (
    one.id === other.id &&
    one.open === other.open &&
    one.overlaid === other.overlaid &&
    one.setOpen === other.setOpen &&
    one.stacked === other.stacked
  );
}

/**
 * Creates an empty panel store for one shell.
 *
 * @returns The store, empty until a panel publishes.
 */
export function panelStore(): PanelStore {
  const listeners = new Set<() => void>();
  let panels: Panels = {};

  return {
    publish: (name, panel): void => {
      if (same(panels[name], panel)) return;

      const { [name]: _gone, ...rest } = panels;

      panels = panel === undefined ? rest : { ...rest, [name]: panel };

      for (const listener of listeners) listener();
    },
    read: (): Panels => panels,
    subscribe: (onChange): (() => void) => {
      listeners.add(onChange);

      return (): void => {
        listeners.delete(onChange);
      };
    },
  };
}

/**
 * Reads every panel of a shell and re-renders the caller when a panel changes.
 *
 * @param store - The shell's panel store.
 * @returns Every panel, keyed by name.
 */
export function usePanels(store: PanelStore): Panels {
  return useSyncExternalStore(store.subscribe, store.read, store.read);
}
