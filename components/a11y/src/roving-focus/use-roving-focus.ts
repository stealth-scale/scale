/**
 * Implements a roving tabindex: Tab enters the group once, and the arrow keys move focus inside it.
 *
 * @remarks
 *   A toolbar, a tab list and a menu bar each take one stop in the page's tab order. Items register
 *   themselves, because the root cannot see through the components its children are composed
 *   from. Registration follows effect order, which differs from source order once an item renders
 *   conditionally, so the registry sorts by document position and the arrows follow the order on
 *   screen.
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
 * Axis or axes whose arrow keys move focus inside a group.
 */
export type Orientation = "both" | "horizontal" | "vertical";

/**
 * Movement a key requests: one end of the group, or a signed step from the current item.
 */
type Intent = "end" | "start" | number | undefined;

/**
 * Maps each block-axis arrow key to its step.
 */
const DOWN_THE_PAGE: Readonly<Record<string, number | undefined>> = { ArrowDown: 1, ArrowUp: -1 };

/**
 * Maps each inline-axis arrow key to its step in a left-to-right group.
 */
const ALONG_THE_LINE: Readonly<Record<string, number | undefined>> = {
  ArrowLeft: -1,
  ArrowRight: 1,
};

/**
 * Describes one item as the group records it.
 */
export interface Registration {
  /**
   * Element that receives focus.
   */
  element: HTMLElement;

  /**
   * Identifier the group tracks the item under.
   */
  id: string;
}

/**
 * Describes the group state an item reads from context.
 */
export interface Group {
  /**
   * Identifier of the item with the tab stop, or undefined until the first item registers.
   */
  activeId: string | undefined;

  /**
   * Moves the tab stop to an item that received focus.
   */
  onFocus: (id: string) => void;

  /**
   * Adds an item to the group and returns the function that removes it.
   *
   * @remarks
   *   The return type allows undefined, because the implementation is in a ref that is callable
   *   during the render that fills it. React accepts undefined where it expects a cleanup.
   */
  register: (registration: Registration) => (() => void) | undefined;
}

/**
 * Context that a root publishes its group on and every item below it reads.
 */
export const RovingFocusContext = createContext<Group | undefined>(undefined);

/**
 * Compares two registrations by document position, for sorting in on-screen order.
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
 * Returns the destination item as the bounds of a one-item slice of the registration list.
 *
 * @remarks
 *   Slice bounds keep the caller free of a branch. An index is typed as possibly undefined even
 *   when it is in range, and slicing an empty list returns an empty list, so a group with no items
 *   needs no special case.
 * @param list - The registrations in document order.
 * @param intent - The step or end the key requested.
 * @param from - The identifier of the item with the tab stop.
 * @param wrap - Whether a step past one end continues at the other.
 * @returns The start and end bounds of a slice that contains the destination item.
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
 * Describes the store of a group's registered items.
 */
interface Registry {
  /**
   * Records a registration.
   */
  add: (registration: Registration) => void;

  /**
   * Returns true when a registered element contains the node, which decides whether a key event
   * belongs to the group.
   */
  contains: (node: Node) => boolean;

  /**
   * Returns the registrations in document order, the order the arrows step through.
   */
  ordered: () => Registration[];

  /**
   * Removes the registration with an identifier.
   */
  remove: (id: string) => void;
}

/**
 * Creates a registry backed by a ref.
 *
 * @remarks
 *   Rendering depends on the active identifier and not on the list, so a list in state would
 *   re-render the whole group each time an item mounted, with no visible change.
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
    const contains = (node: Node): boolean =>
      items.current.some((item) => item.element.contains(node));

    /**
     * Returns a copy of the registrations in document order.
     */
    const ordered = (): Registration[] => items.current.toSorted(byDocumentPosition);

    /**
     * Removes the registration with an identifier.
     */
    const remove = (id: string): void => {
      items.current = items.current.filter((item) => item.id !== id);
    };

    return { add, contains, ordered, remove };
  }, []);
}

/**
 * Describes the tab stop and the two ways to read and move it.
 */
interface TabStop {
  /**
   * Identifier of the item with the stop.
   */
  activeId: string | undefined;

  /**
   * Moves the stop to an item.
   */
  claim: (next: string | undefined) => void;

  /**
   * Identifier of the item with the stop, in a ref, for a callback created before the current
   * render.
   */
  stop: RefObject<string | undefined>;
}

/**
 * Tracks which item has the tab stop, and defers to the caller when the group is controlled.
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
 * Describes the options of useRovingFocus.
 */
export interface RovingFocusProps {
  /**
   * Item with the tab stop when the caller controls the group.
   */
  activeId?: string | undefined;

  /**
   * Item that Tab enters first when the group controls itself.
   */
  defaultActiveId?: string | undefined;

  /**
   * Called after the tab stop moves to another item.
   */
  onActiveIdChange?: ((activeId: string | undefined) => void) | undefined;

  /**
   * Axes whose arrows move focus.
   */
  orientation: Orientation;

  /**
   * Whether a step past one end continues at the other.
   */
  wrap: boolean;
}

/**
 * Describes the result of useRovingFocus.
 */
export interface RovingFocus {
  /**
   * Context value to publish to the items.
   */
  group: Group;

  /**
   * Key handler for the root element. It ignores every key the orientation does not claim, so the
   * page still receives those keys.
   */
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

/**
 * Moves one tab stop across the items that register with the group.
 *
 * @remarks
 *   The first item to register takes the stop, so Tab reaches the group from its first render.
 *   When the item with the stop unmounts, the stop passes to the first remaining item in document
 *   order, so the group stays in the tab order.
 * @returns The context value for the items and the key handler for the root.
 */
export function useRovingFocus(props: RovingFocusProps): RovingFocus {
  const { orientation, wrap } = props;
  const { add, contains, ordered, remove } = useRegistry();
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

    if (!(target instanceof Node) || !contains(target)) return;

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
