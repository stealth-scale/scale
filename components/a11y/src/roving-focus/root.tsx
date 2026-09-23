/**
 * Renders the container of a roving focus group, which keeps one tab stop for its items.
 *
 * @remarks
 *   The element is a `div` with no role. The caller sets the role: `role="toolbar"` for a toolbar,
 *   `role="tablist"` for a tab list. `orientation` sets the arrow keys the group handles, the
 *   layout of the items and `aria-orientation`. The root writes `aria-orientation` only with a
 *   caller's role, because the attribute has no meaning on a generic element, and not for `both`.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { withProvider } from "#roving-focus/context.ts";
import {
  type Orientation,
  RovingFocusContext,
  useRovingFocus,
} from "#roving-focus/use-roving-focus.ts";

/**
 * Renders a `div` element with the root slot's classes.
 */
const Shell = withProvider("div", "root");

/**
 * Describes the props of RovingFocus.Root: the focus options and the props of a `div` element.
 */
export interface RootProps extends Omit<ComponentProps<typeof Shell>, "orientation"> {
  /**
   * Item with the tab stop when the caller controls the group.
   */
  activeId?: string | undefined;

  /**
   * Items of the group.
   */
  children?: ReactNode | undefined;

  /**
   * Item that Tab enters first when the group controls itself.
   */
  defaultActiveId?: string | undefined;

  /**
   * Called after the tab stop moves to another item.
   */
  onActiveIdChange?: ((activeId: string | undefined) => void) | undefined;

  /**
   * Axes whose arrows move focus. Defaults to `horizontal`.
   */
  orientation?: Orientation | undefined;

  /**
   * Whether a step past one end continues at the other.
   */
  wrap?: boolean | undefined;
}

/**
 * Keeps one tab stop for the items below it and moves the stop on the arrow keys.
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
