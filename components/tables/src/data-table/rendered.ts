/**
 * Renders a column's header, cell or footer template.
 *
 * @remarks
 *   TanStack's `flexRender` renders a template function as a component whose type is the function
 *   itself. Columns written inside a component create new functions on every render, so every cell
 *   would unmount and mount again, and a focused checkbox in a cell would lose focus. This
 *   component is the one type every template renders as, and it calls the template during its own
 *   render, so a template may call hooks as a component does.
 */

import { type ReactNode } from "react";

/**
 * Describes the props of a rendered template: the template and the context it receives.
 *
 * @typeParam Context - Type of the context the template receives.
 */
export interface RenderedProps<Context> {
  /**
   * Context of the header, cell or footer, with the table React renders the part with.
   */
  readonly context: Context;

  /**
   * Template of the column, which returns the content.
   */
  readonly render: (context: Context) => unknown;
}

/**
 * Renders the template's content for the context.
 *
 * @typeParam Context - Type of the context the template receives.
 * @param props - The template and its context.
 * @returns The content the template returns.
 */
export function Rendered<Context>({ context, render }: RenderedProps<Context>): ReactNode {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- TanStack types a template's result as any, and a column's template returns React content
  return render(context) as ReactNode;
}
