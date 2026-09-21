/**
 * Renders the container that owns the group's tab stop.
 *
 * @remarks
 *   The element is a `div` with no role of its own, because naming the control set is the caller's
 *   decision: a toolbar passes `role="toolbar"`, a tab strip passes `role="tablist"`. A single
 *   `orientation` prop feeds three things, the arrow keys the group responds to, the layout of the
 *   items, and `aria-orientation`. The attribute is emitted only when the caller has also supplied
 *   a role, since it carries no meaning on a generic element.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { withProvider } from "#roving-focus/context.ts";
import {
  type Orientation,
  RovingFocusContext,
  useRovingFocus,
} from "#roving-focus/use-roving-focus.ts";

/**
 * The styled element carrying the recipe's root slot.
 */
const Shell = withProvider("div", "root");

/**
 * Props of the group container: the focus behaviour below, plus everything the styled element
 * accepts.
 */
export interface RootProps extends Omit<ComponentProps<typeof Shell>, "orientation"> {
  /**
   * The item holding the tab stop when the caller controls the group.
   */
  activeId?: string | undefined;

  /**
   * The items the group lays out.
   */
  children?: ReactNode | undefined;

  /**
   * The item Tab enters first when the group controls itself.
   */
  defaultActiveId?: string | undefined;

  /**
   * Called after the tab stop moves to another item.
   */
  onActiveIdChange?: ((activeId: string | undefined) => void) | undefined;

  /**
   * The axes whose arrows move focus, horizontal unless the caller says otherwise.
   */
  orientation?: Orientation | undefined;

  /**
   * Whether a step past one end continues at the other.
   */
  wrap?: boolean | undefined;
}

/**
 * Keeps a single tab stop for the items below it and moves that stop on the arrow keys.
 */
export function Root(props: RootProps): ReactElement {
  const {
    activeId,
    children,
    defaultActiveId,
    onActiveIdChange,
    orientation = "horizontal",
    wrap = false,
    ...rest
  } = props;
  const { group, onKeyDown } = useRovingFocus({
    activeId,
    defaultActiveId,
    onActiveIdChange,
    orientation,
    wrap,
  });
  const told =
    rest.role !== undefined && orientation !== "both"
      ? { "aria-orientation": orientation }
      : undefined;

  return (
    <RovingFocusContext value={group}>
      <Shell onKeyDown={onKeyDown} orientation={orientation} {...told} {...rest}>
        {children}
      </Shell>
    </RovingFocusContext>
  );
}
