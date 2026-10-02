/**
 * Renders a scene's content with its first focusable element in the keyboard-focus state.
 *
 * @remarks
 *   The box sets `data-focus-visible` on the first focusable descendant after it mounts, or on the
 *   first descendant `target` selects, and removes it when it unmounts. Every `_focusVisible`
 *   condition compiles to `:is(:focus-visible, [data-focus-visible])`, so the descendant renders
 *   its focus styles without taking focus from the page. The attribute is staging, so it never
 *   appears in an example. The box is a `Contained`, so a descendant that is fixed under focus
 *   renders inside it. Use it for a focus style that is part of a control at rest, such as the
 *   ring on a toolbar's tab stop, and not for a control that is hidden until focus.
 */

import { type ComponentProps, type ReactElement, useEffect, useState } from "react";

import { Contained } from "#contained/contained.ts";

/**
 * Selects the elements a keyboard reaches with Tab.
 */
const FOCUSABLE = [
  "a[href]",
  "button:not(:disabled)",
  "input:not(:disabled)",
  "select:not(:disabled)",
  "textarea:not(:disabled)",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

/**
 * Describes the props of Focused: the descendant to mark and the props of a `div` element except
 * `ref`.
 */
export interface FocusedProps extends Omit<ComponentProps<typeof Contained>, "ref"> {
  /**
   * Selector of the descendant to mark, for a scene whose first focusable descendant is not the
   * control it shows. Defaults to the elements a keyboard reaches with Tab.
   */
  readonly target?: string | undefined;
}

/**
 * Renders its children and marks the first descendant `target` selects with `data-focus-visible`.
 */
export function Focused({ target = FOCUSABLE, ...props }: FocusedProps): ReactElement {
  const [box, setBox] = useState<HTMLDivElement | null>(null);

  useEffect((): (() => void) | undefined => {
    const marked = box?.querySelector<HTMLElement>(target);

    if (marked === undefined || marked === null) return undefined;

    marked.dataset["focusVisible"] = "";

    return () => {
      delete marked.dataset["focusVisible"];
    };
  }, [box, target]);

  return <Contained {...props} ref={setBox} />;
}
