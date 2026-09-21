/**
 * Implements a roving tabindex: Tab enters the group once, and the arrow keys move focus within
 * it.
 *
 * @remarks
 *   A toolbar, a tab list and a menu bar each occupy a single stop in the page's tab order. Items
 *   register themselves instead of being enumerated by the root, because the root cannot see
 *   through whatever components its children are composed from. Registration order is effect
 *   order, which stops tracking source order as soon as an item is conditional, so the registry
 *   sorts on document position and the arrows follow the on-screen sequence.
 */

import {
  createContext,
  type KeyboardEvent,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { useCallbackRef, useControllableState } from "@stealthscale/hooks";

/**
 * The axis or axes whose arrow keys move focus within a group.
 */
export type Orientation = "both" | "horizontal" | "vertical";

/**
 * The movement a key requests: one end of the group, or a signed step from the current item.
 */
type Intent = "end" | "start" | number | undefined;

/**
 * The block-axis arrow keys and the step each one requests.
 */
const DOWN_THE_PAGE: Readonly<Record<string, number | undefined>> = { ArrowDown: 1, ArrowUp: -1 };

/**
 * The inline-axis arrow keys and the step each one requests before writing direction is applied.
 */
const ALONG_THE_LINE: Readonly<Record<string, number | undefined>> = {
  ArrowLeft: -1,
  ArrowRight: 1,
};

/**
 * One item as the group records it.
 */
export interface Registration {
  /**
   * The element that receives focus.
   */
  element: HTMLElement;

  /**
   * The identifier the group tracks the item under.
   */
  id: string;
}

/**
 * The group state an item consumes through context.
 */
export interface Group {
  /**
   * The identifier of the item holding the tab stop, or undefined until the first item registers.
   */
  activeId: string | undefined;

  /**
   * Moves the tab stop to an item that has just received focus.
   */
  onFocus: (id: string) => void;

  /**
   * Adds an item to the group and returns the function that removes it again.
   *
   * @remarks
   *   The return type allows undefined because the implementation lives in a ref, which is already
   *   callable during the render that fills it. React accepts undefined where a cleanup is
   *   expected, so a call made that early does no harm.
   */
  register: (registration: Registration) => (() => void) | undefined;
}

/**
 * The context a root publishes its group on, and every item below it reads.
 */
export const RovingFocusContext = createContext<Group | undefined>(undefined);

/**
 * Compares two registrations so that sorting arranges them as they appear in the document.
 */
function byDocumentPosition(first: Registration, second: Registration): number {
  const relation = first.element.compareDocumentPosition(second.element);

  return (relation & Node.DOCUMENT_POSITION_FOLLOWING) === 0 ? 1 : -1;
}

/**
 * Translates a key press into the movement it requests.
 *
 * @param key - The `key` value of the keyboard event.
 * @param orientation - The axes the group responds to.
 * @param forward - 1 in a left-to-right group and -1 in a right-to-left one, applied to the
 *   inline arrows only.
 * @returns The requested step or end, or undefined when the group does not handle the key.
 */
function intentOf(key: string, orientation: Orientation, forward: number): Intent {
  if (key === "Home") return "start";
  if (key === "End") return "end";

  const block = DOWN_THE_PAGE[key];

  if (block !== undefined) return orientation === "horizontal" ? undefined : block;

  const inline = ALONG_THE_LINE[key];

  if (inline !== undefined) return orientation === "vertical" ? undefined : inline * forward;

  return undefined;
}

/**
 * Locates the item to move focus to, expressed as a slice of the registration list.
 *
 * @remarks
 *   Returning bounds rather than an index keeps the caller branchless. The computed index is
 *   always in range, but indexing would still be typed as possibly undefined, and slicing an
 *   empty list yields an empty list, so a group with no items needs no special case.
 * @param list - The registrations in document order.
 * @param intent - The step or end the key requested.
 * @param from - The identifier of the item currently holding the tab stop.
 * @param wrap - Whether a step past one end continues at the other.
 * @returns The start and end bounds of a slice containing the destination item.
 */
function spanOf(
  list: readonly Registration[],
  intent: Exclude<Intent, undefined>,
  from: string | undefined,
  wrap: boolean,
): readonly [first: number, last: number] {
  const last = list.length - 1;
  const at = list.findIndex((item) => item.id === from);
  const here = at === -1 ? 0 : at;
  const to =
    intent === "start"
      ? 0
      : intent === "end"
        ? last
        : wrap
          ? (here + intent + list.length) % list.length
          : Math.min(last, Math.max(0, here + intent));

  return [to, to + 1];
}

/**
 * The store a group keeps its registered items in.
 */
interface Registry {
  /**
   * Records a registration.
   */
  add: (registration: Registration) => void;

  /**
   * Reports whether a node sits inside a registered element, which is how the root decides a key
   * event belongs to it.
   */
  holds: (node: Node) => boolean;

  /**
   * Returns the registrations in document order, which is the order the arrows step through.
   */
  ordered: () => Registration[];

  /**
   * Drops the registration carrying an identifier.
   */
  remove: (id: string) => void;
}

/**
 * Creates a registry backed by a ref rather than by state.
 *
 * @remarks
 *   Rendering depends on the active identifier alone and never on the list itself, so holding the
 *   list in state would re-render the entire group each time an item mounted, with no visible
 *   difference.
 */
function useRegistry(): Registry {
  const items = useRef<Registration[]>([]);

  return useMemo(() => {
    /**
     * Appends a registration to the list.
     */
    const add = (registration: Registration): void => {
      items.current = [...items.current, registration];
    };

    /**
     * Returns true when a registered element contains the node.
     */
    const holds = (node: Node): boolean =>
      items.current.some((item) => item.element.contains(node));

    /**
     * Copies the registrations into document order.
     */
    const ordered = (): Registration[] => items.current.toSorted(byDocumentPosition);

    /**
     * Discards the registration carrying an identifier.
     */
    const remove = (id: string): void => {
      items.current = items.current.filter((item) => item.id !== id);
    };

    return { add, holds, ordered, remove };
  }, []);
}

/**
 * The tab stop and the two ways of reading and moving it.
 */
interface TabStop {
  /**
   * The identifier of the item holding the stop.
   */
  activeId: string | undefined;

  /**
   * Moves the stop to an item.
   */
  claim: (next: string | undefined) => void;

  /**
   * The same identifier in a ref, so a callback created before the current render can still read
   * the current value.
   */
  stop: RefObject<string | undefined>;
}

/**
 * Tracks which item holds the tab stop, deferring to the caller when the group is controlled.
 */
function useTabStop(props: RovingFocusProps): TabStop {
  const { activeId: driven, defaultActiveId, onActiveIdChange } = props;
  const [activeId, setActiveId] = useControllableState<string | undefined>({
    defaultValue: defaultActiveId,
    onChange: onActiveIdChange,
    value: driven,
  });
  const stop = useRef(activeId);

  useEffect(() => {
    stop.current = activeId;
  }, [activeId]);

  const claim = useCallbackRef((next: string | undefined): void => {
    stop.current = next;
    setActiveId(next);
  });

  return { activeId, claim, stop };
}

/**
 * The options the hook takes.
 */
export interface RovingFocusProps {
  /**
   * The item holding the tab stop when the caller controls the group.
   */
  activeId?: string | undefined;

  /**
   * The item Tab enters first when the group controls itself.
   */
  defaultActiveId?: string | undefined;

  /**
   * Called after the tab stop moves to another item.
   */
  onActiveIdChange?: ((activeId: string | undefined) => void) | undefined;

  /**
   * The axes whose arrows move focus.
   */
  orientation: Orientation;

  /**
   * Whether a step past one end continues at the other.
   */
  wrap: boolean;
}

/**
 * The result the hook returns.
 */
export interface RovingFocus {
  /**
   * The context value to publish to the items.
   */
  group: Group;

  /**
   * The key handler for the root element. It ignores every key the orientation does not claim, so
   * a key the group has no use for still reaches the page.
   */
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

/**
 * Drives one tab stop across the items that register with the group.
 *
 * @remarks
 *   The first item to register takes the stop, so the group is reachable by Tab from its first
 *   render. When the item holding the stop unmounts, the stop passes to the first item remaining
 *   in document order, so the group never falls out of the tab order.
 * @returns The context value for the items and the key handler for the root.
 */
export function useRovingFocus(props: RovingFocusProps): RovingFocus {
  const { orientation, wrap } = props;
  const { add, holds, ordered, remove } = useRegistry();
  const { activeId, claim, stop } = useTabStop(props);

  const register = useCallbackRef((registration: Registration) => {
    add(registration);

    if (stop.current === undefined) claim(registration.id);

    return (): void => {
      remove(registration.id);

      if (stop.current === registration.id) claim(ordered()[0]?.id);
    };
  });

  const onKeyDown = useCallbackRef((event: KeyboardEvent<HTMLElement>): void => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const { target } = event;

    if (!(target instanceof Node) || !holds(target)) return;

    const rightToLeft = globalThis.getComputedStyle(event.currentTarget).direction === "rtl";
    const intent = intentOf(event.key, orientation, rightToLeft ? -1 : 1);

    if (intent === undefined) return;

    for (const moving of ordered().slice(...spanOf(ordered(), intent, stop.current, wrap))) {
      claim(moving.id);
      moving.element.focus();
    }

    event.preventDefault();
  });

  const onFocus = useCallbackRef((id: string): void => {
    claim(id);
  });

  return {
    group: useMemo<Group>(() => ({ activeId, onFocus, register }), [activeId, onFocus, register]),
    onKeyDown,
  };
}
