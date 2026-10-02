/**
 * Renders the bar, the panel that contains the toolbar of actions.
 *
 * @remarks
 *   The caller puts a `Toolbar.Root` with an `aria-label` in the bar. The toolbar gives its
 *   controls one tab stop and the arrow keys. In a narrow window it moves the quieter actions into
 *   a menu. Escape inside the bar asks to close it while `closeOnEscape` is true. When the bar
 *   closes with focus inside it, focus returns to the element that had it when the bar opened,
 *   usually the checkbox that made the selection. Focus that a person moved elsewhere remains
 *   there. The bar rises from the bottom edge as it fades in, and is inert while it leaves.
 */

import { type ComponentProps, type KeyboardEvent, type ReactElement, useRef } from "react";

import { withContext } from "#action-bar/context.ts";
import { useActionBar, useBarPresence } from "#action-bar/state.ts";
import { useFocused } from "#focus/index.ts";

/**
 * Renders the `div` with the action bar's content class.
 */
const Drawn = withContext("div", "content");

/**
 * Describes the props of a `div` without `ref`, which the bar's presence sets.
 */
export type ContentProps = Omit<ComponentProps<typeof Drawn>, "ref">;

/**
 * Returns true for an Escape pressed on an element inside the bar that nothing handled.
 *
 * @remarks
 *   A menu the toolbar opens is portalled out of the bar, and React passes its keys up to the bar,
 *   so the target has to be inside the bar's own element.
 * @param event - The key event.
 */
function escaped(event: KeyboardEvent<HTMLDivElement>): boolean {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the target of a key event is a node
  const inside = event.currentTarget.contains(event.target as Node);

  return event.key === "Escape" && !event.defaultPrevented && inside;
}

/**
 * Renders the bar with its presence props, its Escape handler and the caller's props.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Content({ onKeyDown, ...props }: ContentProps): ReactElement {
  const { close, closeOnEscape, open } = useActionBar();
  const { props: presented, setNode } = useBarPresence();
  const node = useRef<HTMLDivElement | null>(null);

  useFocused(node, open, null);

  return (
    <Drawn
      {...presented}
      {...props}
      onKeyDown={(event) => {
        onKeyDown?.(event);

        if (closeOnEscape && escaped(event)) close();
      }}
      ref={(element: HTMLDivElement | null) => {
        node.current = element;
        setNode(element);
      }}
    />
  );
}
