/**
 * Computes one panel's state and publishes it to the shell.
 *
 * @remarks
 *   A panel's state has three inputs: whether the shell is wide enough for it beside the page,
 *   whether it is open, and whether another panel is over the page. The width comes from the
 *   shell's root, the open state from the caller when the caller controls it, and the other panels
 *   from the store. The panel measures the root and not the window, so a shell in a frame or a
 *   catalogue folds on its own width.
 */

import { type RefObject, useCallback, useId, useMemo, useRef } from "react";

import { useControllableState, useSafeLayoutEffect } from "@stealthscale/hooks";
import { type Breakpoint, useNarrow, widthOf } from "@stealthscale/provider-viewport";

import { useKeys } from "#app-shell/keys.ts";
import { type Panel } from "#app-shell/panels.ts";
import { useRevealed } from "#app-shell/revealed.ts";
import { type Collapse, type Fold, type Side, useOverlaid, useShell } from "#app-shell/state.ts";
import { useFocused } from "#focus/index.ts";

/**
 * Breakpoint below which each side folds when the panel sets none.
 *
 * @remarks
 *   The navigation folds below `md`. The end side folds below `lg`, because a page between the
 *   navigation and a detail panel on a tablet is too narrow for either.
 */
const FOLDS_BELOW: Readonly<Record<Side, Breakpoint>> = { end: "lg", start: "md" };

/**
 * Describes the options of a panel.
 */
export interface PanelOptions {
  /**
   * Result of closing the panel in the body: `hide` hides it, and `icons` leaves a rail wide
   * enough for its icons. Defaults to `hide`.
   */
  readonly collapse?: Collapse | undefined;

  /**
   * Whether the panel starts open when the caller does not control it. Defaults to `true`.
   */
  readonly defaultOpen?: boolean | undefined;

  /**
   * Where the panel goes when the shell is too narrow for it: over the page behind a backdrop, or
   * under the page as a block. Defaults to `over`.
   */
  readonly folds?: Fold | undefined;

  /**
   * Breakpoint below which the panel folds. Defaults to `md` on the start side and `lg` on the end
   * side.
   */
  readonly foldsBelow?: Breakpoint | undefined;

  /**
   * Name a trigger uses to find the panel. Defaults to `navbar` on the start side and `aside` on
   * the end side.
   */
  readonly name?: string | undefined;

  /**
   * Called with the new state when the panel opens or closes.
   */
  readonly onOpenChange?: ((open: boolean) => void) | undefined;

  /**
   * Whether the panel is open, when the application controls it.
   */
  readonly open?: boolean | undefined;

  /**
   * Key that toggles the panel with the platform's modifier held: `b` for ⌘B and Ctrl+B. No
   * shortcut by default.
   */
  readonly shortcut?: string | undefined;
}

/**
 * Describes what the panel's element renders with.
 */
export interface Drawn {
  /**
   * Whether the panel is inert: closed to nothing in the body, closed over the page, or behind
   * another panel that is over the page.
   */
  readonly inert: boolean;

  /**
   * The panel's published state.
   */
  readonly panel: Panel;
}

/**
 * Returns whether a panel is inert.
 */
function inertness(panel: Panel, collapse: Collapse, behind: boolean): boolean {
  return behind || (!panel.open && (panel.overlaid || collapse === "hide"));
}

/**
 * Returns whether a panel is shown, and the setter for its current mode.
 *
 * @remarks
 *   A panel over the page keeps its own open state, which starts closed. A caller's `open` applies
 *   at every width and replaces that state. A panel under the page is always shown, because nothing
 *   can open or close it.
 */
function useShown(
  overlaid: boolean,
  stacked: boolean,
  options: PanelOptions,
): [boolean, Panel["setOpen"]] {
  const sheet = overlaid && options.open === undefined;
  const [held, setHeld] = useControllableState({
    defaultValue: options.defaultOpen ?? true,
    onChange: options.onOpenChange,
    value: options.open,
  });
  const [revealed, setRevealed] = useRevealed(sheet);
  const setOpen = useCallback(
    (next: boolean): void => {
      if (sheet) setRevealed(next);
      else setHeld(next);
    },
    [setHeld, setRevealed, sheet],
  );

  return [stacked || (sheet ? revealed : held), setOpen];
}

/**
 * Wraps a panel's setter so that opening it records the focused element.
 *
 * @remarks
 *   The setter records the element while the press that opens the panel is being handled. An open
 *   sheet makes the rest of the shell inert, and a browser moves focus off an element it makes
 *   inert, so the element must be read before the next render.
 */
function useAsked(setShown: Panel["setOpen"]): [RefObject<HTMLElement | null>, Panel["setOpen"]] {
  const asked = useRef<HTMLElement | null>(null);
  const setOpen = useCallback(
    (next: boolean): void => {
      const standing = document.activeElement;

      if (next) asked.current = standing instanceof HTMLElement ? standing : null;

      setShown(next);
    },
    [setShown],
  );

  return [asked, setOpen];
}

/**
 * Computes one panel's state and publishes it to the shell.
 *
 * @remarks
 *   Focus moves into the panel on the store's state and not on the panel's own. The bars and the
 *   main region become inert on the store's state, one commit after the panel changes, and a
 *   browser does not focus an inert element. Reading the same state moves focus in only after the
 *   rest of the shell is inert, and back only after it stops being inert.
 * @param side - Side of the page the panel is on.
 * @param options - How the panel folds and closes.
 * @param inner - The content wrapper, which receives focus while the panel is over the page.
 * @returns The panel's state and whether its element is inert.
 */
export function usePanel(
  side: Side,
  options: PanelOptions,
  inner: RefObject<HTMLDivElement | null>,
): Drawn {
  const { collapse = "hide", folds = "over" } = options;
  const name = options.name ?? (side === "start" ? "navbar" : "aside");
  const shell = useShell();
  const below = options.foldsBelow ?? FOLDS_BELOW[side];
  const narrow = useNarrow(shell.root, widthOf(below), below);
  const overlaid = narrow && folds === "over";
  const stacked = narrow && folds === "under";
  const [shown, setShown] = useShown(overlaid, stacked, options);
  const [asked, setOpen] = useAsked(setShown);
  const id = useId();
  const panel = useMemo<Panel>(
    () => ({ id, open: shown, overlaid, setOpen, stacked }),
    [id, overlaid, setOpen, shown, stacked],
  );
  const sheets = useOverlaid();
  const sheet = sheets.some((each) => each.id === id);

  useKeys({ open: shown, overlaid, setOpen, shortcut: options.shortcut });
  useFocused(inner, sheet, undefined, asked);
  useSafeLayoutEffect((): (() => void) => {
    shell.panels.publish(name, panel);

    return (): void => {
      shell.panels.publish(name);
    };
  }, [name, panel, shell.panels]);

  return {
    inert: inertness(
      panel,
      collapse,
      sheets.some((each) => each.id !== id),
    ),
    panel,
  };
}
