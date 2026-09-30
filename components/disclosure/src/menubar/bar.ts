/**
 * Keeps which menu of a menubar is open, the bar's names in document order, and the moves between
 * them: a step to the adjacent menu and typeahead along the bar.
 *
 * @remarks
 *   The bar keeps the open value, so at most one menu is open. Each menu reads whether it is open
 *   from the bar and reports its own opening and closing to it. A step marks the menu it opens, and
 *   that menu's panel highlights its first row once the row is in the document. The names register
 *   their elements, and the bar reads them in document order, which differs from registration order
 *   once a name renders conditionally. The open value is kept in a ref as well as in state, so a
 *   step taken from a handler of an earlier render moves from the menu open now.
 */

import {
  createContext,
  type KeyboardEvent,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";

import { createRequiredContext, useCallbackRef, useControllableState } from "@stealthscale/hooks";

import { type MenuVariants } from "#menu/variants.ts";

/**
 * Describes what `onValueChange` receives: the value of the open menu, or an empty string once
 * every menu is closed.
 */
export interface ValueChangeDetails {
  /**
   * Value of the open menu, or an empty string.
   */
  readonly value: string;
}

/**
 * Describes one name of the bar as the bar records it.
 */
export interface Name {
  /**
   * Element that takes focus and a press.
   */
  readonly element: HTMLElement;

  /**
   * Value of the menu the name opens.
   */
  readonly value: string;
}

/**
 * Describes the settings every menu of the bar takes: the menu recipe's variants and the writing
 * direction.
 */
export interface MenuSettings extends MenuVariants {
  /**
   * Writing direction of the menus, which sets a submenu's side and the arrows in a panel.
   */
  readonly dir?: "ltr" | "rtl";
}

/**
 * Describes the bar its menus and names read.
 */
export interface Bar {
  /**
   * Returns true once for the menu a step opened, which readies its first row.
   *
   * @remarks
   *   The function reads a ref, so it returns nothing when called during the render that fills it,
   *   and a caller acts on `true` alone.
   */
  readonly claimStep: (value: string) => boolean | undefined;

  /**
   * Closes the menu of a value, when it is the one open.
   */
  readonly closeValue: (value: string) => void;

  /**
   * Moves focus to the name of a value's menu.
   */
  readonly focusName: (value: string) => void;

  /**
   * Settings every menu of the bar takes.
   */
  readonly menus: MenuSettings;

  /**
   * Adds a name to the bar and returns the function that removes it.
   *
   * @remarks
   *   The return type allows undefined for the same reason, and React accepts undefined where it
   *   expects a cleanup.
   */
  readonly register: (name: Name) => (() => void) | undefined;

  /**
   * Opens the menu of a value and closes the one open, or closes every menu for an empty string.
   */
  readonly setValue: (value: string) => void;

  /**
   * Opens the menu a number of names along the bar from the open one, wrapping while `loop` is set.
   */
  readonly step: (delta: number) => void;

  /**
   * Moves focus to the next name that starts with the letter a key press types.
   */
  readonly typeahead: (event: KeyboardEvent<HTMLElement>) => void;

  /**
   * Value of the open menu, or an empty string.
   */
  readonly value: string;
}

/**
 * Provides the bar to its menus and names, and reads it back.
 */
export const [BarProvider, useBar] = createRequiredContext<Bar>("Menubar");

/**
 * Provides a menu's value to its trigger and its panel, and reads it back.
 */
export const [MenuValueProvider, useMenuValue] = createRequiredContext<string>("Menubar.Menu");

/**
 * Describes the folded bar's menu, which the parts inside it read.
 */
export interface Fold {
  /**
   * Glyph after the words of a row that opens a menu of the bar, such as a chevron.
   */
  readonly indicator?: ReactNode | undefined;
}

/**
 * Carries the folded bar's menu to the parts inside it.
 */
const Folded = createContext<Fold | undefined>(undefined);

/**
 * Provides the folded bar's menu to the parts below.
 */
export const FoldedProvider = Folded.Provider;

/**
 * Returns the folded bar's menu the calling part renders in.
 *
 * @returns The folded bar's menu, or nothing in the bar.
 */
export function useFolded(): Fold | undefined {
  return useContext(Folded);
}

/**
 * Compares two names by document position.
 */
function byDocumentPosition(first: Name, second: Name): number {
  const relation = first.element.compareDocumentPosition(second.element);

  return (relation & Node.DOCUMENT_POSITION_FOLLOWING) === 0 ? 1 : -1;
}

/**
 * Returns the first name after the focused one, wrapping, whose words start with the typed letter.
 *
 * @param names - The names in registration order.
 * @param focused - The name the key press came from.
 * @param key - The typed letter.
 * @returns The name, or nothing when no name starts with the letter.
 */
function typed(names: readonly Name[], focused: EventTarget, key: string): Name | undefined {
  const along = names.toSorted(byDocumentPosition);
  const from = along.findIndex((name) => name.element === focused);
  const wanted = key.toLowerCase();

  return [...along.slice(from + 1), ...along.slice(0, from + 1)].find((name) =>
    name.element.textContent.trim().toLowerCase().startsWith(wanted),
  );
}

/**
 * Returns true when a key press types one character without Alt, Control or Meta held.
 */
function isTyping(event: KeyboardEvent<HTMLElement>): boolean {
  return event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey;
}

/**
 * Describes the options of the bar.
 */
export interface BarOptions {
  /**
   * Value of the menu open at mount.
   */
  readonly defaultValue?: string | undefined;

  /**
   * Whether a step past one end of the bar continues at the other.
   */
  readonly loop: boolean;

  /**
   * Settings every menu of the bar takes.
   */
  readonly menus: MenuSettings;

  /**
   * Runs when another menu opens or every menu closes.
   */
  readonly onValueChange?: ((details: ValueChangeDetails) => void) | undefined;

  /**
   * Value of the open menu, where the caller keeps it.
   */
  readonly value?: string | undefined;
}

/**
 * Keeps the bar's open menu and names, and returns the bar its parts read.
 *
 * @param options - The value, the loop and the menus' settings.
 * @returns The bar.
 */
export function useMenubar(options: BarOptions): Bar {
  const { defaultValue, loop, menus, onValueChange, value: stated } = options;
  const names = useRef<Name[]>([]);
  const stepped = useRef("");
  const [value, setOpen] = useControllableState({
    defaultValue: defaultValue ?? "",
    onChange: (next: string) => onValueChange?.({ value: next }),
    value: stated,
  });
  const open = useRef(value);

  useEffect(() => {
    open.current = value;
  }, [value]);

  const setValue = useCallbackRef((next: string): void => {
    open.current = next;
    setOpen(next);
  });
  const closeValue = useCallbackRef((closed: string): void => {
    if (open.current === closed) setValue("");
  });
  const step = useCallbackRef((delta: number): void => {
    const along = names.current.toSorted(byDocumentPosition);
    const at = along.findIndex((name) => name.value === open.current);
    const to = loop ? (at + delta + along.length) % along.length : at + delta;
    const next = along[to];

    if (at === -1 || next === undefined) return;

    stepped.current = next.value;
    setValue(next.value);
  });
  const claimStep = useCallbackRef((claimed: string): boolean => {
    if (stepped.current !== claimed) return false;

    stepped.current = "";

    return true;
  });
  const focusName = useCallbackRef((named: string): void => {
    names.current.find((name) => name.value === named)?.element.focus();
  });
  const register = useCallbackRef((name: Name): (() => void) => {
    names.current = [...names.current, name];

    return (): void => {
      names.current = names.current.filter((kept) => kept !== name);
    };
  });
  const typeahead = useCallbackRef((event: KeyboardEvent<HTMLElement>): void => {
    if (!isTyping(event)) return;

    const found = typed(names.current, event.currentTarget, event.key);

    if (found === undefined) return;

    event.preventDefault();
    found.element.focus();
  });

  return { claimStep, closeValue, focusName, menus, register, setValue, step, typeahead, value };
}
