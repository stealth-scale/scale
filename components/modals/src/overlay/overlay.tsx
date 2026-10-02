/**
 * Creates overlays that a handler opens and awaits, rendered by one viewport.
 *
 * @remarks
 *   A dialog written into a tree opens from a trigger in that tree. An overlay opens from code: a
 *   confirmation before a request, a form whose value the caller needs, a progress dialog a task
 *   updates. `open` returns a promise of the value the overlay closes with, so the caller reads the
 *   answer in the statement that asked for it.
 */

import { type ComponentType, type ReactNode, useSyncExternalStore } from "react";

import { type OpenChangeDetails } from "@zag-js/dialog";

import { createStore, type Store } from "#overlay/store.ts";

/**
 * Describes the props `createOverlay` passes to the component beside the caller's.
 *
 * @remarks
 *   `open`, `onOpenChange` and `onExitComplete` are props of `Dialog.Root` and `Drawer.Root` under
 *   the same names, so the component spreads them onto its root. `close` is no prop of a root, and
 *   the component takes it out of the props before the spread.
 * @typeParam Result - Value the overlay closes with.
 */
export interface CreateOverlayProps<Result = unknown> {
  /**
   * Closes the overlay and settles the promise `open` returned with `result`.
   */
  readonly close: (result?: Result) => void;

  /**
   * Removes the overlay from the store once its exit animation ends.
   */
  readonly onExitComplete: () => void;

  /**
   * Closes the overlay and settles its promise with `undefined` when `open` in the details is
   * false: Escape, a press outside, a close trigger.
   */
  readonly onOpenChange: (details: OpenChangeDetails) => void;

  /**
   * True until the overlay closes.
   */
  readonly open: boolean;
}

/**
 * Describes what `createOverlay` returns: the methods that drive the overlays and the viewport that
 * renders them.
 *
 * @typeParam Props - Props the caller passes to `open`.
 * @typeParam Result - Value an overlay closes with.
 */
export interface CreateOverlayReturn<Props, Result = unknown> extends Omit<
  Store<Props, Result>,
  "entries" | "subscribe"
> {
  /**
   * Renders every overlay the store keeps, in the order their ids were first opened.
   *
   * @remarks
   *   An application renders it once, where the overlays' context providers reach it.
   */
  readonly Viewport: () => ReactNode;
}

/**
 * Creates a store of overlays that each render `Component`, and the viewport that renders them.
 *
 * @typeParam Props - Props the caller passes to `open`, beside the ones the store passes.
 * @typeParam Result - Value an overlay closes with.
 * @param Component - Component that renders one overlay from the caller's props and
 *   {@link CreateOverlayProps}.
 */
export function createOverlay<Props extends object, Result = unknown>(
  Component: ComponentType<CreateOverlayProps<Result> & Props>,
): CreateOverlayReturn<Props, Result> {
  const { entries, subscribe, ...store } = createStore<Props, Result>();

  /**
   * Renders the component of every overlay the store keeps, keyed by its id.
   */
  function Viewport(): ReactNode {
    return useSyncExternalStore(subscribe, entries, entries).map(({ id, open, props }) => (
      <Component
        {...props}
        close={(result) => {
          void store.close(id, result);
        }}
        key={id}
        onExitComplete={() => {
          store.remove(id);
        }}
        onOpenChange={(details) => {
          if (!details.open) void store.close(id);
        }}
        open={open}
      />
    ));
  }

  return { ...store, Viewport };
}
